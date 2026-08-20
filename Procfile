web: python manage.py migrate && python manage.py ensure_admin && gunicorn gj_event_dashboard.wsgi:application --bind 0.0.0.0:$PORT
