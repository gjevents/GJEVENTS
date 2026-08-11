from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("gallery", "0002_aboutimage_heroslide"),
    ]

    operations = [
        migrations.AddField(
            model_name="heroslide",
            name="image_position_x",
            field=models.PositiveIntegerField(default=50),
        ),
        migrations.AddField(
            model_name="heroslide",
            name="image_position_y",
            field=models.PositiveIntegerField(default=50),
        ),
        migrations.AddField(
            model_name="heroslide",
            name="image_zoom",
            field=models.PositiveIntegerField(default=105),
        ),
    ]
