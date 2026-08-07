from django.urls import path

from .views import gallery_image_detail, gallery_images

urlpatterns = [
    path("gallery/", gallery_images, name="gallery-list"),
    path("gallery/<int:pk>/", gallery_image_detail, name="gallery-detail"),
]
