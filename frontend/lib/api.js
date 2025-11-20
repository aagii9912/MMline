import axios from 'axios';

// Axios instance for backend API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Inject token if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (payload) => api.post('/auth/register', payload);
export const loginUser = (payload) => api.post('/auth/login', payload);
export const getShipments = (params) => api.get('/shipments', { params });
export const getShipment = (id) => api.get(`/shipments/${id}`);
export const createShipment = (payload) => api.post('/shipments', payload);
export const updateShipment = (id, payload) => api.put(`/shipments/${id}`, payload);
export const deleteShipment = (id) => api.delete(`/shipments/${id}`);
export const makeOffer = (shipmentId, payload) => api.post(`/shipments/${shipmentId}/offers`, payload);
export const getOffers = (shipmentId) => api.get(`/shipments/${shipmentId}/offers`);
export const acceptOffer = (offerId, status) => api.put(`/offers/${offerId}`, { status });

export default api;
