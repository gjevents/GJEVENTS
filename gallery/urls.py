from django.urls import path

from .views import csrf_token, gallery_image_detail, gallery_images

urlpatterns = [
    path("csrf/", csrf_token, name="csrf-token"),
    path("gallery/", gallery_images, name="gallery-list"),
    path("gallery/<int:pk>/", gallery_image_detail, name="gallery-detail"),
]
