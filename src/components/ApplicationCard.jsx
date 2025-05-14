import { Link } from 'react-router-dom'
import { useApplications } from '../contexts/ApplicationContext'
import './ApplicationCard.css'

const ApplicationCard = ({ application }) => {
  const { deleteApplication } = useApplications()
  
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Applied': return 'badge-applied'
      case 'Interviewing': return 'badge-interviewing'
      case 'Offered': return 'badge-offered'
      case 'Rejected': return 'badge-rejected'
      default: return 'badge-applied'
    }
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const handleDelete = (e) => {
    e.preventDefault()
    if (window.confirm('Are you sure you want to delete this application?')) {
      deleteApplication(application.id)
    }
  }
  
  return (
    <div className="application-card card">
      <div className="application-card-header">
        <div className="application-card-company">
          <h3>{application.companyName}</h3>
          <span className={`badge ${getBadgeClass(application.status)}`}>
            {application.status}
          </span>
        </div>
        <span className="application-card-type">{application.type}</span>
      </div>
      
      <div className="application-card-body">
        <div className="application-card-role">
          <strong>Role:</strong> {application.role}
        </div>
        
        <div className="application-card-location">
          <strong>Location:</strong> {application.location || 'Not specified'}
        </div>
        
        <div className="application-card-deadline">
          <strong>Deadline:</strong> {formatDate(application.deadline)}
        </div>
        
        {application.tags && (
          <div className="application-card-tags">
            {application.tags.split(',').map((tag, index) => (
              <span key={index} className="tag">{tag.trim()}</span>
            ))}
          </div>
        )}
      </div>
      
      <div className="application-card-footer">
        <Link to={`/applications/edit/${application.id}`} className="btn-outline">
          Edit
        </Link>
        <button onClick={handleDelete} className="btn-danger">
          Delete
        </button>
      </div>
    </div>
  )
}

export default ApplicationCard