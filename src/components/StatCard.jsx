import React from 'react';
import './StatCard.css';

export default function StatCard({ title, value, change, icon: Icon, changeType, iconColor, iconBg }) {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';

  return (
    <div className="stat-card">
      <div className="stat-header">
        <div 
          className="stat-icon-wrapper" 
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <Icon size={20} />
        </div>
        {change && (
          <div className={`stat-change ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'}`}>
            {isPositive ? '+' : ''}{change}
          </div>
        )}
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}
