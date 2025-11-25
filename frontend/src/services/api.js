import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateLimit: (dailyLimit) => api.put('/auth/update-limit', { dailyLimit }),
};

// Activities API
export const activitiesAPI = {
  create: (formData) => {
    return api.post('/activities', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getAll: (params) => api.get('/activities', { params }),
  getStats: (period = 'week') => api.get(`/activities/stats?period=${period}`),
  getById: (id) => api.get(`/activities/${id}`),
  update: (id, formData) => {
    return api.put(`/activities/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id) => api.delete(`/activities/${id}`),
};

export default api;