import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import StatCard from './StatCard';
import ApplicationFunnel from './ApplicationFunnel';
import UpcomingEvents from './UpcomingEvents';
import PlatformSuccessRate from './PlatformSuccessRate';
import WeeklyActivity from './WeeklyActivity';
import RecentActivities from './RecentActivities';
import { Briefcase, Send, MessageSquare, Award } from 'lucide-react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../App.css';

export default function Dashboard() {
  const { logout } = useAuth();
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
    return <div className="loading-screen">Loading dashboard...</div>;
  }

  // Fallback metrics if API is empty
  const data = metrics || {
    total_applications: 0,
    interviews_scheduled: 0,
    offers_received: 0,
    rejections: 0,
    application_funnel: {},
    platform_success_rate: [],
    weekly_activity: []
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        
        <div className="dashboard-grid">
          <div className="stats-row">
            <StatCard 
              title="Total Opportunities" 
              value={data.total_applications} 
              change="-" 
              changeType="neutral"
              icon={Briefcase}
              iconBg="var(--bg-active)"
              iconColor="var(--primary-blue)"
            />
            <StatCard 
              title="Active Apps" 
              value={data.total_applications - data.rejections - data.offers_received} 
              change="-" 
              changeType="neutral"
              icon={Send}
              iconBg="#E6F2FF"
              iconColor="#3B82F6"
            />
            <StatCard 
              title="Interviews" 
              value={data.interviews_scheduled || 0} 
              change="-" 
              changeType="neutral"
              icon={MessageSquare}
              iconBg="#FFF3E0"
              iconColor="#F97316"
            />
            <StatCard 
              title="Offers" 
              value={data.offers_received} 
              change="-" 
              changeType="neutral"
              icon={Award}
              iconBg="var(--success-bg)"
              iconColor="var(--success-green)"
            />
          </div>

          <div className="funnel-section card">
            <div className="card-header">
              <h2 className="card-title">Application Funnel</h2>
            </div>
            {/* For now keeping static child component, ideally pass data as props */}
            <ApplicationFunnel data={data.application_funnel} />
          </div>

          <div className="events-section card">
            <div className="card-header">
              <h2 className="card-title">Upcoming Events</h2>
            </div>
            <UpcomingEvents />
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Platform Success Rate</h2>
            </div>
            <PlatformSuccessRate data={data.platform_success_rate} />
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Weekly Activity</h2>
            </div>
            <WeeklyActivity data={data.weekly_activity} />
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Activities</h2>
            </div>
            <RecentActivities />
          </div>

        </div>
      </main>
    </div>
  );
}
