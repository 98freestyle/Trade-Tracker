import axios from 'axios';

const API_URL = '/api';

const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (email, password) => 
  api.post('/auth/register', { email, password });

export const login = (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  return api.post('/auth/login', formData);
};

export const getCurrentUser = () => api.get('/auth/me');

// Trades
export const getTrades = () => api.get('/trades/');

export const createTrade = (tradeData) => api.post('/trades/', tradeData);

export const updateTrade = (id, tradeData) => api.put(`/trades/${id}`, tradeData);

export const deleteTrade = (id) => api.delete(`/trades/${id}`);

// Deposits
export const getDeposits = () => api.get('/deposits/');

export const createDeposit = (depositData) => api.post('/deposits/', depositData);

export const deleteDeposit = (id) => api.delete(`/deposits/${id}`);

export default api;