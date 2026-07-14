import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Briefcase, LogOut, Users, FileText } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'applications', label: 'Applications', icon: Briefcase, path: '/applications' },
  { id: 'crm', label: 'CRM', icon: Users, path: '/crm' },
  { id: 'documents', label: 'Documents', icon: FileText, path: '/documents' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Briefcase size={24} color="var(--primary-blue)" />
        </div>
        <span className="logo-text">CareerFlow</span>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map(item => (
            <li key={item.id}>
              <Link 
                to={item.path} 
                className={`nav-item ${location.pathname.startsWith(item.path) && item.path !== '/' || (location.pathname === '/' && item.path === '/') ? 'active' : ''}`}
              >
                <item.icon size={20} className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
