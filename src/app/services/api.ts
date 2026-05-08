import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/v1' : 'http://localhost:8000/api/v1');

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.warn('VITE_API_URL is not set in production. Falling back to relative path /api/v1');
}

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
  (response) => {
    // Detect if the response is actually HTML (happens if VITE_API_URL is wrong)
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('text/html')) {
      return Promise.reject({
        message: 'API returned HTML instead of JSON. Please check VITE_API_URL configuration.',
        response
      });
    }
    return response;
  },
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
