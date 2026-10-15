import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Compass } from 'lucide-react';
import { requestApi } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';

const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await requestApi.getMyRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const promptCancel = (id) => {
    setCancellingId(id);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingId) return;
    try {
      setActionLoading(true);
      await requestApi.cancel(cancellingId);
      setRequests((prev) =>
        prev.map((r) => (r.id === cancellingId ? { ...r, status: 'CANCELLED' } : r))
      );
      setCancelModalOpen(false);
      setCancellingId(null);
    } catch (err) {
      alert('Failed to cancel request: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return <span className="badge badge-success">ACCEPTED</span>;
      case 'REJECTED':
        return <span className="badge badge-danger">REJECTED</span>;
      case 'CANCELLED':
        return <span className="badge badge-neutral">CANCELLED</span>;
      default:
        return <span className="badge badge-warning">PENDING</span>;
    }
  };

  if (loading) return <LoadingSpinner message="Loading your rental requests..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          My Rental Requests
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Track landlord responses, approval status, and proposed move-in dates
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No applications submitted yet"
          description="Find a room you like and click 'Inquire / Request Room' to send a request to the landlord."
          action={
            <Link to="/rooms" className="btn btn-primary btn-sm">
              <Compass size={16} /> Explore Available Rooms
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {requests.map((req) => (
            <div key={req.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
              {/* Property Image preview */}
              <div style={{ width: '120px', height: '90px', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#e2e8f0', flexShrink: 0 }}>
                <img
                  src={req.propertyImage || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80'}
                  alt={req.propertyTitle}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Request Info */}
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                    <Link to={`/rooms/${req.propertyId}`}>{req.propertyTitle}</Link>
                  </h3>
                  {getStatusBadge(req.status)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <MapPin size={15} color="var(--primary)" />
                  <span>{req.propertyLocality}, {req.propertyCity}</span>
                  <span>•</span>
                  <strong>₹{req.propertyRent?.toLocaleString('en-IN')}/mo</strong>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <span>
                    Proposed Move-In: <strong>{new Date(req.proposedMoveInDate).toLocaleDateString()}</strong>
                  </span>
                  <span>
                    Owner: <strong>{req.ownerName}</strong> ({req.ownerPhone})
                  </span>
                </div>

                {/* Landlord Response message */}
                {req.ownerResponse && (
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: req.status === 'ACCEPTED' ? '#ecfdf5' : '#fef2f2',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    color: req.status === 'ACCEPTED' ? '#065f46' : '#991b1b',
                    borderLeft: `3px solid ${req.status === 'ACCEPTED' ? '#10b981' : '#ef4444'}`
                  }}>
                    <strong>Landlord's Note:</strong> {req.ownerResponse}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                <Link to={`/rooms/${req.propertyId}`} className="btn btn-secondary btn-sm" style={{ textAlign: 'center' }}>
                  View Property
                </Link>

                {req.status === 'PENDING' && (
                  <button
                    onClick={() => promptCancel(req.id)}
                    className="btn btn-danger-outline btn-sm"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={cancelModalOpen}
        title="Cancel Rental Request"
        message="Are you sure you want to cancel this pending rental request? The landlord will be notified."
        confirmText="Yes, Cancel Request"
        confirmType="danger"
        loading={actionLoading}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelModalOpen(false)}
      />
    </div>
  );
};

export default MyRequestsPage;
