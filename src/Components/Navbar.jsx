import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

/* Pasar props al navbar en cada page */
export default function Navbar({user, onLogout}) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-text">💼 RRHH System</Link>
      </div>

      <div className="navbar-content">
        {user ? (
          <>
            {/* Opciones cuando está logueado */}
            <div className="nav-links">
              <Link to="/dashboard" className="nav-link">📊 Dashboard</Link>
              <Link to="/vacantes" className="nav-link">📋 Vacantes</Link>
              <Link to="/aspirantes" className="nav-link">👥 Aspirantes</Link>
              <Link to="/procesos" className="nav-link">⚙️ Procesos</Link>
            </div>

            <div className="nav-user">
              <span className="user-name">👤 {user}</span>
              <button className="btn-logout" onClick={onLogout}>🚪 Logout</button>
            </div>
          </>
        ) : (
          <>
            {/* Opciones cuando NO está logueado */}
            <div className="nav-auth">
              <Link to="/Login" className="nav-link-auth login">🔐 Login</Link>
              <Link to="/Register" className="nav-link-auth register">✍️ Register</Link>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
