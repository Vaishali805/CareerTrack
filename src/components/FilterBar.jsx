import { useState } from 'react'
import './FilterBar.css'

const FilterBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    type: 'All',
    location: ''
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedFilters = { ...filters, [name]: value }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }
  
  const handleReset = () => {
    const resetFilters = {
      search: '',
      status: 'All',
      type: 'All',
      location: ''
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }
  
  return (
    <div className="filter-bar">
      <div className="filter-search">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search by company name..."
        />
      </div>
      
      <div className="filter-options">
        <div className="filter-option">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="All">All</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        
        <div className="filter-option">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleChange}
          >
            <option value="All">All</option>
            <option value="Job">Job</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        
        <div className="filter-option">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Filter by location"
          />
        </div>
      </div>
      
      <button className="btn-outline filter-reset" onClick={handleReset}>
        Reset
      </button>
    </div>
  )
}

export default FilterBar