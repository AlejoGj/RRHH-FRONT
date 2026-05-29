import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './estilos.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { apiClient } from './services/apiClient.js';

// Configurar uso de mocks locales durante la migración (cambiar cuando la API Spring esté lista)
apiClient.configure({ fallbackBaseUrl: '/src/mocks', useAuth: false });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

