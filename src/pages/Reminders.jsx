import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApplications } from '../contexts/ApplicationContext'
import './Reminders.css'

const Reminders = () => {
  const { applications } = useApplications()
  const [deadlines, setDeadlines] = useState([])
  
  useEffect(() => {
    if (applications.length > 0) {
      // Get all applications with deadlines and sort them by deadline
      const sortedDeadlines = applications
        .filter(app => app.deadline)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      
      setDeadlines(sortedDeadlines)
    }
  }, [applications])
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const calculateDaysRemaining = (deadline) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const deadlineDate = new Date(deadline)
    deadlineDate.setHours(0, 0, 0, 0)
    
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  }
  
  const getDeadlineClass = (deadline) => {
    const daysRemaining = calculateDaysRemaining(deadline)
    
    if (daysRemaining < 0) return 'deadline-past'
    if (daysRemaining <= 2) return 'deadline-soon'
    if (daysRemaining <= 7) return 'deadline-upcoming'
    return ''
  }
  
  const getDeadlineStatusText = (deadline) => {
    const daysRemaining = calculateDaysRemaining(deadline)
    
    if (daysRemaining < 0) return `Passed (${Math.abs(daysRemaining)} days ago)`
    if (daysRemaining === 0) return 'Today'
    if (daysRemaining === 1) return 'Tomorrow'
    return `${daysRemaining} days remaining`
  }
  
  return (
    <div className="reminders-container fade-in">
      <h1>Deadline Reminders</h1>
      
      {deadlines.length === 0 ? (
        <div className="empty-state">
          <h2>No Deadlines</h2>
          <p>You haven't added any application deadlines yet.</p>
          <Link to="/applications/add" className="btn-primary">
            Add Application with Deadline
          </Link>
        </div>
      ) : (
        <>
          <div className="deadline-sections">
            {/* Upcoming deadlines (next 7 days) */}
            <div className="deadline-section">
              <h2>Upcoming Deadlines (Next 7 Days)</h2>
              
              {deadlines.filter(app => {
                const days = calculateDaysRemaining(app.deadline)
                return days >= 0 && days <= 7
              }).length === 0 ? (
                <p className="no-deadlines">No upcoming deadlines within the next 7 days</p>
              ) : (
                <div className="deadline-cards">
                  {deadlines
                    .filter(app => {
                      const days = calculateDaysRemaining(app.deadline)
                      return days >= 0 && days <= 7
                    })
                    .map(app => (
                      <div key={app.id} className={`deadline-card card ${getDeadlineClass(app.deadline)}`}>
                        <div className="deadline-card-header">
                          <div className="deadline-info">
                            <h3>{app.companyName}</h3>
                            <span className="deadline-date">
                              {formatDate(app.deadline)}
                            </span>
                          </div>
                          <div className="deadline-status">
                            <span className={`deadline-status-text ${getDeadlineClass(app.deadline)}`}>
                              {getDeadlineStatusText(app.deadline)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="deadline-card-body">
                          <div className="deadline-detail">
                            <span className="deadline-label">Role:</span>
                            <span className="deadline-value">{app.role}</span>
                          </div>
                          
                          <div className="deadline-detail">
                            <span className="deadline-label">Status:</span>
                            <span className="deadline-value">{app.status}</span>
                          </div>
                          
                          <div className="deadline-detail">
                            <span className="deadline-label">Type:</span>
                            <span className="deadline-value">{app.type}</span>
                          </div>
                          
                          {app.location && (
                            <div className="deadline-detail">
                              <span className="deadline-label">Location:</span>
                              <span className="deadline-value">{app.location}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="deadline-card-footer">
                          <Link to={`/applications/edit/${app.id}`} className="btn-outline">
                            View/Edit
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            {/* All other deadlines */}
            <div className="deadline-section">
              <h2>All Other Deadlines</h2>
              
              {deadlines.filter(app => {
                const days = calculateDaysRemaining(app.deadline)
                return days > 7 || days < 0
              }).length === 0 ? (
                <p className="no-deadlines">No other deadlines</p>
              ) : (
                <div className="deadlines-table-container">
                  <table className="deadlines-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Deadline</th>
                        <th>Status</th>
                        <th>Time Remaining</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deadlines
                        .filter(app => {
                          const days = calculateDaysRemaining(app.deadline)
                          return days > 7 || days < 0
                        })
                        .map(app => (
                          <tr key={app.id} className={getDeadlineClass(app.deadline)}>
                            <td>{app.companyName}</td>
                            <td>{app.role}</td>
                            <td>{formatDate(app.deadline)}</td>
                            <td>{app.status}</td>
                            <td className={getDeadlineClass(app.deadline)}>
                              {getDeadlineStatusText(app.deadline)}
                            </td>
                            <td>
                              <Link to={`/applications/edit/${app.id}`} className="btn-outline btn-sm">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Reminders