import React from 'react';
import './UpcomingEvents.css';

const events = [
  {
    id: 1,
    month: 'OCT',
    day: '24',
    title: 'Google - Technical Round',
    time: '10:00 AM • Google Meet',
    color: 'var(--primary-blue)',
    bgColor: 'var(--bg-active)'
  },
  {
    id: 2,
    month: 'OCT',
    day: '25',
    title: 'Meta - Referral Call',
    time: '02:30 PM • Zoom',
    color: 'var(--success-green)',
    bgColor: 'var(--success-bg)'
  },
  {
    id: 3,
    month: 'OCT',
    day: '27',
    title: 'Amazon - Assessment Due',
    time: '11:59 PM • HackerRank',
    color: '#64748B',
    bgColor: '#F1F5F9'
  }
];

export default function UpcomingEvents() {
  return (
    <div className="events-container">
      {events.map(event => (
        <div key={event.id} className="event-item">
          <div 
            className="event-date" 
            style={{ backgroundColor: event.color }}
          >
            <span className="event-month">{event.month}</span>
            <span className="event-day">{event.day}</span>
          </div>
          <div className="event-details">
            <h4 className="event-title">{event.title}</h4>
            <p className="event-time">{event.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
