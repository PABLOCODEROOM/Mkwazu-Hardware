# Laravel Backend - Mkwazu Hardware Platform

## Setup Instructions

### Prerequisites
- PHP 8.1 or higher
- Composer
- MySQL 8.0 or higher
- Node.js & npm (for Laravel Mix if needed)

### Installation Steps

1. **Create a new Laravel project:**
```bash
composer create-project laravel/laravel mkwazu-backend
cd mkwazu-backend
```

2. **Copy all files from the `backend/` directory to your Laravel project:**
   - Migrations → `database/migrations/`
   - Models → `app/Models/`
   - Controllers → `app/Http/Controllers/`
   - Requests → `app/Http/Requests/`
   - Routes → `routes/`
   - Seeders → `database/seeders/`

3. **Configure your `.env` file:**
```env
APP_NAME="Mkwazu Hardware"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mkwazu_hardware
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
SESSION_DOMAIN=localhost
```

4. **Install dependencies:**
```bash
composer require laravel/sanctum
composer install
```

5. **Run migrations and seeders:**
```bash
php artisan migrate:fresh --seed
```

6. **Configure CORS (config/cors.php):**
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:5173', 'http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

7. **Start the development server:**
```bash
php artisan serve
```

Your API will be available at: `http://localhost:8000/api`

## Default Admin Account

After running the seeder:
- **Email:** admin@mkwazuhardware.co.tz
- **Password:** admin123

## API Testing

Test the API with:
```bash
# Get all categories
curl http://localhost:8000/api/categories

# Get all products
curl http://localhost:8000/api/products

# Admin login
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mkwazuhardware.co.tz","password":"admin123"}'
```

## File Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/
│   │   │   ├── CategoryController.php
│   │   │   ├── ProductController.php
│   │   │   └── OrderController.php
│   │   └── Admin/
│   │       ├── AuthController.php
│   │       ├── DashboardController.php
│   │       ├── ProductController.php
│   │       ├── CategoryController.php
│   │       └── OrderController.php
│   └── Requests/
│       ├── CreateOrderRequest.php
│       ├── CreateProductRequest.php
│       └── UpdateProductRequest.php
├── Models/
│   ├── Category.php
│   ├── Product.php
│   ├── ProductImage.php
│   ├── Order.php
│   └── OrderItem.php
database/
├── migrations/
│   ├── 2024_01_01_000001_create_categories_table.php
│   ├── 2024_01_01_000002_create_products_table.php
│   ├── 2024_01_01_000003_create_product_images_table.php
│   ├── 2024_01_01_000004_create_orders_table.php
│   └── 2024_01_01_000005_create_order_items_table.php
└── seeders/
    ├── DatabaseSeeder.php
    ├── CategorySeeder.php
    └── ProductSeeder.php
```

## Storage Configuration

For product images:
```bash
php artisan storage:link
```

Images will be stored in: `storage/app/public/products/`
Accessible via: `http://localhost:8000/storage/products/image.jpg`
