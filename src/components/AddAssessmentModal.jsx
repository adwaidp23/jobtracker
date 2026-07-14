import { useState } from 'react';
import { X } from 'lucide-react';
import apiClient from '../api/client';

export default function AddAssessmentModal({ isOpen, onClose, onSuccess, applicationId }) {
  const [form, setForm] = useState({ assessment_type: '', due_date: '', status: 'Pending' });
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
      assessment_type: form.assessment_type,
      status: form.status
    };
    if (form.due_date) payload.due_date = new Date(form.due_date).toISOString();

    try {
      await apiClient.post('/interviews/assessments/', payload);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add assessment.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Assessment</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {error && <div className="page-error" style={{ marginBottom: 12 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Assessment Type *</label>
            <input
              name="assessment_type"
              value={form.assessment_type}
              onChange={handleChange}
              required
              placeholder="e.g. Take-home Coding Challenge"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 14 }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Due Date</label>
            <input
              name="due_date"
              type="date"
              value={form.due_date}
              onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 14 }}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Add Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
