import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getUsers, deleteUser } from '../api/users.js';

export function UserList() {
  const [data, setData] = useState({ users: [], pagination: {} });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getUsers({ page, limit: 10 })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error || 'Failed to load users');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [page]);

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Delete user ${email}?`)) return;
    try {
      await deleteUser(id);
      setData((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u.id !== id),
        pagination: { ...prev.pagination, total: (prev.pagination?.total ?? 1) - 1 },
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  const totalPages = data.pagination?.totalPages ?? 1;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Users</h1>
        {isAdmin && (
          <Link to="/users/new" style={buttonLinkStyle}>Add user</Link>
        )}
      </div>
      {error && <div style={{ color: '#c00', marginBottom: '0.5rem' }}>{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Role</th>
                {isAdmin && <th style={thStyle}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u.id}>
                  <td style={tdStyle}>{u.id}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.name || '—'}</td>
                  <td style={tdStyle}>{u.role}</td>
                  {isAdmin && (
                    <td style={tdStyle}>
                      <Link to={`/users/${u.id}/edit`} style={linkStyle}>Edit</Link>
                      {' · '}
                      <button type="button" onClick={() => handleDelete(u.id, u.email)} style={textButtonStyle}>
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={pageBtnStyle}>
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} style={pageBtnStyle}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '0.5rem', borderBottom: '1px solid #eee' };
const linkStyle = { color: '#333' };
const textButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#c00', textDecoration: 'underline' };
const buttonLinkStyle = { padding: '0.5rem 1rem', background: '#333', color: '#fff', textDecoration: 'none', borderRadius: 4 };
const pageBtnStyle = { padding: '0.4rem 0.75rem', cursor: 'pointer' };
