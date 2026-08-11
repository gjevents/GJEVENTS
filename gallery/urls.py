from django.urls import path

from .views import (
    about_image_detail,
    about_images,
    about_images_reorder,
    csrf_token,
    gallery_image_detail,
    gallery_images,
    hero_slide_detail,
    hero_slides,
    hero_slides_reorder,
)

urlpatterns = [
    path("csrf/", csrf_token, name="csrf-token"),
    path("hero-slides/", hero_slides, name="hero-slide-list"),
    path("hero-slides/reorder/", hero_slides_reorder, name="hero-slide-reorder"),
    path("hero-slides/<int:pk>/", hero_slide_detail, name="hero-slide-detail"),
    path("about-images/", about_images, name="about-image-list"),
    path("about-images/reorder/", about_images_reorder, name="about-image-reorder"),
    path("about-images/<int:pk>/", about_image_detail, name="about-image-detail"),
    path("gallery/", gallery_images, name="gallery-list"),
    path("gallery/<int:pk>/", gallery_image_detail, name="gallery-detail"),
]
