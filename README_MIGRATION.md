Migración a API Spring

- Estado: Los archivos de mocks fueron archivados en `archive/mocks/`.
- Configuración del front para usar la API Spring:
  - Ajustar la variable de entorno Vite `VITE_API_BASE_URL` al endpoint de Spring, por ejemplo:
    - `VITE_API_BASE_URL=http://localhost:8080/api`
  - El cliente HTTP usa `import.meta.env.VITE_API_BASE_URL` por defecto; no se requieren cambios en el código.
- Autenticación:
  - La API Spring no requiere autenticación; el front mantiene `useAuth=false` por defecto.
- Si necesita volver a usar los mocks para pruebas locales, los JSON están en `archive/mocks/`.
