import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import AddOpportunityModal from './AddOpportunityModal';
import './Header.css';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="top-header">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Search applications, contacts, or jobs..." />
        </div>
        
        <div className="header-actions">
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            <span>Add Application</span>
          </button>
          
          <div className="profile-btn">
            <img src="https://ui-avatars.com/api/?name=User&background=3B82F6&color=fff" alt="Profile" />
          </div>
        </div>
      </header>

      <AddOpportunityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => window.location.reload()} 
      />
    </>
  );
}
