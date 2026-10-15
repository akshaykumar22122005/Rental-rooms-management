import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, ShieldCheck, XCircle, AlertTriangle, Eye } from 'lucide-react';
import { adminApi } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManagePropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const res = await adminApi.getProperties({ page: 0, size: 50 });
      setProperties(res.data.content || []);
    } catch (err) {
      console.error('Failed to load properties for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleModeration = async (propId, status) => {
    try {
      await adminApi.updateModeration(propId, { status });
      setProperties((prev) =>
        prev.map((p) => (p.id === propId ? { ...p, moderationStatus: status } : p))
      );
    } catch (err) {
      alert('Failed to update property moderation: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading listings..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          Platform Properties & Moderation
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Approve, reject, or suspend rental accommodations across the platform
        </p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Owner</th>
                <th>Location</th>
                <th>Monthly Rent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.categoryName} • {p.roomType}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.ownerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.ownerEmail}</div>
                  </td>
                  <td>{p.locality}, {p.city}</td>
                  <td><strong>₹{p.monthlyRent?.toLocaleString('en-IN')}</strong></td>
                  <td>
                    <span className={`badge ${
                      p.moderationStatus === 'APPROVED' ? 'badge-success' :
                      p.moderationStatus === 'REJECTED' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {p.moderationStatus}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Link to={`/rooms/${p.id}`} className="btn btn-secondary btn-sm" title="View Room">
                        <Eye size={14} />
                      </Link>

                      {p.moderationStatus !== 'APPROVED' && (
                        <button
                          onClick={() => handleModeration(p.id, 'APPROVED')}
                          className="btn btn-success btn-sm"
                          title="Approve Listing"
                        >
                          Approve
                        </button>
                      )}

                      {p.moderationStatus !== 'SUSPENDED' && (
                        <button
                          onClick={() => handleModeration(p.id, 'SUSPENDED')}
                          className="btn btn-danger-outline btn-sm"
                          title="Suspend Listing"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
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

export default ManagePropertiesPage;
