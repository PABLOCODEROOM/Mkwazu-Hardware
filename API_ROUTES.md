# API Routes Documentation - Mkwazu Hardware Platform

## Base URL
```
Development: http://localhost:8000/api
Production: https://api.vifaavyaujenzi.co.tz/api
```

## Authentication
- **Admin routes** require Bearer token in header: `Authorization: Bearer {token}`
- **Public routes** require no authentication

---

## Public API Routes (Client-Facing)

### Categories

#### Get All Categories
```http
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Saruji",
      "slug": "saruji",
      "description": "Aina mbalimbali za saruji kwa ajili ya ujenzi",
      "image_url": "https://example.com/storage/categories/saruji.jpg",
      "product_count": 12
    }
  ]
}
```

---

### Products

#### Get All Products (with filters)
```http
GET /api/products?category={slug}&min_price={amount}&max_price={amount}&search={term}&page={num}
```

**Query Parameters:**
- `category` (optional): Category slug
- `min_price` (optional): Minimum price in TZS
- `max_price` (optional): Maximum price in TZS
- `search` (optional): Search term (name, description)
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 12)
- `featured` (optional): true/false - Filter featured products

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Saruji Mtwara Grade 32.5",
      "slug": "saruji-mtwara-325",
      "short_description": "Saruji bora kwa ujenzi wa nyumba",
      "price": 18500.00,
      "compare_price": 20000.00,
      "unit": "gunia",
      "stock_quantity": 500,
      "is_featured": true,
      "primary_image": "https://example.com/storage/products/saruji-1.jpg",
      "category": {
        "id": 1,
        "name": "Saruji",
        "slug": "saruji"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 58,
    "per_page": 12
  }
}
```

#### Get Featured Products
```http
GET /api/products/featured
```

**Response:** Same structure as Get All Products

#### Get Product Details
```http
GET /api/products/{slug}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Saruji Mtwara Grade 32.5",
    "slug": "saruji-mtwara-325",
    "description": "Saruji bora ya uzalishaji wa Tanzania yenye ubora wa kimataifa. Inafaa kwa ujenzi wa kawaida na matengenezo.",
    "short_description": "Saruji bora kwa ujenzi wa nyumba",
    "price": 18500.00,
    "compare_price": 20000.00,
    "unit": "gunia",
    "stock_quantity": 500,
    "min_order_quantity": 1,
    "sku": "SAR-MTW-325",
    "weight": 50.00,
    "dimensions": "60x40x15 cm",
    "is_featured": true,
    "category": {
      "id": 1,
      "name": "Saruji",
      "slug": "saruji"
    },
    "images": [
      {
        "id": 1,
        "image_url": "https://example.com/storage/products/saruji-1.jpg",
        "alt_text": "Saruji Mtwara",
        "is_primary": true
      },
      {
        "id": 2,
        "image_url": "https://example.com/storage/products/saruji-2.jpg",
        "alt_text": "Saruji Mtwara - Close up",
        "is_primary": false
      }
    ],
    "related_products": []
  }
}
```

---

### Orders

#### Create Order
```http
POST /api/orders
```

**Request Body:**
```json
{
  "customer_name": "John Mwangi",
  "customer_phone": "+255712345678",
  "customer_email": "john@example.com",
  "delivery_address": "Kimara, Plot 123, Dar es Salaam",
  "delivery_region": "Dar es Salaam",
  "delivery_district": "Kinondoni",
  "payment_method": "cash_on_delivery",
  "notes": "Tafadhali piga simu kabla ya kufika",
  "items": [
    {
      "product_id": 1,
      "quantity": 10
    },
    {
      "product_id": 5,
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Oda yako imetumwa kikamilifu",
  "data": {
    "order_number": "ORD-20260504-0001",
    "total": 195000.00,
    "order_status": "pending",
    "payment_status": "pending"
  }
}
```

#### Track Order
```http
GET /api/orders/{order_number}
```

**Query Parameters:**
- `phone`: Customer phone number (required for verification)

**Example:**
```http
GET /api/orders/ORD-20260504-0001?phone=+255712345678
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_number": "ORD-20260504-0001",
    "customer_name": "John Mwangi",
    "total": 195000.00,
    "order_status": "confirmed",
    "payment_status": "pending",
    "created_at": "2026-05-04T10:30:00Z",
    "items": [
      {
        "product_name": "Saruji Mtwara Grade 32.5",
        "quantity": 10,
        "unit_price": 18500.00,
        "subtotal": 185000.00
      }
    ],
    "timeline": [
      {
        "status": "pending",
        "timestamp": "2026-05-04T10:30:00Z"
      },
      {
        "status": "confirmed",
        "timestamp": "2026-05-04T11:15:00Z"
      }
    ]
  }
}
```

---

## Admin API Routes (Protected)

### Authentication

#### Admin Login
```http
POST /api/admin/login
```

**Request Body:**
```json
{
  "email": "admin@vifaavyaujenzi.co.tz",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Umeingia kikamilifu",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin Mkuu",
      "email": "admin@vifaavyaujenzi.co.tz",
      "role": "super_admin"
    },
    "token": "1|abcdef123456789..."
  }
}
```

#### Admin Logout
```http
POST /api/admin/logout
```
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Umetoka kikamilifu"
}
```

#### Get Current Admin User
```http
GET /api/admin/user
```
**Headers:** `Authorization: Bearer {token}`

---

### Dashboard Statistics

#### Get Dashboard Overview
```http
GET /api/admin/dashboard/stats
```
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "total_orders": 1245,
    "pending_orders": 23,
    "total_revenue": 125600000.00,
    "total_products": 156,
    "low_stock_products": 8,
    "recent_orders": [],
    "revenue_chart": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May"],
      "data": [12000000, 15000000, 18000000, 22000000, 25000000]
    }
  }
}
```

---

### Product Management

#### Get All Products (Admin)
```http
GET /api/admin/products?page={num}&search={term}&category={id}
```
**Headers:** `Authorization: Bearer {token}`

#### Create Product
```http
POST /api/admin/products
```
**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Request Body (FormData):**
```
name: Saruji Mtwara Grade 32.5
category_id: 1
description: Saruji bora...
short_description: Saruji bora kwa ujenzi
price: 18500.00
compare_price: 20000.00
unit: gunia
stock_quantity: 500
min_order_quantity: 1
sku: SAR-MTW-325
weight: 50.00
dimensions: 60x40x15 cm
is_featured: true
is_active: true
images[]: [File]
images[]: [File]
```

**Response:**
```json
{
  "success": true,
  "message": "Bidhaa imeongezwa kikamilifu",
  "data": {
    "id": 1,
    "name": "Saruji Mtwara Grade 32.5",
    "slug": "saruji-mtwara-325"
  }
}
```

#### Update Product
```http
PUT /api/admin/products/{id}
POST /api/admin/products/{id} (with _method=PUT for file uploads)
```
**Headers:** `Authorization: Bearer {token}`

**Request Body:** Same as Create Product

#### Delete Product
```http
DELETE /api/admin/products/{id}
```
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Bidhaa imefutwa kikamilifu"
}
```

#### Upload Additional Product Images
```http
POST /api/admin/products/{id}/images
```
**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Request Body:**
```
images[]: [File]
images[]: [File]
```

#### Delete Product Image
```http
DELETE /api/admin/products/images/{image_id}
```
**Headers:** `Authorization: Bearer {token}`

---

### Category Management

#### Get All Categories (Admin)
```http
GET /api/admin/categories
```
**Headers:** `Authorization: Bearer {token}`

#### Create Category
```http
POST /api/admin/categories
```
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Saruji",
  "description": "Aina mbalimbali za saruji kwa ajili ya ujenzi",
  "display_order": 1,
  "is_active": true
}
```

#### Update Category
```http
PUT /api/admin/categories/{id}
```
**Headers:** `Authorization: Bearer {token}`

#### Delete Category
```http
DELETE /api/admin/categories/{id}
```
**Headers:** `Authorization: Bearer {token}`

---

### Order Management

#### Get All Orders
```http
GET /api/admin/orders?page={num}&status={status}&date_from={date}&date_to={date}
```
**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `status`: pending, confirmed, processing, shipped, delivered, cancelled
- `date_from`: YYYY-MM-DD
- `date_to`: YYYY-MM-DD
- `search`: Search by order number, customer name, phone

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_number": "ORD-20260504-0001",
      "customer_name": "John Mwangi",
      "customer_phone": "+255712345678",
      "total": 195000.00,
      "order_status": "pending",
      "payment_status": "pending",
      "created_at": "2026-05-04T10:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total_pages": 10,
    "total_items": 120
  }
}
```

#### Get Order Details
```http
GET /api/admin/orders/{id}
```
**Headers:** `Authorization: Bearer {token}`

#### Update Order Status
```http
PUT /api/admin/orders/{id}/status
```
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "order_status": "confirmed",
  "admin_notes": "Oda imethibitishwa. Bidhaa zitaandaliwa kesho."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Hali ya oda imebadilishwa kikamilifu"
}
```

#### Update Payment Status
```http
PUT /api/admin/orders/{id}/payment
```
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "payment_status": "paid"
}
```

---

## Error Responses

### Validation Error (422)
```json
{
  "success": false,
  "message": "Taarifa hazikutosheleza",
  "errors": {
    "customer_phone": ["Namba ya simu inahitajika"],
    "items": ["Lazima uchague bidhaa angalau moja"]
  }
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Huna ruhusa ya kuingia"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Bidhaa haijpatikana"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Hitilafu imetokea. Tafadhali jaribu tena baadae."
}
```

---

## Rate Limiting

- **Public API**: 60 requests per minute per IP
- **Admin API**: 100 requests per minute per token

**Rate Limit Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1620123456
```

---

## CORS Configuration

Allowed origins (Laravel config/cors.php):
```php
'allowed_origins' => [
    'http://localhost:5173',  // Vite dev server
    'https://vifaavyaujenzi.co.tz',  // Production frontend
],
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With'],
```

---

## Laravel Route File Structure

### routes/api.php
```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminOrderController;

// Public routes
Route::prefix('v1')->group(function () {
    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    
    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);
    
    // Orders
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);
});

// Admin routes
Route::prefix('v1/admin')->group(function () {
    // Auth
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        
        // Dashboard
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
        
        // Products
        Route::apiResource('/products', AdminProductController::class);
        Route::post('/products/{id}/images', [AdminProductController::class, 'uploadImages']);
        Route::delete('/products/images/{imageId}', [AdminProductController::class, 'deleteImage']);
        
        // Categories
        Route::apiResource('/categories', AdminCategoryController::class);
        
        // Orders
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
        Route::put('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
        Route::put('/orders/{id}/payment', [AdminOrderController::class, 'updatePayment']);
    });
});
```
