from io import BytesIO

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.test.client import BOUNDARY, MULTIPART_CONTENT, encode_multipart
from django.urls import reverse
from PIL import Image

from .models import AboutImage, GalleryImage, HeroSlide


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


class ManagedImageAPITests(TestCase):
    def setUp(self):
        self.staff_user = get_user_model().objects.create_user(
            username="cms-admin",
            email="cms-admin@example.com",
            password="test-password-123",
            is_staff=True,
        )

    def create_test_image(self, name="managed.png", color="gold"):
        image_file = BytesIO()
        Image.new("RGB", (200, 200), color=color).save(image_file, format="PNG")
        image_file.seek(0)
        return SimpleUploadedFile(name, image_file.read(), content_type="image/png")

    def test_public_hero_slides_return_active_items_only(self):
        HeroSlide.objects.create(
            image=self.create_test_image("active.png"),
            is_active=True,
            display_order=2,
            heading_line_1="Active slide",
        )
        HeroSlide.objects.create(
            image=self.create_test_image("disabled.png", "orange"),
            is_active=False,
            display_order=1,
            heading_line_1="Disabled slide",
        )

        response = self.client.get(reverse("hero-slide-list"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(len(payload), 1)
        self.assertEqual(payload[0]["heading_line_1"], "Active slide")

    def test_create_hero_slide_requires_staff(self):
        response = self.client.post(
            reverse("hero-slide-list"),
            {"image": self.create_test_image()},
            format="multipart",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["error"], "Staff access is required.")

    def test_hero_slide_upload_limit_is_ten(self):
        self.client.force_login(self.staff_user)
        for index in range(10):
            HeroSlide.objects.create(
                image=self.create_test_image(f"slide-{index}.png"),
                display_order=index + 1,
            )

        response = self.client.post(
            reverse("hero-slide-list"),
            {"image": self.create_test_image("extra.png")},
            format="multipart",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("Maximum 10", response.json()["error"])

    def test_patch_hero_slide_settings_persists(self):
        self.client.force_login(self.staff_user)
        slide = HeroSlide.objects.create(image=self.create_test_image(), heading_line_1="Old")

        response = self.client.patch(
            reverse("hero-slide-detail", args=[slide.id]),
            encode_multipart(
                BOUNDARY,
                {
                    "heading_line_1": "New heading",
                    "text_alignment": "right",
                    "text_position_x": "88",
                    "image_position_x": "35",
                    "image_position_y": "70",
                    "image_zoom": "130",
                    "is_active": "false",
                },
            ),
            content_type=MULTIPART_CONTENT,
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["heading_line_1"], "New heading")
        self.assertEqual(payload["text_alignment"], "right")
        self.assertEqual(payload["text_position_x"], 88)
        self.assertEqual(payload["image_position_x"], 35)
        self.assertEqual(payload["image_position_y"], 70)
        self.assertEqual(payload["image_zoom"], 130)
        self.assertFalse(payload["is_active"])

    def test_about_images_upload_limit_is_ten(self):
        self.client.force_login(self.staff_user)
        for index in range(10):
            AboutImage.objects.create(
                image=self.create_test_image(f"about-{index}.png"),
                display_order=index + 1,
            )

        response = self.client.post(
            reverse("about-image-list"),
            {"image": self.create_test_image("extra-about.png")},
            format="multipart",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("Maximum 10", response.json()["error"])
