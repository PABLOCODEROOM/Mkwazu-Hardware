# React Component Structure - Mkwazu Hardware Platform

## Application Architecture

```
src/
├── app/
│   ├── App.tsx                      # Main application component with routing
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Main navigation header
│   │   │   ├── Footer.tsx           # Site footer
│   │   │   ├── AdminLayout.tsx      # Admin dashboard layout wrapper
│   │   │   └── ClientLayout.tsx     # Client-facing layout wrapper
│   │   │
│   │   ├── client/
│   │   │   ├── Hero.tsx             # Landing page hero section
│   │   │   ├── FeaturedProducts.tsx # Featured products carousel
│   │   │   ├── CategoryGrid.tsx     # Category display grid
│   │   │   ├── ProductCard.tsx      # Individual product card
│   │   │   ├── ProductGrid.tsx      # Product listing grid
│   │   │   ├── ProductFilters.tsx   # Sidebar filters
│   │   │   ├── ProductDetails.tsx   # Product detail view
│   │   │   ├── CartSidebar.tsx      # Shopping cart sidebar
│   │   │   ├── CartItem.tsx         # Individual cart item
│   │   │   ├── CheckoutForm.tsx     # Checkout form
│   │   │   └── OrderTracker.tsx     # Order tracking component
│   │   │
│   │   ├── admin/
│   │   │   ├── Sidebar.tsx          # Admin dashboard sidebar
│   │   │   ├── StatsCard.tsx        # Dashboard statistics card
│   │   │   ├── RecentOrders.tsx     # Recent orders table
│   │   │   ├── ProductTable.tsx     # Product management table
│   │   │   ├── ProductForm.tsx      # Add/Edit product form
│   │   │   ├── OrderTable.tsx       # Order management table
│   │   │   ├── OrderDetails.tsx     # Order detail modal
│   │   │   ├── CategoryForm.tsx     # Add/Edit category form
│   │   │   └── ImageUploader.tsx    # Product image upload component
│   │   │
│   │   ├── common/
│   │   │   ├── Button.tsx           # Reusable button component
│   │   │   ├── Input.tsx            # Form input component
│   │   │   ├── Select.tsx           # Dropdown select component
│   │   │   ├── Modal.tsx            # Modal dialog component
│   │   │   ├── Badge.tsx            # Status badge component
│   │   │   ├── Spinner.tsx          # Loading spinner
│   │   │   ├── Alert.tsx            # Alert/notification component
│   │   │   ├── Pagination.tsx       # Pagination controls
│   │   │   └── SearchBar.tsx        # Search input component
│   │   │
│   │   └── figma/
│   │       └── ImageWithFallback.tsx # Image component with fallback
│   │
│   ├── pages/
│   │   ├── client/
│   │   │   ├── HomePage.tsx         # Landing page
│   │   │   ├── ProductsPage.tsx     # Product listing page
│   │   │   ├── ProductDetailPage.tsx # Single product page
│   │   │   ├── CartPage.tsx         # Shopping cart page
│   │   │   ├── CheckoutPage.tsx     # Checkout page
│   │   │   └── OrderSuccessPage.tsx # Order confirmation page
│   │   │
│   │   └── admin/
│   │       ├── LoginPage.tsx        # Admin login
│   │       ├── DashboardPage.tsx    # Admin dashboard
│   │       ├── ProductsPage.tsx     # Product management
│   │       ├── OrdersPage.tsx       # Order management
│   │       └── CategoriesPage.tsx   # Category management
│   │
│   ├── context/
│   │   ├── CartContext.tsx          # Shopping cart state management
│   │   ├── AuthContext.tsx          # Admin authentication state
│   │   └── AppContext.tsx           # Global app state
│   │
│   ├── hooks/
│   │   ├── useCart.ts               # Cart management hook
│   │   ├── useAuth.ts               # Authentication hook
│   │   ├── useProducts.ts           # Products data fetching hook
│   │   ├── useOrders.ts             # Orders data fetching hook
│   │   └── useCategories.ts         # Categories data fetching hook
│   │
│   ├── services/
│   │   ├── api.ts                   # Axios instance configuration
│   │   ├── productService.ts        # Product API calls
│   │   ├── orderService.ts          # Order API calls
│   │   ├── categoryService.ts       # Category API calls
│   │   └── authService.ts           # Authentication API calls
│   │
│   ├── utils/
│   │   ├── formatCurrency.ts        # TZS currency formatter
│   │   ├── formatDate.ts            # Date formatter
│   │   ├── validators.ts            # Form validation helpers
│   │   └── constants.ts             # App constants
│   │
│   └── types/
│       ├── product.ts               # Product type definitions
│       ├── order.ts                 # Order type definitions
│       ├── category.ts              # Category type definitions
│       └── user.ts                  # User type definitions
│
├── styles/
│   ├── fonts.css                    # Font imports
│   └── theme.css                    # Tailwind theme customization
│
└── imports/                         # Figma imported assets (if any)
```

---

## Component Hierarchy

### Client-Facing Application

```
App
└── ClientLayout
    ├── Header
    │   ├── SearchBar
    │   └── CartIcon (badge with item count)
    ├── MainContent (Route-based)
    │   ├── HomePage
    │   │   ├── Hero
    │   │   ├── CategoryGrid
    │   │   └── FeaturedProducts
    │   ├── ProductsPage
    │   │   ├── ProductFilters (sidebar)
    │   │   └── ProductGrid
    │   │       └── ProductCard []
    │   ├── ProductDetailPage
    │   │   └── ProductDetails
    │   ├── CartPage
    │   │   └── CartItem []
    │   └── CheckoutPage
    │       └── CheckoutForm
    ├── CartSidebar (global)
    └── Footer
```

### Admin Dashboard

```
App
└── AdminLayout
    ├── Sidebar
    └── MainContent (Route-based)
        ├── DashboardPage
        │   ├── StatsCard []
        │   └── RecentOrders
        ├── ProductsPage
        │   ├── ProductTable
        │   └── ProductForm (modal)
        │       └── ImageUploader
        ├── OrdersPage
        │   ├── OrderTable
        │   └── OrderDetails (modal)
        └── CategoriesPage
            └── CategoryForm
```

---

## State Management Strategy

### 1. Cart State (CartContext)
```typescript
interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}
```

**Storage**: localStorage (persists across sessions)

### 2. Auth State (AuthContext)
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

**Storage**: localStorage for token, memory for user data

### 3. App State (AppContext)
```typescript
interface AppState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}
```

---

## Data Fetching Pattern

### Using Custom Hooks

```typescript
// Example: useProducts hook
const useProducts = (filters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll(filters);
        setProducts(data);
      } catch (err) {
        setError('Imeshindwa kupakua bidhaa');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters]);
  
  return { products, loading, error };
};
```

---

## Routing Structure

```typescript
// React Router v6 configuration
<Routes>
  {/* Client Routes */}
  <Route path="/" element={<ClientLayout />}>
    <Route index element={<HomePage />} />
    <Route path="bidhaa" element={<ProductsPage />} />
    <Route path="bidhaa/:slug" element={<ProductDetailPage />} />
    <Route path="kikapu" element={<CartPage />} />
    <Route path="malipo" element={<CheckoutPage />} />
    <Route path="oda/:orderNumber" element={<OrderSuccessPage />} />
  </Route>
  
  {/* Admin Routes */}
  <Route path="/admin/login" element={<LoginPage />} />
  <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
    <Route index element={<DashboardPage />} />
    <Route path="bidhaa" element={<ProductsPage />} />
    <Route path="oda" element={<OrdersPage />} />
    <Route path="aina" element={<CategoriesPage />} />
  </Route>
</Routes>
```

---

## Responsive Design Strategy

### Breakpoints (Tailwind)
- `sm`: 640px - Mobile landscape
- `md`: 768px - Tablet
- `lg`: 1024px - Desktop
- `xl`: 1280px - Large desktop

### Component Responsiveness

**ProductGrid:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

**Header:**
- Mobile: Hamburger menu
- Desktop: Full navigation bar

**AdminSidebar:**
- Mobile: Collapsible drawer
- Desktop: Fixed sidebar

---

## Performance Optimizations

1. **Code Splitting**
   - Lazy load admin routes
   - Lazy load product detail page

2. **Image Optimization**
   - Use ImageWithFallback component
   - Implement lazy loading (loading="lazy")
   - Use appropriate image sizes

3. **Memoization**
   - useMemo for expensive calculations (cart total)
   - React.memo for pure components (ProductCard)

4. **Debouncing**
   - Search input (300ms delay)
   - Filter changes (500ms delay)

---

## Accessibility Features

1. **Semantic HTML**
   - Proper heading hierarchy (h1 → h6)
   - ARIA labels for interactive elements

2. **Keyboard Navigation**
   - Tab order management
   - Enter/Space for button activation

3. **Screen Reader Support**
   - Alt text for images
   - ARIA labels for icons

4. **Color Contrast**
   - WCAG AA compliance
   - High contrast for text

---

## Testing Strategy

### Unit Tests
- Utility functions (formatCurrency, validators)
- Custom hooks (useCart, useAuth)

### Component Tests
- ProductCard rendering
- CartItem quantity updates
- CheckoutForm validation

### Integration Tests
- Add to cart flow
- Checkout process
- Admin product creation

---

## Build Configuration

### Vite Configuration (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'admin': ['./src/app/pages/admin']
        }
      }
    }
  }
})
```

---

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Mkwazu Hardware
VITE_CURRENCY=TZS
```

---

## UX Improvement Suggestions

1. **Progressive Loading**
   - Show skeleton screens while loading
   - Implement infinite scroll for product listings

2. **Interactive Feedback**
   - Toast notifications for actions (add to cart, order placed)
   - Loading states for all async operations
   - Optimistic UI updates

3. **Error Handling**
   - Friendly error messages in Kiswahili
   - Retry mechanisms for failed requests
   - Offline detection with appropriate messaging

4. **Search Enhancement**
   - Auto-suggestions while typing
   - Recent searches history
   - Highlight matching terms in results

5. **Mobile Optimization**
   - Bottom navigation for key actions
   - Swipe gestures for cart sidebar
   - One-handed friendly button placement

6. **Personalization**
   - Recently viewed products
   - Related product recommendations
   - Save favorite items (future feature)
