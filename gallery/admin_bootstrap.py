import os

from django.contrib.auth import get_user_model


def ensure_configured_admin():
    username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
    email = os.environ.get("DJANGO_SUPERUSER_EMAIL") or username
    password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

    if not username or not password:
        return None

    User = get_user_model()
    user, created = User.objects.get_or_create(username=username, defaults={"email": email or ""})
    user.email = email or ""
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.set_password(password)
    user.save()

    if not user.check_password(password):
        raise RuntimeError("Admin password verification failed after saving.")

    return {"username": username, "created": created}
