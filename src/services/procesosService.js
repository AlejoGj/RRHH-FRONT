import { apiClient } from './apiClient.js';
import { normalizeProcesosList, normalizeProceso } from './adapters/procesosAdapter.js';

export const procesosService = {
  async getAll() {
    const resp = await apiClient.get('/procesos');
    let items = [];
    if (Array.isArray(resp)) items = resp;
    else if (resp && resp.data && Array.isArray(resp.data)) items = resp.data;
    return { success: true, data: normalizeProcesosList(items) };
  },

  async create(datos) {
    const resp = await apiClient.post('/procesos', datos);
    if (resp && resp.data) return { ...resp, data: normalizeProceso(resp.data) };
    return resp;
  },

  async update(id, datos) {
    const resp = await apiClient.put(`/procesos/${id}`, datos);
    if (resp && resp.data) return { ...resp, data: normalizeProceso(resp.data) };
    return resp;
  },

  async delete(id) {
    return apiClient.delete(`/procesos/${id}`);
  },
};

export default procesosService;
