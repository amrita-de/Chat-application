import axios from 'axios';
import { getToken } from '../utils/storage';

// For local testing use your PC's local IP (run ipconfig to find it)
// For production replace with your Render.com URL
export const BASE_URL = 'http://192.168.29.83:3000';

const api = axios.create({ baseURL: `${BASE_URL}/api` });

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (username, password) =>
  api.post('/auth/register', { username, password });

export const login = (username, password) =>
  api.post('/auth/login', { username, password });

export const fetchMessages = () => api.get('/messages');
