const API_BASE_URL = 'http://localhost:3000/api';

// Función para obtener el token
const getToken = () => sessionStorage.getItem('authToken');

// Función para hacer requests
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la solicitud');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const apiClient = {
  get: (endpoint) => apiCall(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiCall(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => apiCall(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' }),
};

export default apiClient;
