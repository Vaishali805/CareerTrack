import { useState, useEffect } from 'react'
import './ApplicationForm.css'

const ApplicationForm = ({ 
  initialData = {},
  onSubmit,
  submitButtonText = 'Submit'
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    status: 'Applied',
    type: 'Job',
    location: '',
    deadline: '',
    tags: '',
    ...initialData
  })
  
  const [errors, setErrors] = useState({})
  
  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData({
        companyName: '',
        role: '',
        status: 'Applied',
        type: 'Job',
        location: '',
        deadline: '',
        tags: '',
        ...initialData
      })
    }
  }, [initialData])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }
    
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required'
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required'
    }
    
    if (!formData.type) {
      newErrors.type = 'Type is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }
  
  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="companyName">Company Name *</label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className={errors.companyName ? 'error' : ''}
        />
        {errors.companyName && <div className="error-message">{errors.companyName}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="role">Role *</label>
        <input
          type="text"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={errors.role ? 'error' : ''}
        />
        {errors.role && <div className="error-message">{errors.role}</div>}
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status *</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={errors.status ? 'error' : ''}
          >
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
          {errors.status && <div className="error-message">{errors.status}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="type">Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={errors.type ? 'error' : ''}
          >
            <option value="Job">Job</option>
            <option value="Internship">Internship</option>
          </select>
          {errors.type && <div className="error-message">{errors.type}</div>}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="deadline">Deadline</label>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="tags">Tags (comma separated)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g. remote, full-time, tech"
        />
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {submitButtonText}
        </button>
      </div>
    </form>
  )
}

export default ApplicationForm