from django.contrib import admin
from django.urls import include, path, re_path
from django.http import FileResponse, Http404
from django.views.generic import TemplateView
from django.views.static import serve
from django.conf import settings
from django.conf.urls.static import static
import os

# Serve React app (SPA)
class ReactAppView(TemplateView):
    template_name = "index.html"
    content_type = "text/html"

    def get_context_data(self, **kwargs):
        return super().get_context_data(**kwargs)

def serve_static(request, path, document_root=None, **kwargs):
    """Serve static files from dist"""
    return serve(request, path, document_root or settings.STATIC_ROOT, **kwargs)


def favicon_view(request):
    if request.path.endswith(".ico"):
        file_name = "favicon.ico"
        content_type = "image/x-icon"
    else:
        file_name = "favicon.svg"
        content_type = "image/svg+xml"

    favicon_path = os.path.join(settings.BASE_DIR, "dist", file_name)
    if not os.path.exists(favicon_path):
        raise Http404("favicon not found")
    return FileResponse(open(favicon_path, "rb"), content_type=content_type)

urlpatterns = [
    re_path(r"^admin/gallery(?:/.*)?$", ReactAppView.as_view()),
    path("admin/", admin.site.urls),
    path("api/", include("gallery.urls")),
    # Serve static assets (CSS, JS, etc.)
    re_path(r"^assets/(?P<path>.*)$", serve_static, {"document_root": os.path.join(settings.BASE_DIR, "dist", "assets")} ),
    path("favicon.svg", favicon_view),
    path("favicon.ico", favicon_view),
    path("sitemap.xml", serve_static, {"document_root": os.path.join(settings.BASE_DIR, "dist"), "path": "sitemap.xml"}),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    re_path(r"^(?!admin).*$", ReactAppView.as_view()),
]
