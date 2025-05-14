import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  // Register a new user
  const register = (email, password) => {
    return new Promise((resolve, reject) => {
      try {
        // Get existing users from localStorage or initialize empty array
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        
        // Check if user already exists
        const userExists = users.some(user => user.email === email)
        if (userExists) {
          reject(new Error('User already exists'))
          return
        }
        
        // Create new user
        const newUser = { id: Date.now().toString(), email, password }
        
        // Add to users array
        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))
        
        // Set current user and auth state
        setCurrentUser(newUser)
        localStorage.setItem('currentUser', JSON.stringify(newUser))
        setIsAuthenticated(true)
        
        resolve(newUser)
      } catch (error) {
        reject(error)
      }
    })
  }

  // Login existing user
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      try {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        
        // Find user with matching email and password
        const user = users.find(user => user.email === email && user.password === password)
        
        if (user) {
          // Set current user and auth state
          setCurrentUser(user)
          localStorage.setItem('currentUser', JSON.stringify(user))
          setIsAuthenticated(true)
          resolve(user)
        } else {
          reject(new Error('Invalid email or password'))
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  // Logout user
  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('currentUser')
  }

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    register,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}