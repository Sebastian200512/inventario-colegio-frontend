import axios from 'axios';

// Usamos la URL absoluta para evitar desvíos del navegador
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://inventario-colegio-backend.onrender.com/api',
});

// Forzamos que las peticiones siempre lleven el Token si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// --- SERVICIOS ---
export const loginRequest = (credentials) => api.post('/auth/login', credentials);

// Aseguramos que la ruta termine en barra / si es necesario para Express
export const getProducts = () => api.get('/inventory/');
export const createProduct = (data) => api.post('/inventory/', data);
export const updateProduct = (id, data) => api.put(`/inventory/${id}`, data);
export const deleteProduct = (id) => api.delete(`/inventory/${id}`);

export const getUsers = () => api.get('/users/');
export const createUser = (data) => api.post('/users/', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export const getLoans = () => api.get('/loans/');
export const createLoan = (data) => api.post('/loans/', data);
export const updateLoanStatus = (id, data) => api.patch(`/loans/${id}`, data);

export default api;
