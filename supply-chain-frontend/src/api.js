import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

export const fetchDashboardData = () => axios.get(`${API_BASE_URL}/api/dashboard`);
export const addProduct = (data) => axios.post(`${API_BASE_URL}/api/add_product`, data);
export const transferOwnership = (data) => axios.post(`${API_BASE_URL}/api/transfer_ownership`, data);
export const fetchProductDetails = (productId) => axios.get(`${API_BASE_URL}/api/product_details/${productId}`);
export const fetchProductHistory = (productId) => axios.get(`${API_BASE_URL}/api/product_history/${productId}`);
export const fetchAnomalies = () => axios.get(`${API_BASE_URL}/api/anomalies`);
export const fetchPredictions = () => axios.get(`${API_BASE_URL}/api/predict`);
