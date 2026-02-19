import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p style={{ color: '#666', marginTop: '0.5rem' }}>
        Welcome, {user?.name || user?.email}. You are logged in as <strong>{user?.role}</strong>.
      </p>
      <p style={{ marginTop: '1rem' }}>
        <Link to="/users" style={{ color: '#333' }}>View users</Link>
      </p>
    </div>
  );
}
