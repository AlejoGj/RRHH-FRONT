import { useState, useEffect } from 'react'
import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import AspirantesPage from './Pages/AspirantesPage'
import VacantesPage from './Pages/vacantesPage'
import ProcesosPage from './Pages/ProcesosPage'
import DashboardPage from './Pages/DashboardPage'

import Aspirantes from './Components/Aspirantes'
import Navbar from './Components/Navbar'
import authService from './services/authService'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [userName, setUserName] = useState(authService.getUserName() || '');

  useEffect(() => {
    const token = authService.getToken();
    const name = authService.getUserName();

    if (token && name) {
      setIsAuthenticated(true);
      setUserName(name);
    }
  }, []);

  const handleLogin = (userName) => {
    setIsAuthenticated(true);
    setUserName(userName);
  };

  const handlerLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
    authService.logout();
  }

  return (
    <>
      <Routes>
        {/* 🔓 Rutas Públicas */}
        <Route path='/' element={<LoginPage onLogin={handleLogin} user={userName} />}/>
        <Route path='/Login' element={<LoginPage onLogin={handleLogin} user={userName} />}/>

        {/* 🔒 Rutas Protegidas */}
        <Route
          path='/Register'
          element={isAuthenticated ? <RegisterPage user={userName} onLogout={handlerLogout}/> : <Navigate to="/Login" replace />}
        />

        <Route
          path='/dashboard'
          element={isAuthenticated ? <DashboardPage user={userName} onLogout={handlerLogout}/> : <Navigate to="/Login" replace />}
        />

        <Route
          path='/vacantes'
          element={isAuthenticated ? <VacantesPage user={userName} onLogout={handlerLogout}/> : <Navigate to="/Login" replace />}
        />

        <Route
          path='/Aspirantes'
          element={isAuthenticated ? <><Navbar user={userName} onLogout={handlerLogout} /><Aspirantes /></> : <Navigate to="/Login" replace />}
        />

        <Route
          path='/procesos'
          element={isAuthenticated ? <ProcesosPage user={userName} onLogout={handlerLogout}/> : <Navigate to="/Login" replace />}
        />

        {/* Ruta por defecto */}
        <Route path='*' element={<Navigate to="/Login" replace />} />
      </Routes>
    </>
  )
}

export default App
