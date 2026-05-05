# System Architecture - Mkwazu Hardware Platform

## Overview
Full-stack e-commerce platform for construction materials targeting Tanzanian market.

## Technology Stack

### Backend
- **Framework**: Laravel 10.x
- **Database**: MySQL 8.0
- **Authentication**: Laravel Sanctum
- **Storage**: Laravel Storage (local/S3)
- **API**: RESTful API architecture

### Frontend
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API / Redux Toolkit
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Infrastructure
```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────┐         ┌─────────────────────┐       │
│  │  Client Website  │         │  Admin Dashboard    │       │
│  │  (React + Vite)  │         │  (React + Vite)     │       │
│  └────────┬─────────┘         └──────────┬──────────┘       │
└───────────┼────────────────────────────────┼─────────────────┘
            │                                │
            │         HTTPS/REST API         │
            ▼                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
│                    Laravel API Routes                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Authentication Middleware (Sanctum)                 │   │
│  │  CORS Configuration                                  │   │
│  │  Rate Limiting                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────┬─────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Controllers  │  │  Services    │  │  Validators  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Models     │  │ Repositories │  │   Events     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────┬─────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              MySQL Database                          │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │   │
│  │  │ Users  │ │Products│ │ Orders │ │Categories│      │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              File Storage                            │   │
│  │  - Product Images                                    │   │
│  │  - Category Icons                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Customer Order Flow
1. Customer browses products → React fetches from `/api/products`
2. Adds to cart → Managed in React state/localStorage
3. Proceeds to checkout → POST `/api/orders`
4. Order created → Email notification sent
5. Admin updates status → PUT `/api/admin/orders/{id}`
6. Customer receives updates → GET `/api/orders/{id}`

### Product Management Flow
1. Admin logs in → POST `/api/admin/login`
2. Receives auth token → Stored in localStorage
3. Uploads product → POST `/api/admin/products` (multipart/form-data)
4. Images stored → Laravel Storage processes upload
5. Product visible → GET `/api/products` includes new product

## Security Features

### Authentication
- **Client**: Session-based browsing (no auth required for browsing)
- **Admin**: Token-based authentication (Laravel Sanctum)
- **Password**: Hashed using bcrypt
- **CSRF**: Protection enabled for state-changing operations

### Authorization
- Role-based access control (RBAC)
- Admin middleware for protected routes
- API rate limiting (60 requests/minute)

### Data Validation
- Server-side validation (Laravel Request classes)
- Client-side validation (React forms)
- Sanitized inputs to prevent XSS/SQL injection

## Performance Optimization

### Backend
- Database indexing on frequently queried fields
- Eager loading relationships to prevent N+1 queries
- Response caching for product listings
- Image optimization (compress on upload)

### Frontend
- Code splitting by route
- Lazy loading images
- Debounced search inputs
- Pagination for large datasets

## Scalability Considerations

### Horizontal Scaling
- Stateless API design (tokens, not sessions)
- Load balancer ready
- Database connection pooling

### Caching Strategy
- Redis for session storage
- Query result caching
- CDN for static assets (images)

## Deployment Architecture

```
Production Environment:
- Web Server: Nginx
- Application: PHP 8.1+ (PHP-FPM)
- Database: MySQL 8.0 (with replication)
- Queue Worker: Laravel Queue (Redis)
- Storage: AWS S3 / Local Storage
- SSL: Let's Encrypt
```

## Monitoring & Logging
- Laravel Log (daily rotation)
- Error tracking (Sentry/Bugsnag)
- Performance monitoring
- Database query logging

## Backup Strategy
- Daily database backups
- Weekly full system backups
- Image storage replication
- 30-day retention policy
