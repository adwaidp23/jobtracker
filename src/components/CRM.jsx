import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import AddContactModal from './AddContactModal';
import apiClient from '../api/client';
import Loader from './Loader';
import '../App.css';
import './CRM.css';

export default function CRM() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const contactsRes = await apiClient.get('/crm/contacts/');
      setContacts(contactsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return <Loader message="Loading Network..." />;
  }

  // Fallback data for mockup if empty
  const displayData = contacts.length > 0 ? contacts : [
    {
      id: 1, name: 'Sarah Jenkins', designation: 'Tech Recruiter', company: 'Google', 
      tags: [{label: 'Recruiter', type: 'default'}, {label: 'In Review', type: 'info'}],
      lastContacted: '2 days ago', strength: 4, actionText: 'Log Interaction'
    },
    {
      id: 2, name: 'Marcus Chen', designation: 'Senior PM', company: 'Stripe',
      tags: [{label: 'Referral', type: 'info'}, {label: 'Follow-up Needed', type: 'warning'}],
      lastContacted: '14 days ago', strength: 3, actionText: 'Send Message'
    },
    {
      id: 3, name: 'Elena Rodriguez', designation: 'Design Lead', company: 'Meta',
      tags: [{label: 'Peer', type: 'default'}, {label: 'Mentor', type: 'info'}],
      lastContacted: '5 days ago', strength: 5, actionText: 'View Profile'
    },
    {
      id: 4, name: 'David Wilson', designation: 'Partner', company: 'Sequoia',
      tags: [{label: 'Recruiter', type: 'default'}],
      lastContacted: 'Yesterday', strength: 2, actionText: 'Log Interaction'
    }
  ];

  const renderDots = (strength) => {
    return (
      <div className="strength-dots">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`dot ${i <= strength ? 'active' : ''}`}></div>
        ))}
      </div>
    );
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header contextualAction={
          <div className="header-status">
            Status: <span style={{color: 'var(--text-primary)', marginLeft: 4}}>Active Job Hunt</span>
          </div>
        } />
        <div className="crm-container">
          <div className="crm-header">
            <div>
              <h1>Networking Hub</h1>
              <p>Manage your professional ecosystem and nurture high-value relationships.</p>
            </div>
            <div className="header-actions-right">
              <button className="context-btn"><span className="material-symbols-outlined">filter_list</span> Filters</button>
              <button className="btn-primary" onClick={() => setShowModal(true)}>
                <span className="material-symbols-outlined">person_add</span> Add New Contact
              </button>
            </div>
          </div>

          <div className="crm-stats-grid">
            <div className="crm-stat-card">
              <p className="stat-label">Total Network</p>
              <div className="stat-value-group">
                <h3>124</h3>
                <span className="stat-change">+5 this week</span>
              </div>
            </div>
            <div className="crm-stat-card">
              <p className="stat-label">High-impact Leads</p>
              <div className="stat-value-group">
                <h3>18</h3>
                <span className="stat-desc">recruiters/referrals</span>
              </div>
            </div>
            <div className="crm-stat-card">
              <p className="stat-label">Avg. Contact Interval</p>
              <div className="stat-value-group">
                <h3>12</h3>
                <span className="stat-desc">Days</span>
              </div>
            </div>
            <div className="crm-stat-card border-warning">
              <p className="stat-label">Follow-ups Due</p>
              <div className="stat-value-group">
                <h3 className="text-warning">7</h3>
                <span className="stat-desc text-warning">Action Required</span>
              </div>
            </div>
          </div>

          <div className="contacts-grid">
            {displayData.map(contact => (
              <div key={contact.id} className="contact-card">
                <div className="contact-card-header">
                  <div className="contact-avatar">
                    <img src={`https://ui-avatars.com/api/?name=${contact.name}&background=random&color=fff`} alt={contact.name} />
                  </div>
                  <div className="contact-info">
                    <h4>{contact.name}</h4>
                    <p>{contact.designation} @ {contact.company}</p>
                  </div>
                </div>
                
                <div className="contact-tags">
                  {contact.tags?.map((tag, idx) => (
                    <span key={idx} className={`tag tag-${tag.type}`}>{tag.label}</span>
                  ))}
                </div>
                
                <div className="contact-meta">
                  <div className="meta-col">
                    <span className="meta-label">Last Contacted</span>
                    <span className="meta-val">{contact.lastContacted || 'Never'}</span>
                  </div>
                  <div className="meta-col">
                    <span className="meta-label">Relationship Strength</span>
                    {renderDots(contact.strength || 1)}
                  </div>
                </div>
                
                <button className={`contact-action-btn ${contact.actionText === 'Send Message' ? 'btn-teal' : 'btn-outline'}`}>
                  {contact.actionText || 'Log Interaction'}
                </button>
              </div>
            ))}

            <div className="add-contact-card" onClick={() => setShowModal(true)}>
              <div className="add-contact-icon">
                <span className="material-symbols-outlined">add</span>
              </div>
              <h4>Add New Contact</h4>
              <p>Expand your network</p>
            </div>
          </div>
        </div>
      </main>

      {/* Moved AddContactModal into a separate file conceptually, or inline here */}
      <AddContactModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => { setShowModal(false); fetchData(); }}
      />
    </div>
  );
}
