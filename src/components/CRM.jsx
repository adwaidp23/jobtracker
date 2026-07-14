import { useState, useEffect } from 'react';
import { Plus, X, Trash2, Users } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import apiClient from '../api/client';
import '../App.css';
import './Applications.css';
import './CRM.css';

function AddContactModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', company: '', designation: '', email: '', phone: '', linkedin_url: '', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiClient.post('/crm/contacts/', form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add contact.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Contact</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {error && <div className="page-error" style={{ marginBottom: 12 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {[
            { name: 'name', label: 'Full Name', required: true },
            { name: 'company', label: 'Company' },
            { name: 'designation', label: 'Role / Title' },
            { name: 'email', label: 'Email / Referral Email', type: 'email' },
            { name: 'phone', label: 'Phone' },
            { name: 'linkedin_url', label: 'LinkedIn URL' },
          ].map(field => (
            <div key={field.name} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                {field.label}{field.required && ' *'}
              </label>
              <input
                name={field.name}
                type={field.type || 'text'}
                value={form[field.name]}
                onChange={handleChange}
                required={field.required}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 14 }}
              />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 14, resize: 'vertical' }}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CRM() {
  const [contacts, setContacts] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const [contactsRes, referralsRes] = await Promise.all([
        apiClient.get('/crm/contacts/'),
        apiClient.get('/crm/referrals/'),
      ]);
      setContacts(contactsRes.data);
      setReferrals(referralsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Delete this contact?')) return;
    try {
      await apiClient.delete(`/crm/contacts/${contactId}`);
      setContacts(prev => prev.filter(c => c.id !== contactId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete contact.');
    }
  };

  const handleDeleteReferral = async (referralId) => {
    if (!window.confirm('Delete this referral?')) return;
    try {
      await apiClient.delete(`/crm/referrals/${referralId}`);
      setReferrals(prev => prev.filter(r => r.id !== referralId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete referral.');
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="page-header">
          <div>
            <h1>CRM — Contacts & Referrals</h1>
            <p>Manage your professional network and referrals</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Contact
          </button>
        </div>

        {loading ? (
          <div className="page-loading">Loading…</div>
        ) : (
          <div className="crm-grid">
            {/* Contacts */}
            <div className="card">
              <h3 className="section-title">Contacts ({contacts.length})</h3>
              {contacts.length === 0 ? (
                <div className="page-empty" style={{ padding: '30px 0' }}>
                  <Users size={30} opacity={0.3} />
                  <p>No contacts yet. Add your first one!</p>
                </div>
              ) : contacts.map(contact => (
                <div key={contact.id} className="contact-card">
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flex: 1 }}>
                    <div className="contact-avatar">
                      {(contact.name?.[0] ?? '?').toUpperCase()}
                    </div>
                    <div className="contact-info">
                      <h4>{contact.name}</h4>
                      {contact.designation && <p>{contact.designation}{contact.company ? ` @ ${contact.company}` : ''}</p>}
                      {contact.email && <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>}
                      {contact.linkedin_url && (
                        <p><a href={contact.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a></p>
                      )}
                    </div>
                  </div>
                  <button className="delete-btn" onClick={() => handleDeleteContact(contact.id)} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Referrals */}
            <div className="card">
              <h3 className="section-title">Referrals ({referrals.length})</h3>
              {referrals.length === 0 ? (
                <div className="page-empty" style={{ padding: '30px 0' }}>
                  <p>No referrals yet.</p>
                </div>
              ) : referrals.map(referral => (
                <div key={referral.id} className="referral-row">
                  <div>
                    <strong>{referral.contact_name ?? '—'}</strong>
                    <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>
                      for {referral.opportunity_role ?? '—'} @ {referral.company ?? '—'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="referral-status">{referral.status}</span>
                    <button className="delete-btn" onClick={() => handleDeleteReferral(referral.id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <AddContactModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => { setShowModal(false); fetchData(); }}
      />
    </div>
  );
}
