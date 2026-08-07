import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <Link to="/dashboard" className="sidebar__brand">WalletSystem</Link>
      </div>

      <nav className="sidebar__nav">
        {user.role !== 'ADMIN' && (
          <>
            <Link 
              to="/dashboard" 
              className={`sidebar__link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/wallet" 
              className={`sidebar__link ${location.pathname === '/wallet' ? 'active' : ''}`}
            >
              My Wallet
            </Link>
            <Link 
              to="/deposit" 
              className={`sidebar__link ${location.pathname === '/deposit' ? 'active' : ''}`}
            >
              Add Money
            </Link>
            <Link 
              to="/transfer" 
              className={`sidebar__link ${location.pathname === '/transfer' ? 'active' : ''}`}
            >
              Transfer
            </Link>
            <Link 
              to="/history" 
              className={`sidebar__link ${location.pathname === '/history' ? 'active' : ''}`}
            >
              History
            </Link>
          </>
        )}
        
        {user.role === 'ADMIN' && (
          <Link 
            to="/admin" 
            className={`sidebar__link ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            Admin Panel
          </Link>
        )}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__user-name">{user.name}</div>
          <div className="sidebar__user-role">{user.role}</div>
        </div>
        <button onClick={handleLogout} className="sidebar__logout">
          Sign out
        </button>
      </div>
    </aside>
  );
}
