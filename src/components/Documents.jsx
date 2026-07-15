import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import AddDocumentModal from './AddDocumentModal';
import apiClient from '../api/client';
import Loader from './Loader';
import '../App.css';
import './Documents.css';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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

  if (loading) {
    return <Loader message="Loading Documents..." />;
  }

  // Fallback data for mockup if empty
  const displayData = documents.length > 0 ? documents : [
    {
      id: 1, title: 'Software_Engineer_Resume_2024.pdf', size: '2.4 MB', 
      document_type: 'Resumes', file_type: 'PDF Document', date: 'Oct 12, 2023', icon: 'picture_as_pdf'
    },
    {
      id: 2, title: 'Cover_Letter_Google_UX.docx', size: '45 KB', 
      document_type: 'Cover Letters', file_type: 'MS Word', date: 'Yesterday, 4:15 PM', icon: 'description'
    },
    {
      id: 3, title: 'Case_Study_Fintech_App.pdf', size: '15.8 MB', 
      document_type: 'Portfolios', file_type: 'PDF Document', date: 'Oct 01, 2023', icon: 'article'
    },
    {
      id: 4, title: 'Product_Manager_Tailored_Resume.docx', size: '128 KB', 
      document_type: 'Resumes', file_type: 'MS Word', date: 'Oct 10, 2023', icon: 'description'
    }
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="documents-container">
          <div className="docs-header">
            <div>
              <h1>Documents</h1>
              <p>Manage your professional assets and application materials.</p>
            </div>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <span className="material-symbols-outlined">upload_file</span> Upload New Document
            </button>
          </div>

          <div className="docs-summary-grid">
            <div className="doc-summary-card">
              <div className="doc-summary-header">
                <span className="material-symbols-outlined doc-folder-icon" style={{color: '#0EA5E9'}}>folder_open</span>
                <span className="doc-count badge-blue">12 Files</span>
              </div>
              <h3>Resumes</h3>
              <p>Master and tailored resumes for specific roles.</p>
            </div>
            
            <div className="doc-summary-card">
              <div className="doc-summary-header">
                <span className="material-symbols-outlined doc-folder-icon" style={{color: '#F59E0B'}}>mail</span>
                <span className="doc-count badge-orange">8 Files</span>
              </div>
              <h3>Cover Letters</h3>
              <p>Personalized outreach and introduction letters.</p>
            </div>
            
            <div className="doc-summary-card">
              <div className="doc-summary-header">
                <span className="material-symbols-outlined doc-folder-icon" style={{color: '#8B5CF6'}}>folder_shared</span>
                <span className="doc-count badge-purple">4 Files</span>
              </div>
              <h3>Portfolios</h3>
              <p>Case studies, project sheets, and design files.</p>
            </div>
          </div>

          <div className="docs-table-container card">
            <div className="docs-table-header">
              <h2>Recent Documents</h2>
              <div className="table-actions">
                <button className="context-btn"><span className="material-symbols-outlined">filter_list</span> Sort</button>
              </div>
            </div>
            
            <table className="docs-table">
              <thead>
                <tr>
                  <th>DOCUMENT NAME</th>
                  <th>CATEGORY</th>
                  <th>TYPE</th>
                  <th>LAST MODIFIED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      <div className="doc-name-cell">
                        <span className="material-symbols-outlined doc-file-icon">{doc.icon || 'description'}</span>
                        <div className="doc-name-info">
                          <span className="doc-name">{doc.title}</span>
                          <span className="doc-size">{doc.size || '1.2 MB'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`doc-category-badge ${doc.document_type === 'Resumes' ? 'badge-blue' : doc.document_type === 'Cover Letters' ? 'badge-orange' : 'badge-purple'}`}>
                        {doc.document_type}
                      </span>
                    </td>
                    <td>{doc.file_type || 'PDF Document'}</td>
                    <td>{doc.date || 'Oct 12, 2023'}</td>
                    <td>
                      <button className="icon-btn-small">
                        <span className="material-symbols-outlined">more_horiz</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="table-footer">
              <span className="showing-text">Showing 4 of 24 documents</span>
              <div className="pagination">
                <button className="icon-btn-small" disabled><span className="material-symbols-outlined">chevron_left</span></button>
                <span>Page 1 of 6</span>
                <button className="icon-btn-small"><span className="material-symbols-outlined">chevron_right</span></button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddDocumentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => { setShowModal(false); fetchDocuments(); }}
      />
    </div>
  );
}
