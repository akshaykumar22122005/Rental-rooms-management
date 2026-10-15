import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Eye } from 'lucide-react';
import { adminApi } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const AdminRequestsView = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await adminApi.getAllRequests();
        setRequests(res.data || []);
      } catch (err) {
        console.error('Failed to load admin requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <LoadingSpinner message="Loading all rental requests..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          Platform Rental Inquiries
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Overview of all booking requests and negotiations across the platform
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No rental requests found" />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Tenant</th>
                  <th>Landlord</th>
                  <th>Move-In Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{r.propertyTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹{r.propertyRent?.toLocaleString('en-IN')}/mo</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.tenantName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.tenantEmail}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.ownerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.ownerEmail}</div>
                    </td>
                    <td>{new Date(r.proposedMoveInDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${
                        r.status === 'ACCEPTED' ? 'badge-success' :
                        r.status === 'REJECTED' ? 'badge-danger' :
                        r.status === 'CANCELLED' ? 'badge-neutral' : 'badge-warning'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/rooms/${r.propertyId}`} className="btn btn-secondary btn-sm">
                        <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequestsView;
