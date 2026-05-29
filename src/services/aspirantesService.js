import { apiClient } from './apiClient.js';
import { normalizeAspirantesList, normalizeAspirante } from './adapters/aspirantesAdapter.js';

export const aspirantesService = {
  async getAll() {
    const resp = await apiClient.get('/aspirantes');
    let items = [];
    if (Array.isArray(resp)) items = resp;
    else if (resp && resp.data && Array.isArray(resp.data)) items = resp.data;
    return { success: true, data: normalizeAspirantesList(items) };
  },

  async create(datos) {
    const resp = await apiClient.post('/aspirantes', datos);
    if (resp && resp.data) return { ...resp, data: normalizeAspirante(resp.data) };
    return resp;
  },

  async update(id, datos) {
    const resp = await apiClient.put(`/aspirantes/${id}`, datos);
    if (resp && resp.data) return { ...resp, data: normalizeAspirante(resp.data) };
    return resp;
  },

  async delete(id) {
    return apiClient.delete(`/aspirantes/${id}`);
  },
};

export default aspirantesService;
