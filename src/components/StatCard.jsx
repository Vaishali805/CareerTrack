import './StatCard.css'

const StatCard = ({ title, value, icon, color = 'primary', percent }) => {
  return (
    <div className={`stat-card card stat-card-${color}`}>
      <div className="stat-card-icon">
        <span>{icon}</span>
      </div>
      <div className="stat-card-content">
        <h3 className="stat-card-title">{title}</h3>
        <div className="stat-card-value">{value}</div>
        {percent !== undefined && (
          <div className="stat-card-percent">
            <span className={percent >= 0 ? 'positive' : 'negative'}>
              {percent >= 0 ? '+' : ''}{percent}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard