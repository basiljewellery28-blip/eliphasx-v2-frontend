import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const billingAPI = {
    // Get current billing status
    getStatus: async () => {
        const response = await axios.get(`${API_URL}/billing/status`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Initialize payment with Paystack
    initializePayment: async (plan, billingCycle) => {
        const response = await axios.post(`${API_URL}/billing/initialize`,
            { plan, billingCycle },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    // Cancel subscription
    cancelSubscription: async () => {
        const response = await axios.post(`${API_URL}/billing/cancel`, {}, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export const organizationAPI = {
    // Get current organization
    getCurrent: async () => {
        const response = await axios.get(`${API_URL}/organizations/current`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Update organization
    update: async (data) => {
        const response = await axios.put(`${API_URL}/organizations/current`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Get organization users
    getUsers: async () => {
        const response = await axios.get(`${API_URL}/organizations/users`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Invite user
    inviteUser: async (email, role) => {
        const response = await axios.post(`${API_URL}/organizations/invite`,
            { email, role },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    // Get branding settings
    getBranding: async () => {
        const response = await axios.get(`${API_URL}/organizations/branding`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Update branding settings
    updateBranding: async (data) => {
        const response = await axios.put(`${API_URL}/organizations/branding`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Upload logo
    uploadLogo: async (file) => {
        const formData = new FormData();
        formData.append('logo', file);

        const response = await axios.post(`${API_URL}/organizations/branding/logo`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Delete logo
    deleteLogo: async () => {
        const response = await axios.delete(`${API_URL}/organizations/branding/logo`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export default { billingAPI, organizationAPI };
