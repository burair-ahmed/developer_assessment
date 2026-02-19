import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={navStyle}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/" style={linkStyle}>Dashboard</Link>
          <Link to="/users" style={linkStyle}>Users</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#888', fontSize: '0.9rem' }}>
            {user?.email} ({user?.role})
          </span>
          <button type="button" onClick={handleLogout} style={buttonStyle}>Logout</button>
        </div>
      </nav>
      <main style={{ flex: 1, padding: '1.5rem', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
}

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem 1.5rem',
  borderBottom: '1px solid #ddd',
  backgroundColor: '#f8f9fa',
};

const linkStyle = { color: '#333', textDecoration: 'none', fontWeight: 500 };
const buttonStyle = {
  padding: '0.4rem 0.75rem',
  cursor: 'pointer',
  border: '1px solid #ccc',
  borderRadius: 4,
  background: '#fff',
};
