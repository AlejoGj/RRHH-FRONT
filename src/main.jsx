import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './estilos.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { apiClient } from './services/apiClient.js';

// El cliente usa `import.meta.env.VITE_API_BASE_URL` por defecto.
// Para apuntar a Spring: configurar `VITE_API_BASE_URL` en el entorno de Vite.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

