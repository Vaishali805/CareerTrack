import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import AddApplication from './pages/AddApplication'
import EditApplication from './pages/EditApplication'
import Reminders from './pages/Reminders'
import NotFound from './pages/NotFound'

// Components
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  // Add page transition animation
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
      />

      {/* Protected routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/applications/add" element={<AddApplication />} />
        <Route path="/applications/edit/:id" element={<EditApplication />} />
        <Route path="/reminders" element={<Reminders />} />
      </Route>
      
      {/* Redirect from homepage to dashboard if logged in, otherwise to login */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
      />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App