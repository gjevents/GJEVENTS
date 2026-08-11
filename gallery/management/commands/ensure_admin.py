import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create or update the configured Django superuser from environment variables."

    def handle(self, *args, **options):
        username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL") or username
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

        if not username or not password:
            self.stdout.write(
                self.style.WARNING(
                    "Skipping admin setup. Set DJANGO_SUPERUSER_USERNAME and DJANGO_SUPERUSER_PASSWORD to enable it."
                )
            )
            return

        User = get_user_model()
        user, created = User.objects.get_or_create(username=username, defaults={"email": email or ""})
        user.email = email or ""
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.set_password(password)
        user.save()

        if not user.check_password(password):
            raise CommandError("Admin password verification failed after saving.")

        action = "Created" if created else "Updated"
        self.stdout.write(self.style.SUCCESS(f"{action} admin user: {username}"))
