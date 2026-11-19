import axios from 'axios';

// Support VITE_API_URL env variable or relative /api in production or localhost:5000 in dev
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
  }
  return import.meta.env.PROD ? '' : 'http://localhost:5000';
};

export const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('blob:') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const base = getBaseUrl();
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
};

const api = axios.create({
  baseURL: API_URL,
});

// Always read from THIS tab's sessionStorage — tab-isolated, no cross-user pollution
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

