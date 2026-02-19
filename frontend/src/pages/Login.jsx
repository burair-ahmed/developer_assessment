import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { login as apiLogin } from '../api/auth.js';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { token, user: userData } = await apiLogin(email.trim(), password);
      login(token, userData);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '1rem' }}>Login</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        {error && <div style={errorStyle}>{error}</div>}
        <label style={labelStyle}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={inputStyle}
          />
        </label>
        <button type="submit" disabled={submitting} style={submitStyle}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

const containerStyle = { maxWidth: 360, margin: '2rem auto', padding: '1rem' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };
const labelStyle = { display: 'flex', flexDirection: 'column', gap: '0.25rem', fontWeight: 500 };
const inputStyle = { padding: '0.5rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: 4 };
const submitStyle = {
  padding: '0.6rem 1rem',
  fontSize: '1rem',
  cursor: 'pointer',
  background: '#333',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  marginTop: '0.5rem',
};
const errorStyle = { color: '#c00', fontSize: '0.9rem' };
