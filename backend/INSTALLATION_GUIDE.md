# Laravel Backend Installation Guide

## Step-by-Step Setup

### 1. Prerequisites

Ensure you have the following installed:
- **PHP** 8.1 or higher
- **Composer** (latest version)
- **MySQL** 8.0 or higher
- **Node.js** and npm (for frontend build)

Check versions:
```bash
php -v
composer -v
mysql --version
node -v
npm -v
```

### 2. Create Laravel Project

```bash
composer create-project laravel/laravel mkwazu-backend
cd mkwazu-backend
```

### 3. Copy Backend Files

Copy all files from the `backend/` directory to your Laravel project:

```bash
# Migrations
cp backend/migrations/* database/migrations/

# Models
cp backend/models/* app/Models/

# Controllers
mkdir -p app/Http/Controllers/Api
mkdir -p app/Http/Controllers/Admin
cp backend/controllers/Api/* app/Http/Controllers/Api/
cp backend/controllers/Admin/* app/Http/Controllers/Admin/

# Requests
mkdir -p app/Http/Requests
cp backend/requests/* app/Http/Requests/

# Routes
cp backend/routes/api.php routes/

# Seeders
cp backend/seeders/* database/seeders/

# Config
cp backend/config/cors.php config/

# Environment
cp backend/.env.example .env
```

### 4. Install Laravel Sanctum

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 5. Configure Environment

Edit `.env` file:

```env
APP_NAME="Mkwazu Hardware"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mkwazu_hardware
DB_USERNAME=root
DB_PASSWORD=your_password

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

### 6. Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE mkwazu_hardware CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 7. Generate Application Key

```bash
php artisan key:generate
```

### 8. Update User Model

Edit `app/Models/User.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];
}
```

### 9. Create Users Migration

Create file `database/migrations/2014_10_12_000000_create_users_table.php`:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['admin', 'super_admin'])->default('admin');
            $table->string('phone', 20)->nullable();
            $table->boolean('is_active')->default(true);
            $table->rememberToken();
            $table->timestamps();

            $table->index('email');
            $table->index('role');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

### 10. Configure Sanctum

Edit `config/sanctum.php`:

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,localhost:5173,127.0.0.1,127.0.0.1:8000,::1',
    Sanctum::currentApplicationUrlWithPort()
))),
```

### 11. Update Kernel

Edit `app/Http/Kernel.php` and add to `api` middleware group:

```php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    \Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

### 12. Run Migrations and Seeders

```bash
php artisan migrate:fresh --seed
```

This will:
- Create all database tables
- Create admin user (admin@mkwazuhardware.co.tz / admin123)
- Seed categories and products

### 13. Create Storage Link

```bash
php artisan storage:link
```

### 14. Set Permissions

```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### 15. Start Development Server

```bash
php artisan serve
```

Your API is now running at: `http://localhost:8000`

## Testing the API

### Test Public Endpoints

```bash
# Get categories
curl http://localhost:8000/api/v1/categories

# Get products
curl http://localhost:8000/api/v1/products

# Get featured products
curl http://localhost:8000/api/v1/products/featured
```

### Test Admin Authentication

```bash
# Admin login
curl -X POST http://localhost:8000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mkwazuhardware.co.tz",
    "password": "admin123"
  }'

# Save the token from response
TOKEN="your_token_here"

# Get dashboard stats
curl http://localhost:8000/api/v1/admin/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"
```

### Test Order Creation

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_phone": "+255712345678",
    "delivery_address": "Dar es Salaam, Kinondoni",
    "delivery_region": "Dar es Salaam",
    "payment_method": "cash_on_delivery",
    "items": [
      {
        "product_id": 1,
        "quantity": 2
      }
    ]
  }'
```

## Frontend Integration

Update your React frontend to use the Laravel API:

Edit `src/app/services/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vifaa_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Then replace all mock service calls with real API calls.

## Production Deployment

### 1. Environment Setup

```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.mkwazuhardware.co.tz
```

### 2. Optimize Application

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
composer install --optimize-autoloader --no-dev
```

### 3. Set Up Queue Worker

```bash
php artisan queue:work --daemon
```

### 4. Configure Web Server (Nginx)

```nginx
server {
    listen 80;
    server_name api.mkwazuhardware.co.tz;
    root /var/www/mkwazu-backend/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### 5. Set Up SSL

```bash
sudo certbot --nginx -d api.mkwazuhardware.co.tz
```

## Troubleshooting

### CORS Issues
- Check `config/cors.php` has correct frontend URL
- Ensure Sanctum stateful domains are configured
- Clear config cache: `php artisan config:clear`

### Database Connection Failed
- Verify MySQL is running: `sudo systemctl status mysql`
- Check credentials in `.env`
- Ensure database exists

### 500 Internal Server Error
- Check logs: `tail -f storage/logs/laravel.log`
- Verify permissions: `chmod -R 775 storage bootstrap/cache`
- Clear caches: `php artisan cache:clear`

### Image Upload Issues
- Verify storage link exists: `php artisan storage:link`
- Check upload limits in `php.ini`
- Ensure storage directory is writable

## Default Credentials

**Admin Account:**
- Email: admin@mkwazuhardware.co.tz
- Password: admin123

**Note:** Change this password in production!

## Support

For issues or questions:
1. Check Laravel documentation: https://laravel.com/docs
2. Check API routes: `php artisan route:list`
3. View logs: `storage/logs/laravel.log`
