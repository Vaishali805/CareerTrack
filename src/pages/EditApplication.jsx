import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApplications } from '../contexts/ApplicationContext'
import ApplicationForm from '../components/ApplicationForm'
import './ApplicationForm.css'

const EditApplication = () => {
  const { id } = useParams()
  const { applications, updateApplication } = useApplications()
  const [application, setApplication] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const navigate = useNavigate()
  
  useEffect(() => {
    const app = applications.find(app => app.id === id)
    if (app) {
      setApplication(app)
    } else {
      setNotFound(true)
    }
  }, [id, applications])
  
  const handleSubmit = (formData) => {
    updateApplication(id, formData)
    navigate('/applications')
  }
  
  if (notFound) {
    return (
      <div className="application-not-found">
        <h2>Application Not Found</h2>
        <p>The application you're looking for doesn't exist or has been deleted.</p>
        <button onClick={() => navigate('/applications')} className="btn-primary">
          Back to Applications
        </button>
      </div>
    )
  }
  
  if (!application) {
    return <div className="loading">Loading application...</div>
  }
  
  return (
    <div className="application-form-page fade-in">
      <div className="application-form-header">
        <h1>Edit Application</h1>
        <p>Update your application details for {application.companyName}</p>
      </div>
      
      <ApplicationForm 
        initialData={application} 
        onSubmit={handleSubmit} 
        submitButtonText="Update Application" 
      />
    </div>
  )
}

export default EditApplication