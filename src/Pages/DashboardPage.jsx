import React from 'react'
import Navbar from '../Components/Navbar'
import Dashboard from '../Components/Dashboard'
import Footer from '../Components/Footer'

export default function DashboardPage({ user, onLogout }) {
  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <Dashboard />
      <Footer />
    </>
  )
}
