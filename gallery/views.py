import os

from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from PIL import Image as PILImage

from .models import GalleryImage


ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024


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


@csrf_exempt
@require_http_methods(["GET", "POST"])
def gallery_images(request):
    if request.method == "GET":
        images = GalleryImage.objects.all()
        data = []
        for item in images:
            data.append(
                {
                    "id": item.id,
                    "section": item.section,
                    "title": item.title,
                    "image": item.image.url if item.image else None,
                    "created_at": item.created_at.isoformat(),
                    "updated_at": item.updated_at.isoformat(),
                }
            )
        return JsonResponse(data, safe=False)

    if request.method == "POST":
        try:
            _validate_image(request.FILES["image"])
        except (KeyError, ValidationError) as exc:
            return JsonResponse({"error": str(exc)}, status=400)

        instance = GalleryImage(
            section=request.POST.get("section", "General"),
            title=request.POST.get("title", request.FILES["image"].name),
            image=request.FILES["image"],
        )
        instance.save()
        return JsonResponse(
            {
                "id": instance.id,
                "section": instance.section,
                "title": instance.title,
                "image": instance.image.url,
                "created_at": instance.created_at.isoformat(),
                "updated_at": instance.updated_at.isoformat(),
            },
            status=201,
        )

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
@require_http_methods(["PUT", "DELETE"])
def gallery_image_detail(request, pk):
    try:
        instance = GalleryImage.objects.get(pk=pk)
    except GalleryImage.DoesNotExist:
        return JsonResponse({"error": "Image not found"}, status=404)

    if request.method == "PUT":
        uploaded_file = request.FILES.get("image")
        if not uploaded_file:
            return JsonResponse({"error": "An image file is required"}, status=400)
        try:
            _validate_image(uploaded_file)
        except ValidationError as exc:
            return JsonResponse({"error": str(exc)}, status=400)

        if instance.image:
            image_path = instance.image.path
            if os.path.exists(image_path):
                os.remove(image_path)
        instance.image = uploaded_file
        instance.title = request.POST.get("title", instance.title)
        instance.section = request.POST.get("section", instance.section)
        instance.save()
        return JsonResponse(
            {
                "id": instance.id,
                "section": instance.section,
                "title": instance.title,
                "image": instance.image.url,
                "created_at": instance.created_at.isoformat(),
                "updated_at": instance.updated_at.isoformat(),
            }
        )

    if request.method == "DELETE":
        if instance.image:
            image_path = instance.image.path
            if os.path.exists(image_path):
                os.remove(image_path)
        instance.delete()
        return JsonResponse({"message": "Image deleted successfully"})

    return JsonResponse({"error": "Method not allowed"}, status=405)
