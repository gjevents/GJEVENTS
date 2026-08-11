from django.db import models
from django.utils import timezone


class GalleryImage(models.Model):
    section = models.CharField(max_length=120)
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to="gallery/")
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class HeroSlide(models.Model):
    image = models.ImageField(upload_to="hero/")
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    label_text = models.CharField(max_length=120, default="LIVE EVENT")
    heading_line_1 = models.CharField(max_length=160, default="Experience Events")
    heading_line_2 = models.CharField(max_length=160, default="Like Never Before")
    description = models.TextField(
        default="Professional Event Management | Premium Pass Distribution | Business Opportunities | Stall Bazaar"
    )
    button_1_text = models.CharField(max_length=80, default="Explore More")
    button_1_link = models.CharField(max_length=300, default="#about")
    button_2_text = models.CharField(max_length=80, default="Open B2B Portal")
    button_2_link = models.CharField(max_length=500, blank=True, default="")
    label_color = models.CharField(max_length=20, default="#D4AF37")
    heading_color = models.CharField(max_length=20, default="#FFF8E7")
    secondary_heading_color = models.CharField(max_length=20, default="#D4AF37")
    description_color = models.CharField(max_length=20, default="#FFF8E7")
    button_text_color = models.CharField(max_length=20, default="#3D2B1F")
    button_background_color = models.CharField(max_length=40, default="#D4AF37")
    label_font_size = models.PositiveIntegerField(default=12)
    heading_font_size = models.PositiveIntegerField(default=88)
    description_font_size = models.PositiveIntegerField(default=18)
    text_alignment = models.CharField(max_length=10, default="center")
    text_position_x = models.PositiveIntegerField(default=50)
    text_position_y = models.PositiveIntegerField(default=50)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "-created_at"]

    def __str__(self):
        return self.heading_line_1


class AboutImage(models.Model):
    image = models.ImageField(upload_to="about/")
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "-created_at"]

    def __str__(self):
        return f"About image {self.pk}"
