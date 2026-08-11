from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("gallery", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="AboutImage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("image", models.ImageField(upload_to="about/")),
                ("is_active", models.BooleanField(default=True)),
                ("display_order", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["display_order", "-created_at"],
            },
        ),
        migrations.CreateModel(
            name="HeroSlide",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("image", models.ImageField(upload_to="hero/")),
                ("is_active", models.BooleanField(default=True)),
                ("display_order", models.PositiveIntegerField(default=0)),
                ("label_text", models.CharField(default="LIVE EVENT", max_length=120)),
                ("heading_line_1", models.CharField(default="Experience Events", max_length=160)),
                ("heading_line_2", models.CharField(default="Like Never Before", max_length=160)),
                ("description", models.TextField(default="Professional Event Management | Premium Pass Distribution | Business Opportunities | Stall Bazaar")),
                ("button_1_text", models.CharField(default="Explore More", max_length=80)),
                ("button_1_link", models.CharField(default="#about", max_length=300)),
                ("button_2_text", models.CharField(default="Open B2B Portal", max_length=80)),
                ("button_2_link", models.CharField(blank=True, default="", max_length=500)),
                ("label_color", models.CharField(default="#D4AF37", max_length=20)),
                ("heading_color", models.CharField(default="#FFF8E7", max_length=20)),
                ("secondary_heading_color", models.CharField(default="#D4AF37", max_length=20)),
                ("description_color", models.CharField(default="#FFF8E7", max_length=20)),
                ("button_text_color", models.CharField(default="#3D2B1F", max_length=20)),
                ("button_background_color", models.CharField(default="#D4AF37", max_length=40)),
                ("label_font_size", models.PositiveIntegerField(default=12)),
                ("heading_font_size", models.PositiveIntegerField(default=88)),
                ("description_font_size", models.PositiveIntegerField(default=18)),
                ("text_alignment", models.CharField(default="center", max_length=10)),
                ("text_position_x", models.PositiveIntegerField(default=50)),
                ("text_position_y", models.PositiveIntegerField(default=50)),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["display_order", "-created_at"],
            },
        ),
    ]
