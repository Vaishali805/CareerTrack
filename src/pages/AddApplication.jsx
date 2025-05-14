import { useNavigate } from 'react-router-dom'
import { useApplications } from '../contexts/ApplicationContext'
import ApplicationForm from '../components/ApplicationForm'
import './ApplicationForm.css'

const AddApplication = () => {
  const { addApplication } = useApplications()
  const navigate = useNavigate()
  
  const handleSubmit = (formData) => {
    addApplication(formData)
    navigate('/applications')
  }
  
  return (
    <div className="application-form-page fade-in">
      <div className="application-form-header">
        <h1>Add Application</h1>
        <p>Track a new job or internship application</p>
      </div>
      
      <ApplicationForm 
        onSubmit={handleSubmit} 
        submitButtonText="Add Application" 
      />
    </div>
  )
}

export default AddApplication