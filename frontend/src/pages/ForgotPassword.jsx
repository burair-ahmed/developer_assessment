import { useState } from 'react';
import { Link } from 'react-router-dom';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-8)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Forgot password</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Enter your email to receive a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          {message && <div style={successStyle}>{message}</div>}
          {error && <div style={errorStyle}>{error}</div>}
          
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

          <button type="submit" disabled={loading} className="btn btn-primary" style={submitStyle}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Remember your password?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            Back to login
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
const successStyle = {
  padding: '0.75rem',
  background: '#dcfce7',
  color: 'var(--success)',
  borderRadius: 'var(--radius-md)',
  fontSize: '0.875rem',
  textAlign: 'center'
};
