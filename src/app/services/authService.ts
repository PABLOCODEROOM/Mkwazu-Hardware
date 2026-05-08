import api from './api';
import { AuthResponse, LoginCredentials, User } from '../types/user';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Note: For Sanctum cookie-based auth, we would call /sanctum/csrf-cookie first
    // But here we use token-based auth as configured in the backend fix
    const response = await api.post('/admin/login', credentials);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/admin/logout');
    } finally {
      localStorage.removeItem('vifaa_auth_token');
      localStorage.removeItem('vifaa_user');
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get('/admin/user');
      return response.data.data;
    } catch (error) {
      return null;
    }
  }
};
