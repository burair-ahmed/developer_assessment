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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Users</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Manage and monitor application users</p>
        </div>
        {isAdmin && (
          <Link to="/users/new" className="btn btn-primary">
            <span style={{ marginRight: '0.5rem' }}>+</span> Add User
          </Link>
        )}
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: 'var(--error)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading users...
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Role</th>
                    {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>#{u.id}</td>
                      <td style={{ fontWeight: 500 }}>{u.email}</td>
                      <td>{u.name || <span style={{ color: '#ccc' }}>—</span>}</td>
                      <td>
                        <span style={roleBadgeStyle(u.role)}>
                          {u.role}
                        </span>
                      </td>
                      {isAdmin && (
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
                            <Link to={`/users/${u.id}/edit`} style={actionIconStyle}>
                              Edit
                            </Link>
                            <button type="button" onClick={() => handleDelete(u.id, u.email)} style={deleteButtonStyle}>
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div style={paginationWrapperStyle}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Page <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{page}</span> of {totalPages}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn" style={pageBtnStyle}>
                    Previous
                  </button>
                  <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="btn" style={pageBtnStyle}>
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const roleBadgeStyle = (role) => ({
  display: 'inline-flex',
  padding: '0.125rem 0.625rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  borderRadius: 'var(--radius-full)',
  textTransform: 'uppercase',
  backgroundColor: role === 'admin' ? '#e0e7ff' : '#f3f4f6',
  color: role === 'admin' ? '#4338ca' : '#374151',
});

const actionIconStyle = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--primary)',
  padding: '0.25rem 0.5rem',
  borderRadius: 'var(--radius-md)',
  transition: 'background 0.15s ease',
};

const deleteButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--error)',
  padding: '0.25rem 0.5rem',
  borderRadius: 'var(--radius-md)',
};

const paginationWrapperStyle = {
  padding: 'var(--space-4) var(--space-6)',
  borderTop: '1px solid var(--border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#fafafa',
};

const pageBtnStyle = {
  padding: '0.4rem 0.75rem',
  fontSize: '0.875rem',
  background: '#white',
  border: '1px solid var(--border)',
};

// End of file
