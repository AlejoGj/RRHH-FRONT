// Configurable base URL: prefer Vite env `VITE_API_BASE_URL`, fallback local
const DEFAULT_API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'http://localhost:3000/api';
let API_BASE_URL = DEFAULT_API_BASE;
let FALLBACK_BASE_URL = null; // opcional: punto de fallback cuando la API principal no responda
let USE_AUTH = false; // por defecto no enviar Authorization (la nueva API no usa JWT)

// Función para obtener el token (mantener compatibilidad)
const getToken = () => sessionStorage.getItem('authToken');

export const configureApi = ({ baseUrl, fallbackBaseUrl, useAuth } = {}) => {
  if (baseUrl) API_BASE_URL = baseUrl;
  if (fallbackBaseUrl) FALLBACK_BASE_URL = fallbackBaseUrl;
  if (typeof useAuth === 'boolean') USE_AUTH = useAuth;
};

// Parseo tolerante de respuestas
const parseResponse = async (response) => {
  if (!response) throw new Error('No response');
  if (response.status === 204) return null; // No Content

  let data;
  try {
    data = await response.json();
  } catch (e) {
    // respuesta no JSON
    const text = await response.text();
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

// Intentar petición principal y, si falla por red, intentar fallback si está configurado
const attemptFetch = async (url, options) => {
  try {
    const res = await fetch(url, options);
    return await parseResponse(res);
  } catch (err) {
    // Si hay fallback configurado y es error de red, intentar fallback
    if (FALLBACK_BASE_URL && (err instanceof TypeError || err.message.includes('Failed to fetch'))) {
      // Mapear endpoint '/api/resource' a '/<fallbackBase>/<resource>.json'
      const ep = options._endpoint || '';
      const filePath = ep.replace(/^\/api\//, '');
      const fallbackUrl = `${FALLBACK_BASE_URL}/${filePath}.json`;
      try {
        const res = await fetch(fallbackUrl, options);
        return await parseResponse(res);
      } catch (e) {
        throw e;
      }
    }
    throw err;
  }
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

  // attach endpoint for fallback url construction
  fetchOptions._endpoint = endpoint;

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
  _getFallbackUrl: () => FALLBACK_BASE_URL,
};

export default apiClient;
