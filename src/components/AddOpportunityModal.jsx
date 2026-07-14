import React, { useState } from 'react';
import { X } from 'lucide-react';
import apiClient from '../api/client';
import './AddOpportunityModal.css';

export default function AddOpportunityModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    company_name: '',
    role_name: '',
    source_platform: 'LinkedIn',
    source_url: '',
    status: 'Saved'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Create Opportunity
      const oppRes = await apiClient.post('/opportunities/', {
        company_name: formData.company_name,
        role_name: formData.role_name,
        source_platform: formData.source_platform,
        source_url: formData.source_url
      });

      // 2. Create Application linked to Opportunity
      await apiClient.post('/applications/', {
        opportunity_id: oppRes.data.id,
        status: formData.status
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to save application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Application</h2>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input 
              type="text" 
              name="company_name"
              value={formData.company_name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Google"
            />
          </div>

          <div className="form-group">
            <label>Role / Title</label>
            <input 
              type="text" 
              name="role_name"
              value={formData.role_name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Frontend Engineer"
            />
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Saved">Saved</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="form-group half-width">
              <label>Source Platform</label>
              <select name="source_platform" value={formData.source_platform} onChange={handleChange}>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Company Site">Company Site</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Job Posting URL</label>
            <input 
              type="url" 
              name="source_url"
              value={formData.source_url} 
              onChange={handleChange} 
              placeholder="https://..."
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
