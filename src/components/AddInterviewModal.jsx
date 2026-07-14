import { useState } from 'react';
import { X } from 'lucide-react';
import apiClient from '../api/client';

export default function AddInterviewModal({ isOpen, onClose, onSuccess, applicationId }) {
  const [form, setForm] = useState({ round_name: '', interview_date: '', interviewer_names: '', outcome: 'Pending' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    // Format payload
    const payload = {
      application_id: applicationId,
      round_name: form.round_name,
      outcome: form.outcome
    };
    if (form.interview_date) payload.interview_date = new Date(form.interview_date).toISOString();
    if (form.interviewer_names) payload.interviewer_names = form.interviewer_names;

    try {
      await apiClient.post('/interviews/rounds/', payload);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add interview round.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Interview Round</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {error && <div className="page-error" style={{ marginBottom: 12 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Round Name *</label>
            <input
              name="round_name"
              value={form.round_name}
              onChange={handleChange}
              required
              placeholder="e.g. Technical Screen, Onsite"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 14 }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Interview Date & Time</label>
            <input
              name="interview_date"
              type="datetime-local"
              value={form.interview_date}
              onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 14 }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Interviewer(s)</label>
            <input
              name="interviewer_names"
              value={form.interviewer_names}
              onChange={handleChange}
              placeholder="e.g. Jane Doe"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 14 }}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Add Round'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
