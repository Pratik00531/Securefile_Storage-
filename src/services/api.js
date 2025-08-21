import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors with enhanced JWT error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errorCode = error.response.data?.code;
      
      // Handle different types of auth errors
      switch (errorCode) {
        case 'TOKEN_EXPIRED':
          console.log('Token expired, redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login?message=session_expired';
          break;
        case 'INVALID_TOKEN':
        case 'TOKEN_VERIFICATION_FAILED':
          console.log('Invalid token, redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login?message=invalid_session';
          break;
        case 'USER_NOT_FOUND':
          console.log('User not found, redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login?message=account_not_found';
          break;
        case 'NO_TOKEN':
        default:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  validateToken: () => api.get('/files/my-files', { params: { limit: 1 } }), // Lightweight token validation
};

export const fileAPI = {
  upload: (formData) => api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyFiles: (params = {}) => api.get('/files/my-files', { params }),
  download: (fileId) => api.get(`/files/download/${fileId}`, {
    responseType: 'blob'
  }),
  delete: (fileId) => api.delete(`/files/${fileId}`),
};

// Token validation utility
export const validateStoredToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }

  try {
    // Try to make an authenticated request to validate token
    await authAPI.validateToken();
    return true;
  } catch (error) {
    // Token is invalid, clean up
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
};

export default api;