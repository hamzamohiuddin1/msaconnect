import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  confirmEmail: (token) => api.get(`/auth/confirm-email/${token}`),
  getMe: () => api.get('/auth/me'),
};

// Classes API calls
export const classesAPI = {
  getClasses: () => api.get('/classes'),
  updateClasses: (classes) => api.put('/classes', { classes }),
  findClassmates: (courseId, sectionCode) => 
    api.get(`/classes/classmates/${courseId}/${sectionCode}`),
};

export default api;
