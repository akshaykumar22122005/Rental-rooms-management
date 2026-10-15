import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, CalendarCheck, Clock, CheckCircle2, XCircle, PlusCircle, ArrowRight, Star } from 'lucide-react';
import { ownerApi, requestApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const OwnerDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const [statsRes, reqRes] = await Promise.all([
        ownerApi.getDashboard(),
        ownerApi.getMyRequests()
      ]);
      setStats(statsRes.data);
      setRequests(reqRes.data || []);
    } catch (err) {
      console.error('Failed to load owner dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleQuickStatusUpdate = async (reqId, status) => {
    try {
      await requestApi.updateStatus(reqId, { status, ownerResponse: `Request ${status.toLowerCase()} by owner.` });
      setRequests((prev) =>
        prev.map((r) => (r.id === reqId ? { ...r, status } : r))
      );
      // refresh stats
      const statsRes = await ownerApi.getDashboard();
      setStats(statsRes.data);
    } catch (err) {
      alert('Failed to update request: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading owner analytics..." />;

  return (
    <div>
      {/* Welcome Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
            Landlord Overview
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage room listings, respond to tenant applications, and monitor inquiries
          </p>
        </div>

        <Link to="/owner/properties/new" className="btn btn-primary btn-sm">
          <PlusCircle size={16} /> Add New Listing
        </Link>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL PROPERTIES</span>
            <Building size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{stats?.totalProperties || 0}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL INQUIRIES</span>
            <CalendarCheck size={20} color="#6366f1" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{stats?.totalInquiries || 0}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>PENDING REVIEW</span>
            <Clock size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{stats?.pendingInquiries || 0}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>ACCEPTED</span>
            <CheckCircle2 size={20} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{stats?.acceptedInquiries || 0}</div>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
            Pending & Recent Rental Inquiries
          </h2>
          <Link to="/owner/requests" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <span>View all</span> <ArrowRight size={14} />
          </Link>
        </div>

        {requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            No tenant inquiries received yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Tenant</th>
                  <th>Move-In Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 6).map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{req.propertyTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹{req.propertyRent?.toLocaleString('en-IN')}/mo</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{req.tenantName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.tenantPhone}</div>
                    </td>
                    <td>{new Date(req.proposedMoveInDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${
                        req.status === 'ACCEPTED' ? 'badge-success' :
                        req.status === 'REJECTED' ? 'badge-danger' :
                        req.status === 'CANCELLED' ? 'badge-neutral' : 'badge-warning'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {req.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleQuickStatusUpdate(req.id, 'ACCEPTED')}
                            className="btn btn-success btn-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleQuickStatusUpdate(req.id, 'REJECTED')}
                            className="btn btn-danger-outline btn-sm"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
