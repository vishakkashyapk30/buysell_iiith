import axios from 'axios';
import { API_BASE_URL } from './config';

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Request interceptor for adding auth token
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add token refresh interceptor
instance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        // Try to refresh token
        const response = await instance.post('/api/user/refresh-token');
        const { token } = response.data;
        localStorage.setItem('token', token);
        error.config.headers['Authorization'] = `Bearer ${token}`;
        return instance(error.config);
      } catch (refreshError) {
        localStorage.removeItem('token');
        delete instance.defaults.headers.common['Authorization'];
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;