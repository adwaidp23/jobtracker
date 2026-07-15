import './Header.css';

export default function Header({ contextualAction }) {
  return (
    <header className="top-header">
      <div className="search-bar">
        <span className="material-symbols-outlined search-icon">search</span>
        <input type="text" placeholder="Search applications, companies, or tasks..." />
      </div>
      
      <div className="header-actions">
        <button className="icon-btn" title="Notifications">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="icon-btn" title="Help">
          <span className="material-symbols-outlined">help</span>
        </button>
        
        {contextualAction && (
          <div className="contextual-action">
            {contextualAction}
          </div>
        )}
      </div>
    </header>
  );
}
