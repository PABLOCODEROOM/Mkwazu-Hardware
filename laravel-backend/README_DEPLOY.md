# Mkwazu Hardware Laravel Backend

This is the deployable Laravel API for Mkwazu Hardware.

## Local setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

API health check:

```bash
curl http://localhost:8000/api/v1/products
```

Default admin:

```text
Email: admin@mkwazuhardware.co.tz
Password: admin123
```

## Render settings

Create a Render Web Service from this repository and set:

```text
Root Directory: laravel-backend
Runtime: Docker
Start Command / Docker Command: sh ./render-start.sh
```

Free-tier Render services do not support pre-deploy commands, and Shell may require billing on some accounts. The Docker startup script runs this automatically:

```bash
php artisan mkwazu:boot
```

That command runs migrations and only seeds the database when there are no products yet.

Environment variables:

```env
APP_NAME="Mkwazu Hardware API"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-backend-name.onrender.com
FRONTEND_URLS=https://your-frontend-name.onrender.com
DB_CONNECTION=pgsql
DB_HOST=your-postgres-host
DB_PORT=5432
DB_DATABASE=your-postgres-database
DB_USERNAME=your-postgres-user
DB_PASSWORD=your-postgres-password
```

If you deploy without `render.yaml`, generate an app key locally:

```bash
php artisan key:generate --show
```

Copy the generated key into Render's `APP_KEY`, then deploy.
