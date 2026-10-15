import React, { useState, useEffect } from 'react';
import { Users, Shield, UserX, UserCheck, Search } from 'lucide-react';
import { adminApi } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const params = { page: 0, size: 50 };
      if (roleFilter) params.role = roleFilter;
      const res = await adminApi.getUsers(params);
      setUsers(res.data.content || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const toggleUserStatus = async (user) => {
    const nextStatus = user.accountStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await adminApi.updateUserStatus(user.id, { status: nextStatus, adminNotes: 'Status updated by Super Admin' });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, accountStatus: nextStatus } : u))
      );
    } catch (err) {
      alert('Failed to update user status: ' + err.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phoneNumber.toLowerCase().includes(q)
    );
  });

  if (loading) return <LoadingSpinner message="Loading user directory..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          User Directory & Account Status
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Manage room seekers, verified property owners, and administrative access
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 250px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', padding: '0.4rem 0' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { label: 'All Roles', value: '' },
            { label: 'Tenants', value: 'ROLE_TENANT' },
            { label: 'Landlords', value: 'ROLE_OWNER' },
            { label: 'Admins', value: 'ROLE_ADMIN' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setRoleFilter(tab.value)}
              className={`btn btn-sm ${roleFilter === tab.value ? 'btn-primary' : 'btn-secondary'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Phone Number</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.fullName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                  </td>
                  <td>{u.phoneNumber}</td>
                  <td>
                    <span className="badge badge-primary">{u.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${u.accountStatus === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                      {u.accountStatus}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.role !== 'ROLE_ADMIN' ? (
                      <button
                        onClick={() => toggleUserStatus(u)}
                        className={`btn btn-sm ${u.accountStatus === 'ACTIVE' ? 'btn-danger-outline' : 'btn-success'}`}
                      >
                        {u.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;
