import { Link } from 'react-router-dom'; // Link is the React version of <a>

function Sidebar({ theme }) {
  return (
    <aside className={`sidebar ${theme}`}> 
      <div className="sidebar-logo">
        <i className="fas fa-user-shield"></i>
        <span>CityCare<span>+</span></span>
      </div>
      <nav className="sidebar-nav">
        {/* Link prevents the whole page from refreshing */}
        <Link to="/admin/overview" className="nav-link"><i className="fas fa-chart-line"></i> Overview</Link>
        <Link to="/admin/users" className="nav-link"><i className="fas fa-users-cog"></i> User Management</Link>
      </nav>
      <div className="sidebar-footer">
        <Link to="/"><i className="fas fa-sign-out-alt"></i> Logout</Link>
      </div>
    </aside>
  );
}