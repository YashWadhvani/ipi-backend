// services/authServices.js
import { http, apiBase } from './http';

// -> returns { accessToken, refreshToken, user }
export const login = (email, password) =>
  http.post(`${apiBase()}/auth/login`, { email, password }).then(r => r.data);

// optional: depends on your backend
export const signup = (userData) =>
  http.post(`${apiBase()}/auth/signup`, userData).then(r => r.data);

export const logout = () => {
  if (process.client) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

// IMPORTANT: backend exposes GET /me (not /auth/me)
export const getCurrentUser = () =>
  http.get(`${apiBase()}/me`).then(r => r.data);

// If your refresh endpoint expects the refresh token in the body:
export const refreshToken = async () => {
  const rt = process.client ? localStorage.getItem('refreshToken') : null;
  const { data } = await http.post(`${apiBase()}/auth/refresh`, { refreshToken: rt });
  return data; // { accessToken, refreshToken?, user? }
};