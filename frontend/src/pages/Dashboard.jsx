import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Welcome back, {user?.name || user?.email}.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
        <div className="card" style={statCardStyle}>
          <div style={statLabelStyle}>Current Role</div>
          <div style={statValueStyle}>{user?.role}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--success)', marginTop: '0.5rem', fontWeight: 500 }}>
            Active Session
          </div>
        </div>
        <div className="card" style={statCardStyle}>
          <div style={statLabelStyle}>Status</div>
          <div style={statValueStyle}>Online</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            All systems operational
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <Link to="/users" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

const statCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const statLabelStyle = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const statValueStyle = {
  fontSize: '2rem',
  fontWeight: 700,
  color: 'var(--text-main)',
  marginTop: '0.25rem',
  textTransform: 'capitalize',
};
