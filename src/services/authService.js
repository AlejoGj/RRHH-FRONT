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

    // La API nueva no usa JWT; almacenar sólo información de usuario para sesión local
    if (response && response.success && response.data && response.data.user) {
      sessionStorage.setItem('userName', response.data.user.nombre);
      sessionStorage.setItem('userId', response.data.user.id);
    }

    return response;
  },

  async getProfile() {
    try {
      // Intentar obtener perfil desde API; si falla, devolver datos locales si existen
      const resp = await apiClient.get('/auth/profile');
      return resp;
    } catch (e) {
      const userId = sessionStorage.getItem('userId');
      const userName = sessionStorage.getItem('userName');
      if (userId) {
        return { success: true, data: { id: userId, nombre: userName, email: null } };
      }
      throw e;
    }
  },

  logout() {
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userId');
  },

  isAuthenticated() {
    return !!sessionStorage.getItem('userId');
  },

  getToken() {
    // Deprecated: JWT no usado por defecto
    return null;
  },

  getUserName() {
    return sessionStorage.getItem('userName');
  },
};

export default authService;
