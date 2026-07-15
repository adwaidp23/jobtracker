import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import './RecentActivities.css';

const STATUS_COLORS = {
  Saved: { color: '#64748B', bg: '#F1F5F9' },
  Preparing: { color: '#8B5CF6', bg: '#F5F3FF' },
  Applied: { color: '#3B82F6', bg: '#E6F2FF' },
  Assessment: { color: '#F97316', bg: '#FFF3E0' },
  Interview: { color: '#FFCE20', bg: '#FFF9E5' },
  Offer: { color: '#05CD99', bg: '#E6FAF5' },
  Accepted: { color: '#05CD99', bg: '#E6FAF5' },
  Rejected: { color: '#EE5D50', bg: '#FDE8E7' },
  Withdrawn: { color: '#64748B', bg: '#F1F5F9' },
  Archived: { color: '#64748B', bg: '#F1F5F9' },
};

function formatTimestamp(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function RecentActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await apiClient.get('/analytics/recent-activities');
        setActivities(res.data);
      } catch (err) {
        console.error('Failed to fetch recent activities', err);
        setError('Could not load recent activity.');
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) {
    return <div className="recent-loading">Loading activity…</div>;
  }

  if (error) {
    return <div className="recent-empty">{error}</div>;
  }

  const data = activities.length > 0 ? activities : [
    {
      application_id: 1,
      company_name: 'Google',
      role_name: 'Senior UX Engineer position • Mountain View, CA',
      new_status: 'Interview',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      icon: 'update'
    },
    {
      application_id: 2,
      company_name: 'Stripe',
      role_name: 'Lead Product Designer • Remote',
      new_status: 'Applied',
      timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
      icon: 'send'
    },
    {
      application_id: 3,
      company_name: 'Airbnb Recruiting',
      role_name: 'Portfolio Review follow-up',
      new_status: 'Follow-up email sent',
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
      icon: 'mail'
    }
  ];

  return (
    <div className="recent-container">
      {data.map((activity, index) => {
        return (
          <div key={`${activity.application_id}-${index}`} className="recent-item">
            <div className="recent-icon-wrapper">
              <span className="material-symbols-outlined recent-icon">{activity.icon || 'history'}</span>
            </div>
            <div className="recent-content">
              <div className="recent-header">
                <p className="recent-title">
                  <strong>{activity.company_name}</strong> {activity.new_status === 'Follow-up email sent' ? activity.new_status : `updated status to`} 
                  {activity.new_status !== 'Follow-up email sent' && (
                    <span className="status-badge">{activity.new_status.toUpperCase()}</span>
                  )}
                </p>
                <span className="recent-time">{formatTimestamp(activity.timestamp)}</span>
              </div>
              <p className="recent-role">{activity.role_name}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
