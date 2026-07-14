import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import apiClient from '../api/client';
import './UpcomingEvents.css';

const EVENT_COLORS = {
  interview: { color: 'var(--primary-blue)', bg: 'var(--bg-active)' },
  assessment: { color: '#64748B', bg: '#F1F5F9' },
};

function formatEventDate(dateStr) {
  const d = new Date(dateStr);
  return {
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate().toString(),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await apiClient.get('/analytics/upcoming-events');
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to fetch upcoming events', err);
        setError('Could not load events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <div className="events-loading">Loading events…</div>;
  }

  if (error) {
    return <div className="events-empty">{error}</div>;
  }

  if (events.length === 0) {
    return (
      <div className="events-empty">
        <Calendar size={32} className="events-empty-icon" />
        <p>No upcoming events</p>
        <span>Schedule an interview or assessment to see it here.</span>
      </div>
    );
  }

  return (
    <div className="events-container">
      {events.map(event => {
        const { month, day, time } = formatEventDate(event.date);
        const colors = EVENT_COLORS[event.event_type] || EVENT_COLORS.interview;
        return (
          <div key={`${event.event_type}-${event.id}`} className="event-item">
            <div className="event-date" style={{ backgroundColor: colors.color }}>
              <span className="event-month">{month}</span>
              <span className="event-day">{day}</span>
            </div>
            <div className="event-details">
              <h4 className="event-title">{event.title}</h4>
              <p className="event-time">
                <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                {time} • {event.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
