import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import StatCard from './StatCard';
import RecentActivities from './RecentActivities';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';
import '../App.css';
import './Dashboard.css';

export default function Dashboard() {
  const { logout, user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiClient.get('/analytics/dashboard');
        setMetrics(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [logout]);

  if (loading) {
    return <Loader message="Loading Dashboard..." />;
  }

  const data = metrics || {
    total_applications: 42,
    interviews_scheduled: 8,
    offers_received: 2,
    rejections: 0,
    application_funnel: {},
    platform_success_rate: [],
    weekly_activity: []
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header contextualAction={
          <div className="header-status">
            Active Search <span className="material-symbols-outlined" style={{color: 'var(--success-green)', fontSize: '18px'}}>check_circle</span>
          </div>
        } />
        
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h1 className="greeting">Good Morning, {user?.name?.split(' ')[0] || 'Alex'}</h1>
              <p className="greeting-sub">Here's what is happening with your job search today.</p>
            </div>
          </div>

          <div className="stats-grid">
            <StatCard 
              title="Total Applications" 
              value={data.total_applications} 
              badgeText="+12%" 
              badgeIcon="trending_up"
              badgeType="positive"
            />
            <StatCard 
              title="Interviews Scheduled" 
              value={data.interviews_scheduled || 0} 
              badgeText="Next: 2d" 
              badgeIcon="event"
              badgeType="default"
            />
            <StatCard 
              title="Offers Received" 
              value={data.offers_received} 
              badgeText="High Priority" 
              badgeIcon="emoji_events"
              badgeType="danger"
            />
            <StatCard 
              title="Active Leads" 
              value="15" 
              badgeText="Updated 5m ago" 
              badgeIcon="history"
              badgeType="muted"
            />
          </div>

          <div className="dashboard-main-grid">
            <div className="dashboard-column-left">
              <div className="card">
                <div className="card-header-flex">
                  <h2 className="card-title">Recent Activity</h2>
                  <a href="#" className="view-all-link">View All</a>
                </div>
                <RecentActivities />
              </div>

              <div className="hiring-trends-card">
                <div className="hiring-trends-content">
                  <h2>Hiring Trends</h2>
                  <p>Your profile is matching 85% of tech lead roles in Austin.</p>
                  <button className="primary-btn-outline">Analyze Profile</button>
                </div>
              </div>
            </div>

            <div className="dashboard-column-right">
              <div className="card upcoming-interviews-card">
                <h2 className="card-title">Upcoming Interviews</h2>
                <div className="interview-list">
                  <div className="interview-item">
                    <div className="interview-date">
                      <span className="month">OCT</span>
                      <span className="day">24</span>
                    </div>
                    <div className="interview-details">
                      <h4>Figma</h4>
                      <p>10:00 AM • Technical Screen</p>
                    </div>
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                  <div className="interview-item">
                    <div className="interview-date">
                      <span className="month">OCT</span>
                      <span className="day">26</span>
                    </div>
                    <div className="interview-details">
                      <h4>Vercel</h4>
                      <p>02:30 PM • Culture Fit</p>
                    </div>
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
                <button className="sync-calendar-btn">Sync with Calendar</button>
              </div>

              <div className="card daily-goal-card">
                <h2 className="card-title">Daily Goal</h2>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{width: '75%'}}></div>
                </div>
                <p><strong>3 of 4</strong> applications submitted today.</p>
              </div>

              <div className="resume-score-card">
                <div className="resume-score-content">
                  <div className="score-text">
                    <h3>Resume Score: 92/100</h3>
                    <p>Your resume is optimized for UI/UX positions.</p>
                  </div>
                  <button className="download-btn">Download Report</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
