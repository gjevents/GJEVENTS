from io import BytesIO

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from PIL import Image

from .models import GalleryImage


class GalleryImageAPITests(TestCase):
    def create_test_image(self):
        image_file = BytesIO()
        Image.new("RGB", (200, 200), color="gold").save(image_file, format="PNG")
        image_file.seek(0)
        return SimpleUploadedFile("test.png", image_file.read(), content_type="image/png")

    def test_get_gallery_images_returns_list(self):
        GalleryImage.objects.create(section="Events", title="Opening", image=self.create_test_image())

        response = self.client.get(reverse("gallery-list"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_create_gallery_image_saves_file_and_returns_201(self):
        response = self.client.post(
            reverse("gallery-list"),
            {
                "section": "Events",
                "title": "Opening",
                "image": self.create_test_image(),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(GalleryImage.objects.filter(title="Opening").exists())
