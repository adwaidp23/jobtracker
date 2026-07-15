import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/' },
  { id: 'applications', label: 'Applications', icon: 'work', path: '/applications' },
  { id: 'crm', label: 'CRM', icon: 'contact_page', path: '/crm' },
  { id: 'documents', label: 'Documents', icon: 'description', path: '/documents' },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-text-container">
          <span className="logo-title">CareerArch</span>
          <span className="logo-subtitle">Professional Suite</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map(item => (
            <li key={item.id}>
              <Link 
                to={item.path} 
                className={`nav-item ${location.pathname.startsWith(item.path) && item.path !== '/' || (location.pathname === '/' && item.path === '/') ? 'active' : ''}`}
              >
                <span className="material-symbols-outlined nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="add-app-btn">
          <span className="material-symbols-outlined">add</span>
          <span>Add New<br/>Application</span>
        </button>
        
        <div className="user-profile-widget">
          <div className="user-avatar">
            <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0F766E&color=fff`} alt="Profile" />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Alex Thompson'}</span>
            <span className="user-status">Premium Member</span>
          </div>
          <button className="logout-btn-small" onClick={logout} title="Logout">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
