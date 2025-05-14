import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApplications } from '../contexts/ApplicationContext'
import ApplicationCard from '../components/ApplicationCard'
import FilterBar from '../components/FilterBar'
import './Applications.css'

const Applications = () => {
  const { applications, loading, exportAsCSV } = useApplications()
  const [filteredApplications, setFilteredApplications] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    type: 'All',
    location: ''
  })
  const [sortOption, setSortOption] = useState('updatedAt')
  const [sortDirection, setSortDirection] = useState('desc')
  
  // Apply filters and sorting when applications change
  useEffect(() => {
    applyFilters(filters)
  }, [applications, filters, sortOption, sortDirection])
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }
  
  const applyFilters = (filters) => {
    let result = [...applications]
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(app => 
        app.companyName.toLowerCase().includes(searchTerm)
      )
    }
    
    // Apply status filter
    if (filters.status !== 'All') {
      result = result.filter(app => app.status === filters.status)
    }
    
    // Apply type filter
    if (filters.type !== 'All') {
      result = result.filter(app => app.type === filters.type)
    }
    
    // Apply location filter
    if (filters.location) {
      const locationTerm = filters.location.toLowerCase()
      result = result.filter(app => 
        app.location && app.location.toLowerCase().includes(locationTerm)
      )
    }
    
    // Apply sorting
    result = sortApplications(result, sortOption, sortDirection)
    
    setFilteredApplications(result)
  }
  
  const sortApplications = (apps, sortBy, direction) => {
    return [...apps].sort((a, b) => {
      let valueA, valueB
      
      // Handle different sort fields
      switch (sortBy) {
        case 'companyName':
          valueA = a.companyName.toLowerCase()
          valueB = b.companyName.toLowerCase()
          break
        case 'deadline':
          // Handle missing deadlines by putting them at the end
          if (!a.deadline) return direction === 'asc' ? 1 : -1
          if (!b.deadline) return direction === 'asc' ? -1 : 1
          valueA = new Date(a.deadline)
          valueB = new Date(b.deadline)
          break
        case 'createdAt':
          valueA = new Date(a.createdAt)
          valueB = new Date(b.createdAt)
          break
        case 'updatedAt':
        default:
          valueA = new Date(a.updatedAt)
          valueB = new Date(b.updatedAt)
          break
      }
      
      // Compare based on direction
      if (direction === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0
      }
    })
  }
  
  const handleSortChange = (e) => {
    setSortOption(e.target.value)
  }
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
  }
  
  const handleExport = () => {
    if (applications.length === 0) {
      alert('No applications to export')
      return
    }
    
    const csvContent = exportAsCSV()
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.setAttribute('href', url)
    link.setAttribute('download', `career-track-applications-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  if (loading) {
    return <div className="loading">Loading applications...</div>
  }
  
  return (
    <div className="applications-container fade-in">
      <div className="applications-header">
        <h1>Applications</h1>
        <div className="applications-actions">
          <button onClick={handleExport} className="btn-outline">
            Export CSV
          </button>
          <Link to="/applications/add" className="btn-primary">
            Add Application
          </Link>
        </div>
      </div>
      
      <FilterBar onFilterChange={handleFilterChange} />
      
      <div className="applications-sort">
        <div className="sort-controls">
          <label htmlFor="sort">Sort by:</label>
          <select 
            id="sort" 
            value={sortOption} 
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="updatedAt">Last Updated</option>
            <option value="createdAt">Date Added</option>
            <option value="companyName">Company Name</option>
            <option value="deadline">Deadline</option>
          </select>
          <button 
            onClick={toggleSortDirection} 
            className="btn-outline sort-direction"
            title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        <div className="applications-count">
          Showing {filteredApplications.length} of {applications.length} applications
        </div>
      </div>
      
      {applications.length === 0 ? (
        <div className="empty-state">
          <h2>No Applications Yet</h2>
          <p>Start tracking your job and internship applications.</p>
          <Link to="/applications/add" className="btn-primary">
            Add Your First Application
          </Link>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="no-results">
          <p>No applications match your filters. Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="applications-grid">
          {filteredApplications.map(application => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Applications