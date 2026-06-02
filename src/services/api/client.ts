import axios from 'axios';
import { store } from '../../store';
import { setAccessToken, logout } from '../../store/authSlice';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use(config => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config as typeof error.config & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const newToken: string = res.data.access_token;
        store.dispatch(setAccessToken(newToken));
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch {
        store.dispatch(logout());
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  },
);
