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
    <div>
      <h1>{isEdit ? 'Edit user' : 'New user'}</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && <div style={{ color: '#c00' }}>{error}</div>}
        <label style={labelStyle}>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Password {isEdit && '(leave blank to keep current)'}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!isEdit}
            minLength={6}
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Role
          <select value={roleId} onChange={(e) => setRoleId(Number(e.target.value))} style={inputStyle}>
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button type="submit" disabled={submitting} style={submitStyle}>
            {submitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <Link to="/users" style={cancelStyle}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}

const labelStyle = { display: 'flex', flexDirection: 'column', gap: '0.25rem', fontWeight: 500 };
const inputStyle = { padding: '0.5rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: 4 };
const submitStyle = { padding: '0.6rem 1rem', cursor: 'pointer', background: '#333', color: '#fff', border: 'none', borderRadius: 4 };
const cancelStyle = { padding: '0.6rem 1rem', color: '#666' };
