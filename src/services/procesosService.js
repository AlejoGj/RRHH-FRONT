import { apiClient } from './apiClient.js';

export const procesosService = {
  async getAll() {
    return apiClient.get('/procesos');
  },

  async create(datos) {
    return apiClient.post('/procesos', datos);
  },

  async update(id, datos) {
    return apiClient.put(`/procesos/${id}`, datos);
  },

  async delete(id) {
    return apiClient.delete(`/procesos/${id}`);
  },
};

export default procesosService;
