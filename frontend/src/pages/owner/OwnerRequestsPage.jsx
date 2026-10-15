import React, { useState, useEffect } from 'react';
import { Calendar, Phone, Mail, CheckCircle, XCircle, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { ownerApi, requestApi } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const OwnerRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Response Modal state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [decisionStatus, setDecisionStatus] = useState('ACCEPTED');
  const [ownerNote, setOwnerNote] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await ownerApi.getMyRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error('Failed to load owner inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const openDecisionModal = (req, status) => {
    setSelectedRequest(req);
    setDecisionStatus(status);
    setOwnerNote(status === 'ACCEPTED' ? 'Your request has been approved. Please visit for agreement signing.' : 'Sorry, the room has already been taken or cannot accommodate this request.');
    setModalOpen(true);
  };

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      setSubmitting(true);
      await requestApi.updateStatus(selectedRequest.id, {
        status: decisionStatus,
        ownerResponse: ownerNote,
      });

      setRequests((prev) =>
        prev.map((r) =>
          r.id === selectedRequest.id
            ? { ...r, status: decisionStatus, ownerResponse: ownerNote }
            : r
        )
      );
      setModalOpen(false);
      setSelectedRequest(null);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading incoming inquiries..." />;

  const filtered = requests.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          Rental Inquiries & Requests
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Review prospective tenant applications and confirm move-in dates
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`btn btn-sm ${filterStatus === tab ? 'btn-primary' : 'btn-secondary'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No inquiries match this filter"
          description="Inquiries submitted by tenants for your rooms will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.map((req) => (
            <div key={req.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                    {req.propertyTitle}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {req.propertyLocality}, {req.propertyCity} • ₹{req.propertyRent?.toLocaleString('en-IN')}/month
                  </div>
                </div>

                <span className={`badge ${
                  req.status === 'ACCEPTED' ? 'badge-success' :
                  req.status === 'REJECTED' ? 'badge-danger' :
                  req.status === 'CANCELLED' ? 'badge-neutral' : 'badge-warning'
                }`}>
                  {req.status}
                </span>
              </div>

              {/* Tenant Profile Details */}
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>TENANT NAME</span>
                  <strong style={{ color: '#0f172a' }}>{req.tenantName}</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>CONTACT PHONE</span>
                  <strong style={{ color: '#0f172a' }}>{req.tenantPhone}</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>EMAIL ADDRESS</span>
                  <strong style={{ color: '#0f172a' }}>{req.tenantEmail}</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>PROPOSED MOVE-IN</span>
                  <strong style={{ color: 'var(--primary)' }}>{new Date(req.proposedMoveInDate).toLocaleDateString()}</strong>
                </div>
              </div>

              {/* Message from Tenant */}
              {req.message && (
                <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#334155', fontStyle: 'italic', backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: '6px' }}>
                  "{req.message}"
                </div>
              )}

              {/* Landlord Response */}
              {req.ownerResponse && (
                <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#0f172a', borderLeft: '3px solid var(--primary)', paddingLeft: '0.75rem' }}>
                  <strong>Your Response:</strong> {req.ownerResponse}
                </div>
              )}

              {/* Action Buttons */}
              {req.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <button
                    onClick={() => openDecisionModal(req, 'REJECTED')}
                    className="btn btn-danger-outline btn-sm"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => openDecisionModal(req, 'ACCEPTED')}
                    className="btn btn-success btn-sm"
                  >
                    Accept & Confirm Move-In
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Decision Modal */}
      {modalOpen && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                {decisionStatus === 'ACCEPTED' ? 'Accept Rental Application' : 'Reject Rental Application'}
              </h3>
              <button onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleDecisionSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1rem' }}>
                  You are responding to <strong>{selectedRequest.tenantName}</strong> for room <strong>'{selectedRequest.propertyTitle}'</strong>.
                </p>

                <div className="form-group">
                  <label className="form-label">Note / Response to Tenant</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={ownerNote}
                    onChange={(e) => setOwnerNote(e.target.value)}
                    required
                  />
                  <span className="form-hint">
                    This message will be included in the tenant's in-app notification.
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-sm ${decisionStatus === 'ACCEPTED' ? 'btn-success' : 'btn-danger'}`}
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : `Confirm ${decisionStatus}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerRequestsPage;
