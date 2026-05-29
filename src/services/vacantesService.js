import { apiClient } from './apiClient.js';
import { normalizeVacantesList, normalizeVacante } from './adapters/vacantesAdapter.js';

export const vacantesService = {
  async getAll() {
    const resp = await apiClient.get('/vacantes');
    let items = [];
    if (Array.isArray(resp)) items = resp;
    else if (resp && resp.data && Array.isArray(resp.data)) items = resp.data;
    return { success: true, data: normalizeVacantesList(items) };
  },

  async create(datos) {
    const resp = await apiClient.post('/vacantes', datos);
    if (resp && resp.data) return { ...resp, data: normalizeVacante(resp.data) };
    return resp;
  },

  async update(id, datos) {
    const resp = await apiClient.put(`/vacantes/${id}`, datos);
    if (resp && resp.data) return { ...resp, data: normalizeVacante(resp.data) };
    return resp;
  },

  async delete(id) {
    return apiClient.delete(`/vacantes/${id}`);
  },
};

export default vacantesService;
