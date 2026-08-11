from io import BytesIO

from django.core.exceptions import ValidationError
from django.http import QueryDict
from django.http import JsonResponse
from django.http.multipartparser import MultiPartParser, MultiPartParserError
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from PIL import Image as PILImage

from .models import GalleryImage


ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024


def _gallery_payload(instance):
    return {
        "id": instance.id,
        "section": instance.section,
        "title": instance.title,
        "image": instance.image.url if instance.image else None,
        "created_at": instance.created_at.isoformat(),
        "updated_at": instance.updated_at.isoformat(),
    }


def _parse_body_files(request):
    if request.method == "POST":
        return request.POST, request.FILES, None

    content_type = request.META.get("CONTENT_TYPE", "")
    if content_type.startswith("multipart/form-data"):
        try:
            return (*MultiPartParser(request.META, BytesIO(request.body), request.upload_handlers, request.encoding).parse(), None)
        except MultiPartParserError as exc:
            return QueryDict(mutable=True), {}, str(exc)

    return QueryDict(request.body, encoding=request.encoding), {}, None


def _validate_image(file_obj):
    if file_obj.content_type not in ALLOWED_CONTENT_TYPES:
        raise ValidationError("Only JPG, JPEG, PNG, and WEBP files are allowed.")
    if file_obj.size > MAX_FILE_SIZE:
        raise ValidationError("Image size must be 5MB or less.")

    try:
        file_obj.open()
        with PILImage.open(file_obj) as img:
            img.verify()
    except Exception as exc:
        raise ValidationError("The uploaded file is not a valid image.") from exc

    file_obj.seek(0)


def _require_staff(request):
    if request.user.is_authenticated and request.user.is_staff:
        return None
    return JsonResponse({"error": "Staff access is required."}, status=403)


@ensure_csrf_cookie
def csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})


@require_http_methods(["GET", "POST"])
def gallery_images(request):
    if request.method == "GET":
        images = GalleryImage.objects.all()
        data = [_gallery_payload(item) for item in images]
        return JsonResponse(data, safe=False)

    if request.method == "POST":
        staff_error = _require_staff(request)
        if staff_error:
            return staff_error

        data, files, parse_error = _parse_body_files(request)
        if parse_error:
            return JsonResponse({"error": parse_error}, status=400)

        try:
            uploaded_file = files["image"]
            _validate_image(uploaded_file)
        except (KeyError, ValidationError) as exc:
            return JsonResponse({"error": str(exc)}, status=400)

        instance = GalleryImage(
            section=data.get("section", "General"),
            title=data.get("title", uploaded_file.name),
            image=uploaded_file,
        )
        instance.save()
        return JsonResponse(_gallery_payload(instance), status=201)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@require_http_methods(["PUT", "PATCH", "DELETE"])
def gallery_image_detail(request, pk):
    staff_error = _require_staff(request)
    if staff_error:
        return staff_error

    try:
        instance = GalleryImage.objects.get(pk=pk)
    except GalleryImage.DoesNotExist:
        return JsonResponse({"error": "Image not found"}, status=404)

    if request.method in {"PUT", "PATCH"}:
        data, files, parse_error = _parse_body_files(request)
        if parse_error:
            return JsonResponse({"error": parse_error}, status=400)

        uploaded_file = files.get("image")
        if request.method == "PUT" and not uploaded_file:
            return JsonResponse({"error": "An image file is required"}, status=400)

        old_image_name = instance.image.name if instance.image else ""
        storage = instance.image.storage if instance.image else None
        if uploaded_file:
            try:
                _validate_image(uploaded_file)
            except ValidationError as exc:
                return JsonResponse({"error": str(exc)}, status=400)
            instance.image = uploaded_file

        instance.title = data.get("title", instance.title)
        instance.section = data.get("section", instance.section)
        instance.save()

        if uploaded_file and storage and old_image_name and old_image_name != instance.image.name:
            storage.delete(old_image_name)

        return JsonResponse(_gallery_payload(instance))

    if request.method == "DELETE":
        if instance.image:
            instance.image.delete(save=False)
        instance.delete()
        return JsonResponse({"message": "Image deleted successfully"})

    return JsonResponse({"error": "Method not allowed"}, status=405)
