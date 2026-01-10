import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.status, error.response?.data || error.message);

        // Handle auth errors (token expired or invalid)
        const status = error.response?.status;
        const errorCode = error.response?.data?.code;

        if (status === 401 || (status === 403 && errorCode === 'INVALID_TOKEN')) {
            console.warn('Session expired or invalid, redirecting to login...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Use replace to prevent back button issues
            window.location.replace('/login');
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (userData) => api.post('/auth/register', userData),
};

export const clientAPI = {
    getAll: () => api.get('/clients'),
    getById: (id) => api.get(`/clients/${id}`),
    create: (clientData) => api.post('/clients', clientData),
    update: (id, clientData) => api.put(`/clients/${id}`, clientData),
    delete: (id) => api.delete(`/clients/${id}`),
    getUnverifiedCount: () => api.get('/clients/unverified-count'),
    verify: (id) => api.put(`/clients/${id}/verify`),
    getStats: (id) => api.get(`/clients/${id}/stats`),
};

// Alias for backward compatibility if needed, though Dashboard uses clientAPI
export const clientsAPI = clientAPI;

export const quotesAPI = {
    getAll: () => api.get('/quotes'),
    getById: (id) => api.get(`/quotes/${id}`),
    create: (quoteData) => api.post('/quotes', quoteData),
    update: (id, quoteData) => api.put(`/quotes/${id}`, quoteData),
    delete: (id) => api.delete(`/quotes/${id}`),
    generatePDF: (id, type) => api.get(`/quotes/${id}/pdf?type=${type}`, { responseType: 'blob' }),
    getMetalPrices: () => api.get('/admin/metal-prices'),
};

export const adminAPI = {
    updateMetalPrices: (prices) => api.put('/admin/metal-prices', { prices }),
    getStonePrices: () => api.get('/admin/stone-prices'),
    updateStonePrices: (prices) => api.put('/admin/stone-prices', { prices }),
    getUsers: () => api.get('/admin/users'),
    createUser: (userData) => api.post('/admin/users', userData),
};

export const searchAPI = {
    search: (query) => api.get(`/search?q=${encodeURIComponent(query)}`),
};

// 🛡️ Super Admin API (Whitelisted users only)
export const sysadminAPI = {
    getStats: () => api.get('/sysadmin/stats'),
    getAuditLogs: (params = {}) => api.get('/sysadmin/audit-logs', { params }),
    getOrganizations: () => api.get('/sysadmin/organizations'),
    updateOrgStatus: (id, status) => api.patch(`/sysadmin/organizations/${id}/status`, { status }),
    getUsers: () => api.get('/sysadmin/users'),
    getHealth: () => api.get('/sysadmin/health'),
};

export default api;
