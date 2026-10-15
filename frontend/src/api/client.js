import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rental_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error handling and 401 redirection
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on failed login attempt
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('rental_token');
        localStorage.removeItem('rental_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/users/me', data),
  changePassword: (data) => api.post('/users/me/change-password', data),
};

export const propertyApi = {
  search: (params) => api.get('/properties', { params }),
  getById: (id) => api.get(`/properties/${id}`),
  getFeatured: () => api.get('/properties/featured'),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  uploadImages: (formData) => api.post('/properties/upload-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
};

export const facilityApi = {
  getAll: () => api.get('/facilities'),
};

export const requestApi = {
  create: (data) => api.post('/rental-requests', data),
  getMyRequests: () => api.get('/rental-requests/me'),
  updateStatus: (id, data) => api.patch(`/rental-requests/${id}/status`, data),
  cancel: (id) => api.patch(`/rental-requests/${id}/cancel`),
};

export const wishlistApi = {
  getAll: () => api.get('/wishlist'),
  add: (propertyId) => api.post(`/wishlist/${propertyId}`),
  remove: (propertyId) => api.delete(`/wishlist/${propertyId}`),
};

export const reviewApi = {
  submit: (data) => api.post('/reviews', data),
  getByProperty: (propertyId) => api.get(`/reviews/property/${propertyId}`),
  getMyReviews: () => api.get('/reviews/me'),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

export const reportApi = {
  submit: (data) => api.post('/reports', data),
};

export const ownerApi = {
  getMyProperties: (params) => api.get('/owners/me/properties', { params }),
  getMyRequests: () => api.get('/owners/me/rental-requests'),
  getDashboard: () => api.get('/owners/me/dashboard'),
  getReviews: () => api.get('/owners/me/reviews'),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, data) => api.patch(`/admin/users/${id}/status`, data),
  getProperties: (params) => api.get('/admin/properties', { params }),
  updateModeration: (id, data) => api.patch(`/admin/properties/${id}/moderation`, data),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  createFacility: (data) => api.post('/admin/facilities', data),
  getReports: (params) => api.get('/admin/reports', { params }),
  updateReportStatus: (id, data) => api.patch(`/admin/reports/${id}/status`, data),
  getAllRequests: () => api.get('/admin/rental-requests'),
  getAllReviews: () => api.get('/admin/reviews'),
};

export default api;
