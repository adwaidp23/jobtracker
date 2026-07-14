import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import AddOpportunityModal from './AddOpportunityModal';
import apiClient from '../api/client';
import '../App.css';
import './Applications.css';

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
  Archived: { color: '#94A3B8', bg: '#F8FAFC' },
};

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.Saved;
  return (
    <span className="status-badge" style={{ background: colors.bg, color: colors.color }}>
      {status}
    </span>
  );
}

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

  useEffect(() => { fetchApplications(); }, []);

  const handleDelete = async (e, appId) => {
    e.stopPropagation(); // Prevent row click navigation
    if (!window.confirm('Delete this application and all its history?')) return;
    try {
      await apiClient.delete(`/opportunities/${applications.find(a => a.id === appId)?.opportunity?.id}`);
      setApplications(prev => prev.filter(a => a.id !== appId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete application.');
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="page-header">
          <div>
            <h1>Applications</h1>
            <p>Track and manage all your job applications</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Application
          </button>
        </div>

        <div className="card">
          {loading && <div className="page-loading">Loading applications…</div>}
          {error && <div className="page-error">{error}</div>}
          {!loading && !error && applications.length === 0 && (
            <div className="page-empty">
              <Briefcase size={40} opacity={0.3} />
              <h3>No applications yet</h3>
              <p>Click "Add Application" to track your first job opportunity.</p>
            </div>
          )}
          {!loading && !error && applications.length > 0 && (
            <div className="app-table-wrapper">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Company / Role</th>
                    <th>Status</th>
                    <th>Platform</th>
                    <th>Date Added</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id} onClick={() => navigate(`/applications/${app.id}`)}>
                      <td>
                        <div className="company-name">{app.opportunity?.company_name ?? '—'}</div>
                        <div className="role-name">{app.opportunity?.role_name ?? '—'}</div>
                      </td>
                      <td><StatusBadge status={app.status} /></td>
                      <td>{app.opportunity?.source_platform ?? '—'}</td>
                      <td>{new Date(app.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="delete-btn"
                          title="Delete"
                          onClick={(e) => handleDelete(e, app.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
