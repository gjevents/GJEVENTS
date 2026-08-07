# GJ Events

React/Vite website with a Django gallery API and staff-only gallery upload admin.

## Local Run

Install frontend dependencies:

```powershell
npm install
```

Run the Django site and upload API:

```powershell
python manage.py migrate
python manage.py runserver
```

Open:

```text
http://127.0.0.1:8000/
http://127.0.0.1:8000/admin/login/
http://127.0.0.1:8000/admin/gallery
```

## Live Gallery Upload Setup

GitHub Pages is static, so uploaded photos cannot be saved directly inside GitHub Pages. Deploy the Django backend on a live server, then point the GitHub Pages build to that backend.

Recommended setup:

1. Deploy this repository as a Django web service.
2. Set backend environment variables:
   - `DJANGO_DEBUG=False`
   - `DJANGO_SECRET_KEY=<secure random value>`
   - `DJANGO_ALLOWED_HOSTS=<backend-domain>,gjevents.in,www.gjevents.in`
   - `DJANGO_CSRF_TRUSTED_ORIGINS=https://<backend-domain>,https://gjevents.in,https://www.gjevents.in,https://gjevents.github.io`
   - `DJANGO_CORS_ALLOWED_ORIGINS=https://gjevents.in,https://www.gjevents.in,https://gjevents.github.io`
   - `DJANGO_MEDIA_ROOT=<persistent media folder>`
3. Add this GitHub Actions repository variable:
   - `VITE_API_BASE_URL=https://<backend-domain>`
4. Re-run the GitHub Pages workflow.

Client flow after deployment:

```text
https://<backend-domain>/admin/login/
https://gjevents.github.io/GJEVENTS/admin/gallery
```

After login, uploaded images are saved on the live backend and the public gallery reads them from the backend API.
