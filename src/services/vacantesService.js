import { apiClient } from './apiClient.js';

export const vacantesService = {
  async getAll() {
    return apiClient.get('/vacantes');
  },

  async create(datos) {
    return apiClient.post('/vacantes', datos);
  },

  async update(id, datos) {
    return apiClient.put(`/vacantes/${id}`, datos);
  },

  async delete(id) {
    return apiClient.delete(`/vacantes/${id}`);
  },
};

export default vacantesService;
