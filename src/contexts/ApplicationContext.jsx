import { createContext, useState, useContext, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { v4 as uuidv4 } from 'uuid'

const ApplicationContext = createContext(null)

export const useApplications = () => useContext(ApplicationContext)

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const { currentUser, isAuthenticated } = useAuth()

  // Load applications from localStorage when auth state changes
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadApplications()
    } else {
      setApplications([])
      setLoading(false)
    }
  }, [isAuthenticated, currentUser])

  // Load applications for current user
  const loadApplications = () => {
    try {
      const storedApplications = JSON.parse(
        localStorage.getItem(`applications_${currentUser.id}`) || '[]'
      )
      setApplications(storedApplications)
      setLoading(false)
    } catch (error) {
      console.error('Error loading applications:', error)
      setApplications([])
      setLoading(false)
    }
  }

  // Save applications to localStorage
  const saveApplications = (updatedApplications) => {
    try {
      localStorage.setItem(
        `applications_${currentUser.id}`,
        JSON.stringify(updatedApplications)
      )
    } catch (error) {
      console.error('Error saving applications:', error)
    }
  }

  // Add a new application
  const addApplication = (applicationData) => {
    const newApplication = {
      id: uuidv4(),
      ...applicationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedApplications = [...applications, newApplication]
    setApplications(updatedApplications)
    saveApplications(updatedApplications)
    return newApplication
  }

  // Update an existing application
  const updateApplication = (id, updatedData) => {
    const updatedApplications = applications.map(app => 
      app.id === id 
        ? { 
            ...app, 
            ...updatedData, 
            updatedAt: new Date().toISOString() 
          } 
        : app
    )
    
    setApplications(updatedApplications)
    saveApplications(updatedApplications)
  }

  // Delete an application
  const deleteApplication = (id) => {
    const updatedApplications = applications.filter(app => app.id !== id)
    setApplications(updatedApplications)
    saveApplications(updatedApplications)
  }

  // Get application statistics
  const getStats = () => {
    const total = applications.length
    const statusCounts = {
      Applied: applications.filter(app => app.status === 'Applied').length,
      Interviewing: applications.filter(app => app.status === 'Interviewing').length,
      Offered: applications.filter(app => app.status === 'Offered').length,
      Rejected: applications.filter(app => app.status === 'Rejected').length
    }
    
    const typeCounts = {
      Job: applications.filter(app => app.type === 'Job').length,
      Internship: applications.filter(app => app.type === 'Internship').length
    }
    
    return {
      total,
      statusCounts,
      typeCounts
    }
  }

  // Get upcoming deadline reminders (within next 7 days)
  const getUpcomingDeadlines = () => {
    const now = new Date()
    const oneWeekFromNow = new Date()
    oneWeekFromNow.setDate(now.getDate() + 7)
    
    return applications.filter(app => {
      if (!app.deadline) return false
      
      const deadlineDate = new Date(app.deadline)
      return deadlineDate >= now && deadlineDate <= oneWeekFromNow
    }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  }

  // Export applications as CSV
  const exportAsCSV = () => {
    if (applications.length === 0) return ''
    
    // Define CSV columns
    const headers = [
      'Company Name',
      'Role',
      'Status',
      'Type',
      'Location',
      'Deadline',
      'Tags',
      'Created At',
      'Updated At'
    ]
    
    // Generate CSV content
    const csvContent = [
      headers.join(','),
      ...applications.map(app => {
        return [
          `"${app.companyName || ''}"`,
          `"${app.role || ''}"`,
          `"${app.status || ''}"`,
          `"${app.type || ''}"`,
          `"${app.location || ''}"`,
          app.deadline || '',
          `"${app.tags || ''}"`,
          app.createdAt || '',
          app.updatedAt || ''
        ].join(',')
      })
    ].join('\n')
    
    return csvContent
  }

  const value = {
    applications,
    loading,
    addApplication,
    updateApplication,
    deleteApplication,
    getStats,
    getUpcomingDeadlines,
    exportAsCSV
  }

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  )
}