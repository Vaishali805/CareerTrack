import { NavLink } from 'react-router-dom'
import { useApplications } from '../contexts/ApplicationContext'
import './Sidebar.css'

const Sidebar = () => {
  const { getUpcomingDeadlines } = useApplications()
  const upcomingDeadlines = getUpcomingDeadlines()

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                <span className="sidebar-icon">📊</span>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/applications" className={({ isActive }) => isActive ? 'active' : ''}>
                <span className="sidebar-icon">📝</span>
                Applications
              </NavLink>
            </li>
            <li>
              <NavLink to="/reminders" className={({ isActive }) => isActive ? 'active' : ''}>
                <span className="sidebar-icon">⏰</span>
                Deadlines
                {upcomingDeadlines.length > 0 && (
                  <span className="badge-count">{upcomingDeadlines.length}</span>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <NavLink to="/applications/add" className="btn-primary add-application-btn">
            + Add Application
          </NavLink>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar