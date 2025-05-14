import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-text">CareerTrack</span>
        </Link>

        <div className="navbar-mobile-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <div className="navbar-end">
            {currentUser && (
              <>
                <span className="navbar-email">{currentUser.email}</span>
                <button onClick={handleLogout} className="navbar-logout">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar