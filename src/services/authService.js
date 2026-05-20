import { apiClient } from './apiClient.js';

export const authService = {
  async register(nombre, email, password) {
    const response = await apiClient.post('/auth/register', {
      nombre,
      email,
      password,
    });
    return response;
  },

  async login(email, password) {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    if (response.success && response.data.token) {
      sessionStorage.setItem('authToken', response.data.token);
      sessionStorage.setItem('userName', response.data.user.nombre);
      sessionStorage.setItem('userId', response.data.user.id);
    }

    return response;
  },

  async getProfile() {
    return apiClient.get('/auth/profile');
  },

  logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userId');
  },

  isAuthenticated() {
    return !!sessionStorage.getItem('authToken');
  },

  getToken() {
    return sessionStorage.getItem('authToken');
  },

  getUserName() {
    return sessionStorage.getItem('userName');
  },
};

export default authService;
