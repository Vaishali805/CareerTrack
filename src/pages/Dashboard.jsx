import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useApplications } from '../contexts/ApplicationContext'
import StatCard from '../components/StatCard'
import './Dashboard.css'

const Dashboard = () => {
  const { applications, getStats, getUpcomingDeadlines } = useApplications()
  const [stats, setStats] = useState({ total: 0, statusCounts: {}, typeCounts: {} })
  const [deadlines, setDeadlines] = useState([])
  
  useEffect(() => {
    if (applications.length > 0) {
      setStats(getStats())
      setDeadlines(getUpcomingDeadlines())
    }
  }, [applications, getStats, getUpcomingDeadlines])
  
  // Prepare data for charts
  const statusData = [
    { name: 'Applied', value: stats.statusCounts.Applied || 0, color: '#3B82F6' },
    { name: 'Interviewing', value: stats.statusCounts.Interviewing || 0, color: '#A855F7' },
    { name: 'Offered', value: stats.statusCounts.Offered || 0, color: '#22C55E' },
    { name: 'Rejected', value: stats.statusCounts.Rejected || 0, color: '#EF4444' }
  ]
  
  const typeData = [
    { name: 'Jobs', value: stats.typeCounts.Job || 0, color: '#3B82F6' },
    { name: 'Internships', value: stats.typeCounts.Internship || 0, color: '#A855F7' }
  ]
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
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
    return 'deadline-upcoming'
  }
  
  return (
    <div className="dashboard-container fade-in">
      <h1>Dashboard</h1>
      
      <div className="dashboard-stats">
        <StatCard 
          title="Total Applications" 
          value={stats.total} 
          icon="📝" 
          color="primary" 
        />
        <StatCard 
          title="Interviews" 
          value={stats.statusCounts.Interviewing || 0} 
          icon="🎯" 
          color="accent" 
        />
        <StatCard 
          title="Offers" 
          value={stats.statusCounts.Offered || 0} 
          icon="🎉" 
          color="success" 
        />
        <StatCard 
          title="Upcoming Deadlines" 
          value={deadlines.length} 
          icon="⏰" 
          color="warning" 
        />
      </div>
      
      {applications.length > 0 ? (
        <>
          <div className="dashboard-charts">
            <div className="dashboard-chart-card card">
              <h3>Applications by Status</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" name="Applications">
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="dashboard-chart-card card">
              <h3>Applications by Type</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="dashboard-deadlines card">
            <div className="deadlines-header">
              <h3>Upcoming Deadlines</h3>
              <Link to="/reminders" className="btn-outline">View All</Link>
            </div>
            
            {deadlines.length > 0 ? (
              <ul className="deadlines-list">
                {deadlines.slice(0, 5).map(app => (
                  <li key={app.id} className="deadline-item">
                    <div className="deadline-details">
                      <span className="deadline-company">{app.companyName}</span>
                      <span className="deadline-role">{app.role}</span>
                    </div>
                    <div className="deadline-date-container">
                      <span className={`deadline-date ${getDeadlineClass(app.deadline)}`}>
                        {formatDate(app.deadline)}
                      </span>
                      <span className="deadline-days">
                        {calculateDaysRemaining(app.deadline) === 0 
                          ? 'Today'
                          : calculateDaysRemaining(app.deadline) === 1
                            ? 'Tomorrow' 
                            : `${calculateDaysRemaining(app.deadline)} days`}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-deadlines">No upcoming deadlines</p>
            )}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h2>Welcome to CareerTrack!</h2>
          <p>Start tracking your job and internship applications.</p>
          <Link to="/applications/add" className="btn-primary">
            Add Your First Application
          </Link>
        </div>
      )}
    </div>
  )
}

export default Dashboard