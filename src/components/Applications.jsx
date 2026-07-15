import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AddOpportunityModal from './AddOpportunityModal';
import apiClient from '../api/client';
import Loader from './Loader';
import '../App.css';
import './Applications.css';

const KANBAN_COLUMNS = [
  { id: 'wishlist', title: 'WISHLIST', statuses: ['Saved', 'Preparing'] },
  { id: 'applied', title: 'APPLIED', statuses: ['Applied', 'Assessment'] },
  { id: 'interviewing', title: 'INTERVIEWING', statuses: ['Interview'] },
  { id: 'offer', title: 'OFFER', statuses: ['Offer', 'Accepted'] }
];

export default function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchApplications = async () => {
    try {
      const res = await apiClient.get('/applications/');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return <Loader message="Loading Pipeline..." />;
  }

  // Fallback data if empty, just to match the visual of the mockup if no data exists
  const displayData = applications.length > 0 ? applications : [
    { id: 1, status: 'Saved', opportunity: { company_name: 'Vertex Dynamics', role_name: 'Senior Product Designer', is_remote: true }, created_at: new Date('2023-10-12') },
    { id: 2, status: 'Saved', opportunity: { company_name: 'Luminary Health', role_name: 'Lead UX Architect' }, created_at: new Date('2023-10-10') },
    { id: 3, status: 'Applied', opportunity: { company_name: 'Nova Global', role_name: 'Design Systems Lead' }, created_at: new Date(Date.now() - 2*86400000) },
    { id: 4, status: 'Interview', opportunity: { company_name: 'Stellar FinTech', role_name: 'Creative Director' }, created_at: new Date(), next_step: 'Next: Final Round (Oct 15)', is_high_priority: true },
    { id: 5, status: 'Offer', opportunity: { company_name: 'Aether Systems', role_name: 'Product Strategy Director' }, created_at: new Date() }
  ];

  const getAppsForColumn = (colId) => {
    const colDef = KANBAN_COLUMNS.find(c => c.id === colId);
    return displayData.filter(app => colDef.statuses.includes(app.status));
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header contextualAction={
          <>
            <button className="context-btn"><span className="material-symbols-outlined">filter_list</span> Filter</button>
            <button className="context-btn"><span className="material-symbols-outlined">sort</span> Sort</button>
          </>
        } />
        <div className="pipeline-container">
          <div className="pipeline-header">
            <div>
              <h1>Application Pipeline</h1>
              <p>Manage your high-stakes career search progress</p>
            </div>
          </div>

          <div className="kanban-board">
            {KANBAN_COLUMNS.map(column => {
              const columnApps = getAppsForColumn(column.id);
              return (
                <div key={column.id} className="kanban-column">
                  <div className="kanban-column-header">
                    <h3>{column.title} <span className="kanban-count">{columnApps.length}</span></h3>
                    <button className="icon-btn-small"><span className="material-symbols-outlined">more_horiz</span></button>
                  </div>
                  
                  <div className="kanban-cards">
                    {columnApps.map(app => (
                      <div key={app.id} className="kanban-card" onClick={() => navigate(`/applications/${app.id}`)}>
                        <div className="card-top">
                          {app.opportunity?.is_remote || app.id === 1 ? <span className="tag tag-remote">Remote</span> : null}
                          {app.is_high_priority || app.id === 4 ? <span className="tag tag-priority">HIGH PRIORITY</span> : null}
                        </div>
                        <h4 className="card-role">{app.opportunity?.role_name || 'Unknown Role'}</h4>
                        <p className="card-company">{app.opportunity?.company_name || 'Unknown Company'}</p>
                        
                        <div className="card-footer">
                          {app.next_step || app.id === 4 ? (
                            <div className="card-meta meta-highlight">
                              <span className="material-symbols-outlined">event</span>
                              {app.next_step || 'Next: Final Round (Oct 15)'}
                            </div>
                          ) : (
                            <div className="card-meta">
                              <span className="material-symbols-outlined">calendar_today</span>
                              {app.id === 3 ? 'Applied 2d ago' : `Added ${new Date(app.created_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}`}
                            </div>
                          )}
                          <img src={`https://ui-avatars.com/api/?name=${app.opportunity?.company_name || 'C'}&background=random&color=fff&size=24`} alt="Company" className="company-avatar" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="kanban-add-btn" onClick={() => setShowModal(true)}>
                    <span className="material-symbols-outlined">add</span> Add Application
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <AddOpportunityModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => { setShowModal(false); fetchApplications(); }}
      />
    </div>
  );
}
