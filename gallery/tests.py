from io import BytesIO

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.test.client import BOUNDARY, MULTIPART_CONTENT, encode_multipart
from django.urls import reverse
from PIL import Image

from .models import GalleryImage


class GalleryImageAPITests(TestCase):
    def setUp(self):
        self.staff_user = get_user_model().objects.create_user(
            username="gallery-admin",
            email="gallery-admin@example.com",
            password="test-password-123",
            is_staff=True,
        )

    def create_test_image(self):
        image_file = BytesIO()
        Image.new("RGB", (200, 200), color="gold").save(image_file, format="PNG")
        image_file.seek(0)
        return SimpleUploadedFile("test.png", image_file.read(), content_type="image/png")

    def create_second_test_image(self):
        image_file = BytesIO()
        Image.new("RGB", (200, 200), color="orange").save(image_file, format="PNG")
        image_file.seek(0)
        return SimpleUploadedFile("replacement.png", image_file.read(), content_type="image/png")

    def test_get_gallery_images_returns_list(self):
        GalleryImage.objects.create(section="Events", title="Opening", image=self.create_test_image())

        response = self.client.get(reverse("gallery-list"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_create_gallery_image_saves_file_and_returns_201(self):
        self.client.force_login(self.staff_user)

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

    def test_create_gallery_image_requires_staff(self):
        response = self.client.post(
            reverse("gallery-list"),
            {
                "section": "Events",
                "title": "Opening",
                "image": self.create_test_image(),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response["Content-Type"], "application/json")

    def test_csrf_endpoint_returns_json_token(self):
        response = self.client.get(reverse("csrf-token"))

        self.assertEqual(response.status_code, 200)
        self.assertIn("csrfToken", response.json())

    def test_delete_gallery_image_removes_record_and_returns_json(self):
        self.client.force_login(self.staff_user)
        image = GalleryImage.objects.create(section="Events", title="Opening", image=self.create_test_image())

        response = self.client.delete(reverse("gallery-detail", args=[image.id]))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/json")
        self.assertFalse(GalleryImage.objects.filter(id=image.id).exists())

    def test_put_gallery_image_replaces_file_and_returns_json(self):
        self.client.force_login(self.staff_user)
        image = GalleryImage.objects.create(section="Events", title="Opening", image=self.create_test_image())

        response = self.client.put(
            reverse("gallery-detail", args=[image.id]),
            encode_multipart(
                BOUNDARY,
                {
                    "section": "Updated",
                    "title": "Replacement",
                    "image": self.create_second_test_image(),
                },
            ),
            content_type=MULTIPART_CONTENT,
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["section"], "Updated")
        self.assertEqual(payload["title"], "Replacement")
        self.assertIn("replacement", payload["image"])

    def test_patch_gallery_image_updates_metadata_and_returns_json(self):
        self.client.force_login(self.staff_user)
        image = GalleryImage.objects.create(section="Events", title="Opening", image=self.create_test_image())

        response = self.client.patch(
            reverse("gallery-detail", args=[image.id]),
            encode_multipart(
                BOUNDARY,
                {
                    "section": "Updated",
                    "title": "Replacement",
                },
            ),
            content_type=MULTIPART_CONTENT,
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["section"], "Updated")
        self.assertEqual(payload["title"], "Replacement")
