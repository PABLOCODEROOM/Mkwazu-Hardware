import { mockCategories, mockProducts, mockOrders } from '../data/mockData';
import { Product, ProductFilters } from '../types/product';
import { CreateOrderData, Order } from '../types/order';
import { Category } from '../types/category';
import { AuthResponse, LoginCredentials } from '../types/user';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication
export const mockAuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(800);

    // Simple mock authentication
    if (credentials.email === 'admin@vifaa.co.tz' && credentials.password === 'admin123') {
      return {
        user: {
          id: 1,
          name: 'Admin Mkuu',
          email: credentials.email,
          role: 'super_admin',
          is_active: true,
        },
        token: 'mock-token-' + Date.now(),
      };
    }

    throw new Error('Barua pepe au nywila si sahihi');
  },

  logout: async (): Promise<void> => {
    await delay(300);
  },
};

// Mock category service
export const mockCategoryService = {
  getAll: async (): Promise<Category[]> => {
    await delay(500);
    return mockCategories;
  },

  create: async (data: Partial<Category>): Promise<Category> => {
    await delay(600);
    const newCategory: Category = {
      id: mockCategories.length + 1,
      name: data.name!,
      slug: data.name!.toLowerCase().replace(/\s+/g, '-'),
      description: data.description || '',
      is_active: true,
    };
    mockCategories.push(newCategory);
    return newCategory;
  },
};

// Mock product service
export const mockProductService = {
  getAll: async (filters?: ProductFilters): Promise<{ data: Product[]; total: number }> => {
    await delay(600);

    let filtered = [...mockProducts];

    // Apply filters
    if (filters?.category) {
      filtered = filtered.filter(p => p.category.slug === filters.category);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      );
    }

    if (filters?.min_price) {
      filtered = filtered.filter(p => p.price >= filters.min_price!);
    }

    if (filters?.max_price) {
      filtered = filtered.filter(p => p.price <= filters.max_price!);
    }

    if (filters?.featured) {
      filtered = filtered.filter(p => p.is_featured);
    }

    // Pagination
    const page = filters?.page || 1;
    const per_page = filters?.per_page || 12;
    const start = (page - 1) * per_page;
    const end = start + per_page;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
    };
  },

  getBySlug: async (slug: string): Promise<Product | null> => {
    await delay(400);
    return mockProducts.find(p => p.slug === slug) || null;
  },

  getFeatured: async (): Promise<Product[]> => {
    await delay(500);
    return mockProducts.filter(p => p.is_featured).slice(0, 8);
  },

  create: async (data: FormData): Promise<Product> => {
    await delay(800);
    const newProduct: Product = {
      id: mockProducts.length + 1,
      category_id: Number(data.get('category_id')),
      name: data.get('name') as string,
      slug: (data.get('name') as string).toLowerCase().replace(/\s+/g, '-'),
      description: data.get('description') as string,
      short_description: data.get('short_description') as string,
      price: Number(data.get('price')),
      unit: data.get('unit') as string,
      stock_quantity: Number(data.get('stock_quantity')),
      min_order_quantity: 1,
      is_featured: data.get('is_featured') === 'true',
      is_active: true,
      primary_image: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=800',
      category: mockCategories[0],
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  delete: async (id: number): Promise<void> => {
    await delay(500);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index > -1) {
      mockProducts.splice(index, 1);
    }
  },
};

// Mock order service
export const mockOrderService = {
  create: async (data: CreateOrderData): Promise<{ order_number: string; total: number }> => {
    await delay(1000);

    // Calculate total
    let subtotal = 0;
    for (const item of data.items) {
      const product = mockProducts.find(p => p.id === item.product_id);
      if (product) {
        subtotal += product.price * item.quantity;
      }
    }

    const total = subtotal + 5000; // Add delivery fee

    return {
      order_number: `ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(
        Math.floor(Math.random() * 9999)
      ).padStart(4, '0')}`,
      total,
    };
  },

  getByOrderNumber: async (orderNumber: string, phone: string): Promise<Order | null> => {
    await delay(600);
    return mockOrders.find(o => o.order_number === orderNumber && o.customer_phone === phone) || null;
  },

  getAll: async (): Promise<Order[]> => {
    await delay(700);
    return mockOrders;
  },

  updateStatus: async (id: number, status: string): Promise<void> => {
    await delay(500);
    const order = mockOrders.find(o => o.id === id);
    if (order) {
      order.order_status = status as any;
    }
  },
};
