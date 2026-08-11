from django.http import JsonResponse


def _is_api_request(request):
    return request.path.startswith("/api/")


def csrf_failure(request, reason=""):
    if _is_api_request(request):
        return JsonResponse({"error": "CSRF verification failed.", "reason": reason}, status=403)
    return JsonResponse({"error": "CSRF verification failed."}, status=403)


def bad_request(request, exception=None):
    if _is_api_request(request):
        return JsonResponse({"error": "Bad request."}, status=400)
    return JsonResponse({"error": "Bad request."}, status=400)


def permission_denied(request, exception=None):
    if _is_api_request(request):
        return JsonResponse({"error": "Permission denied."}, status=403)
    return JsonResponse({"error": "Permission denied."}, status=403)


def page_not_found(request, exception=None):
    if _is_api_request(request):
        return JsonResponse({"error": "API endpoint not found."}, status=404)
    return JsonResponse({"error": "Page not found."}, status=404)


def server_error(request):
    if _is_api_request(request):
        return JsonResponse({"error": "Internal server error."}, status=500)
    return JsonResponse({"error": "Internal server error."}, status=500)
