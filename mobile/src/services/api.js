import axios from 'axios';
import { getToken } from '../utils/storage';

// Replace the URL below with your actual Render.com URL after deploying
export const BASE_URL = 'https://chat-application-t0rk.onrender.com';

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
