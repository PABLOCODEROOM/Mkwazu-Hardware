import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Required for Sanctum if using cookies, though we use tokens here
});

// Request interceptor for API tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vifaa_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vifaa_auth_token');
      localStorage.removeItem('vifaa_user');
      // window.location.href = '/admin'; // Optional: redirect on auth failure
    }
    return Promise.reject(error);
  }
);

export default api;
