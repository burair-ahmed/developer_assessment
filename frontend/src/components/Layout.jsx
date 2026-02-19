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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          <Link to="/" style={logoStyle}>CMS Admin</Link>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <Link to="/" style={linkStyle}>Dashboard</Link>
            <Link to="/users" style={linkStyle}>Users</Link>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <div style={{ textAlign: 'right', display: 'none', sm: 'block' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name || user?.email}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
          <button type="button" onClick={handleLogout} className="btn" style={logoutButtonStyle}>
            Logout
          </button>
        </div>
      </nav>
      <main style={mainStyle}>
        <div style={contentWrapperStyle}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 2rem',
  height: '64px',
  backgroundColor: 'var(--bg-card)',
  borderBottom: '1px solid var(--border)',
  boxShadow: 'var(--shadow-sm)',
  position: 'sticky',
  top: 0,
  zIndex: 10,
};

const logoStyle = {
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: 'var(--primary)',
  marginRight: '1rem',
};

const linkStyle = {
  color: 'var(--text-muted)',
  fontSize: '0.9375rem',
  fontWeight: 500,
  padding: '0.5rem 0.75rem',
  borderRadius: 'var(--radius-md)',
  transition: 'all 0.15s ease',
};

const logoutButtonStyle = {
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  color: 'var(--text-main)',
  background: 'transparent',
  border: '1px solid var(--border)',
};

const mainStyle = {
  flex: 1,
  padding: '2rem',
};

const contentWrapperStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
};
