import React from 'react';
import { Send, Users, Calendar } from 'lucide-react';
import './RecentActivities.css';

const activities = [
  {
    id: 1,
    type: 'apply',
    icon: Send,
    iconColor: '#3B82F6',
    iconBg: '#E6F2FF',
    title: 'Applied to Deloitte Data Analyst Intern',
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'referral',
    icon: Users,
    iconColor: '#05CD99',
    iconBg: '#E6FAF5',
    title: 'Referral received from Sarah Miller (Google)',
    time: 'Yesterday, 4:15 PM'
  },
  {
    id: 3,
    type: 'interview',
    icon: Calendar,
    iconColor: '#FFCE20',
    iconBg: '#FFF9E5',
    title: 'Interview scheduled with Netflix',
    time: 'Yesterday, 11:30 AM'
  }
];

export default function RecentActivities() {
  return (
    <div className="recent-container">
      {activities.map((activity, index) => (
        <div key={activity.id} className="recent-item">
          <div className="recent-icon-wrapper">
            <div 
              className="recent-icon" 
              style={{ backgroundColor: activity.iconBg, color: activity.iconColor }}
            >
              <activity.icon size={14} />
            </div>
            {index < activities.length - 1 && <div className="recent-line"></div>}
          </div>
          <div className="recent-content">
            <p className="recent-title">{activity.title}</p>
            <p className="recent-time">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
