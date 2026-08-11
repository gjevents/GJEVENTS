import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "gj_event_dashboard.settings")
application = get_wsgi_application()

try:
    from django.db import OperationalError, ProgrammingError
    from gallery.admin_bootstrap import ensure_configured_admin

    ensure_configured_admin()
except (OperationalError, ProgrammingError):
    pass
