import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={containerStyle}>
        <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-8)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Password reset</h1>
            <div style={successStyle}>
              Your password has been reset successfully. Redirecting you to login...
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary)' }}>
              Go to login now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-8)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Reset password</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Please enter your new password below.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          {error && <div style={errorStyle}>{error}</div>}

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>New password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Confirm new password</label>
            <input
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={submitStyle}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
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
  textAlign: 'center',
  marginTop: '1rem'
};
