import api from './api';
import { Category } from '../types/category';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data.data;
  },

  create: async (data: Partial<Category>): Promise<Category> => {
    const response = await api.post('/admin/categories', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<Category>): Promise<Category> => {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/categories/${id}`);
  }
};
