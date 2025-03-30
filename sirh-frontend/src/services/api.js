import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

export const leaveAPI = {
  // Get leave types
  getLeaveTypes: () => api.get('/leave-balance/types'),
  
  // Get leave balance for current user
  getLeaveBalance: () => api.get('/leave-balance/employee/me'),
  
  // Create new leave request
  createLeaveRequest: (data) => api.post('/conges', {
    type_conge_id: data.type,
    date_debut: data.startDate,
    date_fin: data.endDate,
    motif: data.reason
  }),
  
  // Get all leave requests for current user
  getMyLeaveRequests: () => api.get('/conges/me'),
  
  // Get all leave requests (for managers/HR)
  getAllLeaveRequests: () => api.get('/conges'),
  
  // Update leave request status
  updateLeaveStatus: (id, status) => api.put(`/conges/${id}`, { statut: status }),
  
  // Cancel leave request
  cancelLeaveRequest: (id) => api.put(`/conges/${id}`, { statut: 'annulé' })
};

export const documentAPI = {
  // Get all documents
  getAll: () => api.get('/documents'),
  
  // Get document by ID
  getById: (id) => api.get(`/documents/${id}`),
  
  // Create new document
  create: (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    return api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Update document
  update: (id, data) => api.put(`/documents/${id}`, data),
  
  // Delete document
  delete: (id) => api.delete(`/documents/${id}`),
  
  // Download document
  download: (id) => api.get(`/documents/${id}/download`, { responseType: 'blob' }),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api; 