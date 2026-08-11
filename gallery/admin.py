from django.contrib import admin

from .models import AboutImage, GalleryImage, HeroSlide


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ("title", "section", "created_at")
    search_fields = ("title", "section")


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ("heading_line_1", "label_text", "is_active", "display_order", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("heading_line_1", "heading_line_2", "label_text")


@admin.register(AboutImage)
class AboutImageAdmin(admin.ModelAdmin):
    list_display = ("id", "is_active", "display_order", "updated_at")
    list_filter = ("is_active",)
