# Database Schema - Mkwazu Hardware Platform

## Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│  categories  │────┬────│    products      │         │    users     │
└──────────────┘    │    └──────────────────┘         └──────────────┘
                    │              │                          │
                    │              │                          │
                    │              │                          │
                    │    ┌─────────┴────────────┐            │
                    │    │                      │            │
                    │    ▼                      ▼            ▼
                    │ ┌──────────────────┐  ┌──────────────────┐
                    └─│ product_images   │  │     orders       │
                      └──────────────────┘  └──────────────────┘
                                                     │
                                                     │
                                                     ▼
                                            ┌──────────────────┐
                                            │  order_items     │
                                            └──────────────────┘
```

## Tables

### 1. users
User accounts for admin authentication.

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'super_admin') DEFAULT 'admin',
    phone VARCHAR(20) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Sample Data:**
```sql
INSERT INTO users (name, email, password, role) VALUES
('Admin Mkuu', 'admin@vifaavyaujenzi.co.tz', '$2y$10$...', 'super_admin'),
('Meneja Bidhaa', 'manager@vifaavyaujenzi.co.tz', '$2y$10$...', 'admin');
```

---

### 2. categories
Product categories for construction materials.

```sql
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    image_url VARCHAR(500) NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Sample Data:**
```sql
INSERT INTO categories (name, slug, description, display_order) VALUES
('Saruji', 'saruji', 'Aina mbalimbali za saruji kwa ajili ya ujenzi', 1),
('Mabati', 'mabati', 'Mabati ya aina tofauti kwa paa', 2),
('Matofali', 'matofali', 'Matofali na vigae vya ujenzi', 3),
('Mabomba', 'mabomba', 'Mabomba ya maji na safi', 4),
('Rangi', 'rangi', 'Rangi za kuta na chuma', 5),
('Nondo', 'nondo', 'Nondo, misumari na vifaa vya kufunga', 6),
('Madirisha na Milango', 'madirisha-milango', 'Madirisha na milango ya kisasa', 7),
('Vigae', 'vigae', 'Vigae vya sakafu na ukuta', 8);
```

---

### 3. products
Construction materials for sale.

```sql
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    short_description VARCHAR(500) NULL,
    price DECIMAL(12, 2) NOT NULL,
    compare_price DECIMAL(12, 2) NULL COMMENT 'Original price for discount display',
    unit VARCHAR(50) DEFAULT 'kipande' COMMENT 'e.g., gunia, kipande, lita, kilo',
    stock_quantity INT DEFAULT 0,
    min_order_quantity INT DEFAULT 1,
    sku VARCHAR(100) UNIQUE NULL COMMENT 'Stock Keeping Unit',
    weight DECIMAL(10, 2) NULL COMMENT 'Weight in KG',
    dimensions VARCHAR(100) NULL COMMENT 'e.g., 100x50x20 cm',
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_slug (slug),
    INDEX idx_is_featured (is_featured),
    INDEX idx_is_active (is_active),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Sample Data:**
```sql
INSERT INTO products (category_id, name, slug, description, short_description, price, unit, stock_quantity) VALUES
(1, 'Saruji Mtwara Grade 32.5', 'saruji-mtwara-325', 
 'Saruji bora ya uzalishaji wa Tanzania yenye ubora wa kimataifa. Inafaa kwa ujenzi wa kawaida na matengenezo.', 
 'Saruji bora kwa ujenzi wa nyumba', 18500.00, 'gunia', 500),
 
(2, 'Bati la Aluminium 30 Gauge', 'bati-aluminium-30', 
 'Bati zuri la aluminium lenye uhai wa miaka mingi. Halichafuliwi wala kutu.', 
 'Bati la aluminium lenye ubora', 25000.00, 'kipande', 200),
 
(3, 'Tofali Jekundu la Kawaida', 'tofali-jekundu', 
 'Matofali mekundu ya kawaida yenye nguvu kubwa. Yanafaa kwa ujenzi wa kuta.', 
 'Matofali imara kwa ujenzi', 450.00, 'kipande', 10000);
```

---

### 4. product_images
Multiple images per product.

```sql
CREATE TABLE product_images (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255) NULL,
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 5. orders
Customer orders.

```sql
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255) NULL,
    delivery_address TEXT NOT NULL,
    delivery_region VARCHAR(100) NULL COMMENT 'e.g., Dar es Salaam, Mwanza',
    delivery_district VARCHAR(100) NULL,
    
    subtotal DECIMAL(12, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    tax DECIMAL(10, 2) DEFAULT 0.00,
    total DECIMAL(12, 2) NOT NULL,
    
    payment_method ENUM('cash_on_delivery', 'mobile_money', 'bank_transfer') DEFAULT 'cash_on_delivery',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    
    order_status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    
    notes TEXT NULL COMMENT 'Customer notes',
    admin_notes TEXT NULL COMMENT 'Internal admin notes',
    
    confirmed_at TIMESTAMP NULL,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_order_number (order_number),
    INDEX idx_customer_phone (customer_phone),
    INDEX idx_order_status (order_status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Order Number Format:** `ORD-YYYYMMDD-XXXX` (e.g., ORD-20260504-0001)

---

### 6. order_items
Items within each order.

```sql
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    product_name VARCHAR(255) NOT NULL COMMENT 'Snapshot at time of order',
    product_sku VARCHAR(100) NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL COMMENT 'Price at time of order',
    subtotal DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 7. personal_access_tokens
Laravel Sanctum token storage for admin authentication.

```sql
CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_tokenable (tokenable_type, tokenable_id),
    INDEX idx_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Indexes Summary

### Performance-Critical Indexes
- `products.category_id` - Fast category filtering
- `products.price` - Price range queries
- `products.is_featured` - Homepage featured products
- `orders.order_status` - Admin dashboard filtering
- `orders.created_at` - Date-based reporting

### Unique Constraints
- `users.email` - Prevent duplicate accounts
- `categories.slug` - URL-friendly unique identifiers
- `products.slug` - URL-friendly unique identifiers
- `products.sku` - Inventory management
- `orders.order_number` - Order tracking

---

## Data Integrity Rules

1. **Cascading Deletes:**
   - Delete category → Delete all products in category
   - Delete product → Delete all product images
   - Delete order → Delete all order items

2. **Restrict Deletes:**
   - Cannot delete product if it exists in order_items (maintain historical data)

3. **Required Fields:**
   - Product must have: name, price, category
   - Order must have: customer name, phone, address, total
   - Order item must have: quantity, unit_price

4. **Business Rules:**
   - Product price must be > 0
   - Order quantity must be >= min_order_quantity
   - Stock quantity cannot be negative (handle at application level)

---

## Migration Order

Execute migrations in this sequence:
1. users
2. categories
3. products
4. product_images
5. orders
6. order_items
7. personal_access_tokens

---

## Estimated Storage

For 1,000 products with average 3 images each:
- Products table: ~500 KB
- Product images table: ~150 KB
- Orders (10,000/year): ~5 MB
- Order items: ~10 MB
- Images (stored files): ~3 GB

**Total estimated:** ~3.5 GB for first year operation
