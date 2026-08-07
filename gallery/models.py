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
