from django.core.management.base import BaseCommand, CommandError

from gallery.admin_bootstrap import ensure_configured_admin


class Command(BaseCommand):
    help = "Create or update the configured Django superuser from environment variables."

    def handle(self, *args, **options):
        try:
            result = ensure_configured_admin()
        except RuntimeError as exc:
            raise CommandError(str(exc)) from exc

        if not result:
            self.stdout.write(
                self.style.WARNING(
                    "Skipping admin setup. Set DJANGO_SUPERUSER_USERNAME and DJANGO_SUPERUSER_PASSWORD to enable it."
                )
            )
            return

        action = "Created" if result["created"] else "Updated"
        self.stdout.write(self.style.SUCCESS(f"{action} admin user: {result['username']}"))
