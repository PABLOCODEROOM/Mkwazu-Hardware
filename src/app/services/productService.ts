import api from './api';
import { Product, ProductFilters } from '../types/product';

export const productService = {
  getAll: async (filters?: ProductFilters): Promise<{ data: Product[]; total: number }> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.min_price) params.append('min_price', filters.min_price.toString());
      if (filters.max_price) params.append('max_price', filters.max_price.toString());
      if (filters.featured) params.append('featured', 'true');
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('per_page', filters.per_page.toString());
    }

    const response = await api.get('/products', { params });
    const data = response.data.data.map((p: any) => ({
      ...p,
      price: Number(p.price),
      compare_price: p.compare_price ? Number(p.compare_price) : undefined,
    }));

    return {
      data,
      total: response.data.meta.total_items,
    };
  },

  getBySlug: async (slug: string): Promise<Product | null> => {
    try {
      const response = await api.get(`/products/${slug}`);
      const p = response.data.data;
      return {
        ...p,
        price: Number(p.price),
        compare_price: p.compare_price ? Number(p.compare_price) : undefined,
        related_products: p.related_products?.map((rp: any) => ({
          ...rp,
          price: Number(rp.price),
          compare_price: rp.compare_price ? Number(rp.compare_price) : undefined,
        })),
      };
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      return null;
    }
  },

  getFeatured: async (): Promise<Product[]> => {
    const response = await api.get('/products/featured');
    return response.data.data.map((p: any) => ({
      ...p,
      price: Number(p.price),
      compare_price: p.compare_price ? Number(p.compare_price) : undefined,
    }));
  },

  // Admin methods
  adminGetAll: async (params?: any): Promise<{ data: Product[]; meta: any }> => {
    const response = await api.get('/admin/products', { params });
    const data = response.data.data.map((p: any) => ({
      ...p,
      price: Number(p.price),
      compare_price: p.compare_price ? Number(p.compare_price) : undefined,
    }));

    return {
      data,
      meta: response.data.meta,
    };
  },

  create: async (data: FormData): Promise<Product> => {
    const response = await api.post('/admin/products', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  update: async (id: number, data: FormData): Promise<Product> => {
    // Laravel sometimes has issues with PUT and multipart/form-data
    // A common workaround is to use POST with _method=PUT
    data.append('_method', 'PUT');
    const response = await api.post(`/admin/products/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },
};
