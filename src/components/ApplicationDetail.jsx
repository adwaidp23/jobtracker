import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, ExternalLink, Calendar, Briefcase } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import apiClient from '../api/client';
import '../App.css';
import './Applications.css';
import './ApplicationDetail.css';

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

const OUTCOME_COLORS = {
  Pending: '#64748B', Passed: '#05CD99', Failed: '#EE5D50', Cancelled: '#94A3B8',
};

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await apiClient.get(`/applications/${id}`);
        setApp(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.status === 404 ? 'Application not found.' : 'Failed to load application.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />

        <button className="detail-back-btn" onClick={() => navigate('/applications')}>
          <ArrowLeft size={16} /> Back to Applications
        </button>

        {loading && <div className="page-loading">Loading application details…</div>}
        {error && <div className="page-error">{error}</div>}

        {!loading && !error && app && (
          <>
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="detail-hero">
                <div className="detail-hero-info">
                  <h2>{app.opportunity?.company_name ?? 'Unknown Company'}</h2>
                  <p className="role">{app.opportunity?.role_name ?? 'Unknown Role'}</p>
                  <div className="detail-meta">
                    {app.opportunity?.location && (
                      <span className="detail-meta-item">
                        <MapPin size={13} /> {app.opportunity.location}
                      </span>
                    )}
                    {app.opportunity?.salary_range && (
                      <span className="detail-meta-item">
                        <DollarSign size={13} /> {app.opportunity.salary_range}
                      </span>
                    )}
                    {app.opportunity?.job_type && (
                      <span className="detail-meta-item">
                        <Briefcase size={13} /> {app.opportunity.job_type}
                        {app.opportunity.work_mode ? ` · ${app.opportunity.work_mode}` : ''}
                      </span>
                    )}
                    {app.opportunity?.source_platform && (
                      <span className="detail-meta-item">
                        <Calendar size={13} /> {app.opportunity.source_platform}
                      </span>
                    )}
                    {app.opportunity?.source_url && (
                      <span className="detail-meta-item">
                        <a href={app.opportunity.source_url} target="_blank" rel="noreferrer">
                          <ExternalLink size={13} /> View Job Posting
                        </a>
                      </span>
                    )}
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>

              {app.opportunity?.job_description && (
                <>
                  <h3 className="section-title">Job Description</h3>
                  <p className="detail-jd">{app.opportunity.job_description}</p>
                </>
              )}
            </div>

            <div className="detail-grid">
              {/* Left column: History + Interview Rounds + Assessments */}
              <div>
                {/* Interview Rounds */}
                <div className="card" style={{ marginBottom: 24 }}>
                  <h3 className="section-title">Interview Rounds</h3>
                  {app.interview_rounds?.length > 0 ? app.interview_rounds.map(round => (
                    <div key={round.id} className="round-card">
                      <h4>{round.round_name}</h4>
                      <p className="round-meta">
                        {round.interview_date
                          ? new Date(round.interview_date).toLocaleString()
                          : 'No date set'}
                        {round.interviewer_names ? ` · ${round.interviewer_names}` : ''}
                        {' · '}
                        <span style={{ color: OUTCOME_COLORS[round.outcome], fontWeight: 600 }}>
                          {round.outcome}
                        </span>
                      </p>
                      {round.feedback && (
                        <p className="round-feedback">{round.feedback}</p>
                      )}
                    </div>
                  )) : <p className="empty-section">No interview rounds yet.</p>}
                </div>

                {/* Assessments */}
                <div className="card">
                  <h3 className="section-title">Assessments</h3>
                  {app.assessments?.length > 0 ? app.assessments.map(assessment => (
                    <div key={assessment.id} className="round-card">
                      <h4>{assessment.assessment_type}</h4>
                      <p className="round-meta">
                        {assessment.due_date
                          ? `Due: ${new Date(assessment.due_date).toLocaleDateString()}`
                          : 'No due date'}
                        {assessment.score != null ? ` · Score: ${assessment.score}` : ''}
                        {' · '}
                        <span style={{ fontWeight: 600 }}>{assessment.status}</span>
                      </p>
                      {assessment.feedback && (
                        <p className="round-feedback">{assessment.feedback}</p>
                      )}
                    </div>
                  )) : <p className="empty-section">No assessments yet.</p>}
                </div>
              </div>

              {/* Right column: Status History */}
              <div className="card">
                <h3 className="section-title">Status History</h3>
                {app.history?.length > 0 ? (
                  <div className="history-list">
                    {app.history.map((entry, idx) => (
                      <div key={`${entry.timestamp}-${idx}`} className="history-item">
                        <div className="history-dot-col">
                          <div className="history-dot" />
                          {idx < app.history.length - 1 && <div className="history-line" />}
                        </div>
                        <div className="history-content">
                          <p>
                            {entry.old_status
                              ? `${entry.old_status} → ${entry.new_status}`
                              : entry.new_status}
                          </p>
                          {entry.reason && <p style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{entry.reason}</p>}
                          <small>{new Date(entry.timestamp).toLocaleString()}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-section">No history recorded.</p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
