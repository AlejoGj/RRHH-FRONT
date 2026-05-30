// Configurable base URL: prefer Vite env `VITE_API_BASE_URL`, fallback local
const DEFAULT_API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'http://localhost:8080/api';
let API_BASE_URL = DEFAULT_API_BASE;
let USE_AUTH = false; // por defecto no enviar Authorization (la nueva API no usa JWT)

// Función para obtener el token (mantener compatibilidad)
const getToken = () => sessionStorage.getItem('authToken');

export const configureApi = ({ baseUrl, useAuth } = {}) => {
  if (baseUrl) API_BASE_URL = baseUrl;
  if (typeof useAuth === 'boolean') USE_AUTH = useAuth;
};

// Parseo tolerante de respuestas
const parseResponse = async (response) => {
  if (!response) throw new Error('No response');
  if (response.status === 204) return null; // No Content

  // Leer el body una sola vez para evitar "body stream already read"
  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    if (!response.ok) throw new Error(text || response.statusText || 'Error en la solicitud');
    return text;
  }

  if (!response.ok) {
    const message = data?.message || data?.error || JSON.stringify(data) || 'Error en la solicitud';
    const err = new Error(message);
    err.status = response.status;
    err.payload = data;
    throw err;
  }

  // Si la API usa el wrapper { success, data }, devolver data, si no devolver payload entero
  if (data && typeof data === 'object' && Object.prototype.hasOwnProperty.call(data, 'data')) {
    return data;
  }

  return data;
};

const attemptFetch = async (url, options) => {
  const res = await fetch(url, options);
  return await parseResponse(res);
};

// Función para hacer requests
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && USE_AUTH) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  const url = `${API_BASE_URL}${endpoint}`;
  return attemptFetch(url, fetchOptions);
};

export const apiClient = {
  configure: configureApi,
  get: (endpoint) => apiCall(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiCall(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => apiCall(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' }),
  _getBaseUrl: () => API_BASE_URL,
};

export default apiClient;
