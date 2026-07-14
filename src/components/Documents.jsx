import { useState, useEffect } from 'react';
import { Plus, X, Trash2, FileText } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import apiClient from '../api/client';
import '../App.css';
import './Applications.css';
import './Documents.css';

function AddDocumentModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({ title: '', document_type: 'Resume' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiClient.post('/documents/', form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add document.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Document Entry</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {error && <div className="page-error" style={{ marginBottom: 12 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Software Engineer Resume 2024"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 14 }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Document Type</label>
            <select
              name="document_type"
              value={form.document_type}
              onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 14 }}
            >
              <option value="Resume">Resume</option>
              <option value="Cover Letter">Cover Letter</option>
              <option value="Offer Letter">Offer Letter</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Add Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newVersionUrl, setNewVersionUrl] = useState({}); // doc_id -> url

  const fetchDocuments = async () => {
    try {
      const res = await apiClient.get('/documents/');
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Delete this document entry and all its versions?')) return;
    try {
      await apiClient.delete(`/documents/${docId}`);
      setDocuments(prev => prev.filter(d => d.id !== docId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete document.');
    }
  };

  const handleAddVersion = async (docId) => {
    const url = newVersionUrl[docId];
    if (!url) return;
    try {
      const currentDoc = documents.find(d => d.id === docId);
      const nextVersionNum = (currentDoc.resume_versions?.length || 0) + 1;
      
      const res = await apiClient.post(`/documents/${docId}/versions/`, {
        version_number: nextVersionNum,
        file_url: url
      });
      
      setDocuments(prev => prev.map(d => {
        if (d.id === docId) {
          return { ...d, resume_versions: [res.data, ...(d.resume_versions || [])] };
        }
        return d;
      }));
      setNewVersionUrl({ ...newVersionUrl, [docId]: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to add version.');
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="page-header">
          <div>
            <h1>Documents</h1>
            <p>Manage your resumes, cover letters, and track document versions (URL-based)</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Document
          </button>
        </div>

        {loading ? (
          <div className="page-loading">Loading…</div>
        ) : documents.length === 0 ? (
          <div className="card page-empty">
            <FileText size={40} opacity={0.3} />
            <h3>No documents found</h3>
            <p>Add a document entry to start tracking your resume links.</p>
          </div>
        ) : (
          <div className="documents-grid">
            {documents.map(doc => (
              <div key={doc.id} className="doc-card card">
                <div className="doc-card-header">
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div className="doc-icon"><FileText size={20} /></div>
                    <div>
                      <div className="doc-title">{doc.title}</div>
                      <div className="doc-type">{doc.document_type}</div>
                    </div>
                  </div>
                  <button className="delete-btn" onClick={() => handleDeleteDocument(doc.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="doc-versions">
                  {doc.resume_versions?.map(v => (
                    <div key={v.id} className="doc-version-row">
                      <span>v{v.version_number} — {new Date(v.upload_date).toLocaleDateString()}</span>
                      <a href={v.file_url} target="_blank" rel="noreferrer">View File</a>
                    </div>
                  ))}
                  
                  <div className="add-version-input">
                    <input 
                      placeholder="Paste document URL..." 
                      value={newVersionUrl[doc.id] || ''}
                      onChange={e => setNewVersionUrl({...newVersionUrl, [doc.id]: e.target.value})}
                    />
                    <button className="btn-tiny" onClick={() => handleAddVersion(doc.id)} disabled={!newVersionUrl[doc.id]}>
                      Add Link
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AddDocumentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => { setShowModal(false); fetchDocuments(); }}
      />
    </div>
  );
}
