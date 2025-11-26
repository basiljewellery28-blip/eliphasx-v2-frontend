import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
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
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
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

export default api;
