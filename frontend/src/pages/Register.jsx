import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { register as apiRegister } from '../api/auth.js';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { token, user: userData } = await apiRegister(name.trim(), email.trim(), password);
      login(token, userData);
      navigate('/', { replace: true });
    } catch (err) {
      const errorData = err.response?.data?.error || 'Registration failed';
      setError(typeof errorData === 'object' ? (errorData.message || JSON.stringify(errorData)) : errorData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-8)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          {error && <div style={errorStyle}>{error}</div>}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              placeholder="John Doe"
            />
          </div>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="name@company.com"
            />
          </div>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn btn-primary" style={submitStyle}>
            {submitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

const containerStyle = { 
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--space-4)',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' };
const fieldGroupStyle = { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' };
const labelStyle = { fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' };
const submitStyle = { width: '100%', padding: '0.75rem', marginTop: 'var(--space-2)' };
const errorStyle = { 
  padding: '0.75rem', 
  background: '#fee2e2', 
  color: 'var(--error)', 
  borderRadius: 'var(--radius-md)',
  fontSize: '0.875rem',
  textAlign: 'center'
};
