import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

export const getAnalyticsReports = (startDate, endDate) =>
  api.get(`/analytics?start=${startDate}&end=${endDate}`);

export const fetchReports = () => api.get('/analytics/history');
export const fetchReportById = (id) => api.get(`/analytics/${id}`);
export const fetchProducts = () => api.get('/products');
export const fetchCustomers = () => api.get('/customers');
export const generateReport = (startDate, endDate) =>
  api.post('/reports/generate', { startDate, endDate });
