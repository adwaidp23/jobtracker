import './StatCard.css';

export default function StatCard({ title, value, badgeText, badgeIcon, badgeType }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <h3 className="stat-title">{title}</h3>
        {badgeText && (
          <div className={`stat-badge stat-badge--${badgeType || 'default'}`}>
            {badgeIcon && <span className="material-symbols-outlined badge-icon">{badgeIcon}</span>}
            {badgeText}
          </div>
        )}
      </div>
      <div className="stat-content">
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}
