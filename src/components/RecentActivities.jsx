import { useState, useEffect } from 'react';
import { Send, ArrowRight, Activity } from 'lucide-react';
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

  if (activities.length === 0) {
    return (
      <div className="recent-empty">
        <Activity size={32} className="recent-empty-icon" />
        <p>No recent activity</p>
        <span>Add and update applications to see your activity here.</span>
      </div>
    );
  }

  return (
    <div className="recent-container">
      {activities.map((activity, index) => {
        const newColors = STATUS_COLORS[activity.new_status] || STATUS_COLORS.Saved;
        return (
          <div key={`${activity.application_id}-${activity.timestamp}`} className="recent-item">
            <div className="recent-icon-wrapper">
              <div
                className="recent-icon"
                style={{ backgroundColor: newColors.bg, color: newColors.color }}
              >
                <Send size={14} />
              </div>
              {index < activities.length - 1 && <div className="recent-line"></div>}
            </div>
            <div className="recent-content">
              <p className="recent-title">
                <strong>{activity.company_name}</strong> — {activity.role_name}
              </p>
              <p className="recent-status">
                {activity.old_status && (
                  <span className="recent-status-chip" style={{ background: (STATUS_COLORS[activity.old_status] || STATUS_COLORS.Saved).bg, color: (STATUS_COLORS[activity.old_status] || STATUS_COLORS.Saved).color }}>
                    {activity.old_status}
                  </span>
                )}
                {activity.old_status && <ArrowRight size={12} style={{ margin: '0 4px' }} />}
                <span className="recent-status-chip" style={{ background: newColors.bg, color: newColors.color }}>
                  {activity.new_status}
                </span>
              </p>
              <p className="recent-time">{formatTimestamp(activity.timestamp)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
