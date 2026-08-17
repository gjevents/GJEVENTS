import os
from io import BytesIO

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.files.storage import default_storage
from django.db import connection
from django.http import QueryDict
from django.http import JsonResponse
from django.http.multipartparser import MultiPartParser, MultiPartParserError
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from PIL import Image as PILImage

from .models import AboutImage, GalleryImage, HeroSlide


ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024
MAX_MANAGED_IMAGES = 10
HERO_FIELDS = {
    "is_active": "bool",
    "display_order": "int",
    "label_text": "str",
    "heading_line_1": "str",
    "heading_line_2": "str",
    "description": "str",
    "button_1_text": "str",
    "button_1_link": "str",
    "button_2_text": "str",
    "button_2_link": "str",
    "label_color": "str",
    "heading_color": "str",
    "secondary_heading_color": "str",
    "description_color": "str",
    "button_text_color": "str",
    "button_background_color": "str",
    "label_font_size": "int",
    "heading_font_size": "int",
    "description_font_size": "int",
    "text_alignment": "choice",
    "text_position_x": "int",
    "text_position_y": "int",
    "image_position_x": "int",
    "image_position_y": "int",
    "image_zoom": "int",
}
ABOUT_FIELDS = {"is_active": "bool", "display_order": "int"}


def _gallery_payload(instance):
    return {
        "id": instance.id,
        "section": instance.section,
        "title": instance.title,
        "image": instance.image.url if instance.image else None,
        "created_at": instance.created_at.isoformat(),
        "updated_at": instance.updated_at.isoformat(),
    }


def _bool_value(value):
    if isinstance(value, bool):
        return value
    return str(value).lower() in {"1", "true", "yes", "on"}


def _int_value(value, fallback=0, minimum=None, maximum=None):
    try:
        result = int(value)
    except (TypeError, ValueError):
        result = fallback
    if minimum is not None:
        result = max(minimum, result)
    if maximum is not None:
        result = min(maximum, result)
    return result


def _apply_fields(instance, data, fields):
    for field, field_type in fields.items():
        if field not in data:
            continue
        value = data.get(field)
        if field_type == "bool":
            setattr(instance, field, _bool_value(value))
        elif field_type == "int":
            max_value = 160 if field == "image_zoom" else 100 if field.endswith("_position_x") or field.endswith("_position_y") else None
            min_value = 100 if field == "image_zoom" else 0
            setattr(instance, field, _int_value(value, getattr(instance, field), min_value, max_value))
        elif field_type == "choice":
            setattr(instance, field, value if value in {"left", "center", "right"} else "center")
        else:
            setattr(instance, field, value)


def _hero_payload(instance):
    return {
        "id": instance.id,
        "image": instance.image.url if instance.image else None,
        "is_active": instance.is_active,
        "display_order": instance.display_order,
        "label_text": instance.label_text,
        "heading_line_1": instance.heading_line_1,
        "heading_line_2": instance.heading_line_2,
        "description": instance.description,
        "button_1_text": instance.button_1_text,
        "button_1_link": instance.button_1_link,
        "button_2_text": instance.button_2_text,
        "button_2_link": instance.button_2_link,
        "label_color": instance.label_color,
        "heading_color": instance.heading_color,
        "secondary_heading_color": instance.secondary_heading_color,
        "description_color": instance.description_color,
        "button_text_color": instance.button_text_color,
        "button_background_color": instance.button_background_color,
        "label_font_size": instance.label_font_size,
        "heading_font_size": instance.heading_font_size,
        "description_font_size": instance.description_font_size,
        "text_alignment": instance.text_alignment,
        "text_position_x": instance.text_position_x,
        "text_position_y": instance.text_position_y,
        "image_position_x": instance.image_position_x,
        "image_position_y": instance.image_position_y,
        "image_zoom": instance.image_zoom,
        "created_at": instance.created_at.isoformat(),
        "updated_at": instance.updated_at.isoformat(),
    }


def _about_payload(instance):
    return {
        "id": instance.id,
        "image": instance.image.url if instance.image else None,
        "is_active": instance.is_active,
        "display_order": instance.display_order,
        "created_at": instance.created_at.isoformat(),
        "updated_at": instance.updated_at.isoformat(),
    }


def _queryset_for_request(request, model):
    queryset = model.objects.all()
    if request.GET.get("all") == "1":
        staff_error = _require_staff(request)
        if staff_error:
            return None, staff_error
        return queryset, None
    return queryset.filter(is_active=True), None


def _next_order(model):
    latest = model.objects.order_by("-display_order").first()
    return (latest.display_order + 1) if latest else 1


def _delete_file(instance):
    if instance.image:
        instance.image.delete(save=False)


def _save_image_instance(instance):
    try:
        instance.save()
    except Exception as exc:
        return f"Image could not be saved. Check that media storage is configured and writable. Details: {exc}"

    if instance.image and not instance.image.storage.exists(instance.image.name):
        return "Image record was saved, but the uploaded file was not found in media storage."

    return None


def _managed_images(request, model, payload_fn, fields):
    if request.method == "GET":
        queryset, error = _queryset_for_request(request, model)
        if error:
            return error
        return JsonResponse([payload_fn(item) for item in queryset], safe=False)

    staff_error = _require_staff(request)
    if staff_error:
        return staff_error

    if model.objects.count() >= MAX_MANAGED_IMAGES:
        return JsonResponse({"error": "Maximum 10 images allowed for this section."}, status=400)

    data, files, parse_error = _parse_body_files(request)
    if parse_error:
        return JsonResponse({"error": parse_error}, status=400)

    try:
        uploaded_file = files["image"]
        _validate_image(uploaded_file)
    except (KeyError, ValidationError) as exc:
        return JsonResponse({"error": str(exc)}, status=400)

    instance = model(image=uploaded_file, display_order=_int_value(data.get("display_order"), _next_order(model)))
    _apply_fields(instance, data, fields)
    save_error = _save_image_instance(instance)
    if save_error:
        return JsonResponse({"error": save_error}, status=500)
    return JsonResponse(payload_fn(instance), status=201)


def _managed_image_detail(request, model, payload_fn, fields, pk):
    staff_error = _require_staff(request)
    if staff_error:
        return staff_error

    try:
        instance = model.objects.get(pk=pk)
    except model.DoesNotExist:
        return JsonResponse({"error": "Image not found"}, status=404)

    if request.method in {"PUT", "PATCH"}:
        data, files, parse_error = _parse_body_files(request)
        if parse_error:
            return JsonResponse({"error": parse_error}, status=400)

        uploaded_file = files.get("image")
        if request.method == "PUT" and not uploaded_file and not data:
            return JsonResponse({"error": "No changes were provided."}, status=400)

        old_image_name = instance.image.name if instance.image else ""
        storage = instance.image.storage if instance.image else None
        if uploaded_file:
            try:
                _validate_image(uploaded_file)
            except ValidationError as exc:
                return JsonResponse({"error": str(exc)}, status=400)
            instance.image = uploaded_file

        _apply_fields(instance, data, fields)
        save_error = _save_image_instance(instance)
        if save_error:
            return JsonResponse({"error": save_error}, status=500)

        if uploaded_file and storage and old_image_name and old_image_name != instance.image.name:
            storage.delete(old_image_name)

        return JsonResponse(payload_fn(instance))

    if request.method == "DELETE":
        _delete_file(instance)
        instance.delete()
        return JsonResponse({"message": "Image deleted successfully"})

    return JsonResponse({"error": "Method not allowed"}, status=405)


def _reorder_images(request, model, payload_fn):
    staff_error = _require_staff(request)
    if staff_error:
        return staff_error
    data, _, parse_error = _parse_body_files(request)
    if parse_error:
        return JsonResponse({"error": parse_error}, status=400)

    ids = data.getlist("ids[]") or data.getlist("ids")
    if not ids and data.get("ids"):
        ids = [value.strip() for value in data.get("ids", "").split(",") if value.strip()]
    for order, item_id in enumerate(ids, start=1):
        model.objects.filter(pk=_int_value(item_id)).update(display_order=order)
    return JsonResponse([payload_fn(item) for item in model.objects.all()], safe=False)


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


@require_http_methods(["GET"])
def storage_status(request):
    media_root = str(settings.MEDIA_ROOT)
    database_name = str(connection.settings_dict.get("NAME", ""))
    missing_files = {
        "hero": sum(1 for item in HeroSlide.objects.exclude(image="") if not item.image.storage.exists(item.image.name)),
        "about": sum(1 for item in AboutImage.objects.exclude(image="") if not item.image.storage.exists(item.image.name)),
        "gallery": sum(1 for item in GalleryImage.objects.exclude(image="") if not item.image.storage.exists(item.image.name)),
    }
    writable = False
    write_error = ""
    probe_path = os.path.join(media_root, ".storage_probe")

    try:
        os.makedirs(media_root, exist_ok=True)
        with open(probe_path, "w", encoding="utf-8") as probe:
            probe.write("ok")
        os.remove(probe_path)
        writable = True
    except OSError as exc:
        write_error = str(exc)

    return JsonResponse(
        {
            "default_storage": f"{default_storage.__class__.__module__}.{default_storage.__class__.__name__}",
            "cloudinary_enabled": bool(getattr(settings, "USE_CLOUDINARY_STORAGE", False)),
            "media_root": media_root,
            "media_root_exists": os.path.isdir(media_root),
            "media_root_writable": writable,
            "media_root_write_error": write_error,
            "database_name": database_name,
            "database_exists": os.path.exists(database_name) if database_name else False,
            "counts": {
                "hero": HeroSlide.objects.count(),
                "about": AboutImage.objects.count(),
                "gallery": GalleryImage.objects.count(),
            },
            "missing_files": missing_files,
        }
    )


@require_http_methods(["GET", "POST"])
def hero_slides(request):
    try:
        return _managed_images(request, HeroSlide, _hero_payload, HERO_FIELDS)
    except Exception as exc:
        import logging
        logging.error(f"Error in hero_slides: {exc}")
        if request.method == "GET":
            return JsonResponse([], safe=False, status=200)
        return JsonResponse({"error": str(exc)}, status=500)


@require_http_methods(["PUT", "PATCH", "DELETE"])
def hero_slide_detail(request, pk):
    return _managed_image_detail(request, HeroSlide, _hero_payload, HERO_FIELDS, pk)


@require_http_methods(["PATCH"])
def hero_slides_reorder(request):
    return _reorder_images(request, HeroSlide, _hero_payload)


@require_http_methods(["GET", "POST"])
def about_images(request):
    try:
        return _managed_images(request, AboutImage, _about_payload, ABOUT_FIELDS)
    except Exception as exc:
        import logging
        logging.error(f"Error in about_images: {exc}")
        if request.method == "GET":
            return JsonResponse([], safe=False, status=200)
        return JsonResponse({"error": str(exc)}, status=500)


@require_http_methods(["PUT", "PATCH", "DELETE"])
def about_image_detail(request, pk):
    return _managed_image_detail(request, AboutImage, _about_payload, ABOUT_FIELDS, pk)


@require_http_methods(["PATCH"])
def about_images_reorder(request):
    return _reorder_images(request, AboutImage, _about_payload)


@require_http_methods(["GET", "POST"])
def gallery_images(request):
    try:
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
            save_error = _save_image_instance(instance)
            if save_error:
                return JsonResponse({"error": save_error}, status=500)
            return JsonResponse(_gallery_payload(instance), status=201)

        return JsonResponse({"error": "Method not allowed"}, status=405)
    except Exception as exc:
        import logging
        logging.error(f"Error in gallery_images: {exc}")
        if request.method == "GET":
            return JsonResponse([], safe=False, status=200)
        return JsonResponse({"error": str(exc)}, status=500)


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
        save_error = _save_image_instance(instance)
        if save_error:
            return JsonResponse({"error": save_error}, status=500)

        if uploaded_file and storage and old_image_name and old_image_name != instance.image.name:
            storage.delete(old_image_name)

        return JsonResponse(_gallery_payload(instance))

    if request.method == "DELETE":
        if instance.image:
            instance.image.delete(save=False)
        instance.delete()
        return JsonResponse({"message": "Image deleted successfully"})

    return JsonResponse({"error": "Method not allowed"}, status=405)
