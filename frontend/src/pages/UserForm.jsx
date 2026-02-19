import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getUser, createUser, updateUser } from '../api/users.js';

const ROLE_OPTIONS = [
  { value: 1, label: 'Admin' },
  { value: 2, label: 'Viewer' },
];

export function UserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [roleId, setRoleId] = useState(2);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    getUser(id)
      .then(({ user }) => {
        setEmail(user.email || '');
        setName(user.name || '');
        setRoleId(user.roleId ?? 2);
      })
      .catch((err) => setError(err.response?.data?.error || 'Failed to load user'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isEdit) {
        const body = { email: email.trim(), name: name.trim() || undefined, roleId: Number(roleId) };
        if (password.trim()) body.password = password;
        await updateUser(id, body);
        navigate('/users');
      } else {
        await createUser({
          email: email.trim(),
          password: password.trim(),
          name: name.trim() || undefined,
          roleId: Number(roleId),
        });
        navigate('/users');
      }
    } catch (err) {
      setError(err.response?.data?.error || (isEdit ? 'Update failed' : 'Create failed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
          {isEdit ? 'Edit User' : 'New User'}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          {isEdit ? 'Update existing user profile' : 'Create a new user in the system'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {error && (
          <div style={{ padding: '0.75rem', background: '#fee2e2', color: 'var(--error)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}
        
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Email Address</label>
          <input 
            type="email" 
            className="input"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="email@example.com"
          />
        </div>

        <div style={fieldGroupStyle}>
          <label style={labelStyle}>
            Password {isEdit && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Optional)</span>}
          </label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!isEdit}
            minLength={6}
            placeholder={isEdit ? '••••••••' : 'Enter strong password'}
          />
        </div>

        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Full Name</label>
          <input 
            type="text" 
            className="input"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="John Doe"
          />
        </div>

        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Role Assignment</label>
          <select 
            className="input" 
            value={roleId} 
            onChange={(e) => setRoleId(Number(e.target.value))}
            style={{ appearance: 'none', background: 'white url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E") no-repeat right 0.75rem center / 1rem' }}
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>
            {submitting ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
          </button>
          <Link to="/users" className="btn" style={cancelButtonStyle}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

const fieldGroupStyle = { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' };
const labelStyle = { fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' };
const cancelButtonStyle = { 
  background: 'transparent', 
  border: '1px solid var(--border)',
  color: 'var(--text-muted)',
};

// End of file
