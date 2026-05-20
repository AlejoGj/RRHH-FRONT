import { apiClient } from './apiClient.js';

export const aspirantesService = {
  async getAll() {
    return apiClient.get('/aspirantes');
  },

  async create(datos) {
    return apiClient.post('/aspirantes', datos);
  },

  async update(id, datos) {
    return apiClient.put(`/aspirantes/${id}`, datos);
  },

  async delete(id) {
    return apiClient.delete(`/aspirantes/${id}`);
  },
};

export default aspirantesService;
