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

1. Deploy this repository as a Django web service on Render.
   - Uploaded image files are stored in Cloudinary.
   - Image records must be stored in a permanent Postgres database using `DATABASE_URL`.
   - Without `DATABASE_URL`, Render will fall back to SQLite on temporary storage and image records can disappear after restarts, redeploys, or idle recovery.
2. Set backend environment variables:
   - `DJANGO_DEBUG=False`
   - `DJANGO_SECRET_KEY=<secure random value>`
   - `DJANGO_ALLOWED_HOSTS=gjevents-bfjz.onrender.com,gjevents.in,www.gjevents.in`
   - `DJANGO_CSRF_TRUSTED_ORIGINS=https://gjevents-bfjz.onrender.com,https://gjevents.in,https://www.gjevents.in,https://gjevents.github.io`
   - `DJANGO_CORS_ALLOWED_ORIGINS=https://gjevents.in,https://www.gjevents.in,https://gjevents.github.io`
   - `DATABASE_URL=<your hosted Postgres connection string>`
   - `CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>`
   - `CLOUDINARY_API_KEY=<your Cloudinary API key>`
   - `CLOUDINARY_API_SECRET=<your Cloudinary API secret>`
   - `DJANGO_SUPERUSER_USERNAME=<admin username>`
   - `DJANGO_SUPERUSER_EMAIL=<admin email>`
   - `DJANGO_SUPERUSER_PASSWORD=<admin password>`
3. Add this GitHub Actions repository variable:
   - `VITE_API_BASE_URL=https://gjevents-bfjz.onrender.com`
4. Re-run the GitHub Pages workflow.

Client flow after deployment:

```text
https://gjevents-bfjz.onrender.com/admin/login/
https://gjevents.in/admin/gallery
```

After login, uploaded image files are saved in Cloudinary, image records are saved in Postgres, and the public gallery reads them from the backend API.

Use this endpoint after deployment to confirm production storage:

```text
https://gjevents-bfjz.onrender.com/api/storage-status/
```

Expected Cloudinary setup:

```json
"cloudinary_enabled": true
```

Push changes:

```powershell
git status
git add .
git commit -m "Fix gallery backend integration"
git push origin main
```
