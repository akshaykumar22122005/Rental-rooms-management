import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flag, Eye, CheckCircle, ShieldAlert } from 'lucide-react';
import { adminApi } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status update modal
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportStatus, setReportStatus] = useState('RESOLVED');
  const [adminNotes, setAdminNotes] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await adminApi.getReports();
      setReports(res.data || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const openStatusModal = (report) => {
    setSelectedReport(report);
    setReportStatus(report.status === 'PENDING' ? 'RESOLVED' : report.status);
    setAdminNotes(report.adminNotes || '');
    setModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;

    try {
      setUpdating(true);
      await adminApi.updateReportStatus(selectedReport.id, {
        status: reportStatus,
        adminNotes: adminNotes,
      });

      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id
            ? { ...r, status: reportStatus, adminNotes }
            : r
        )
      );
      setModalOpen(false);
      setSelectedReport(null);
    } catch (err) {
      alert('Failed to update report: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading reported listings..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          Reported Listings & Abuse Moderation
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Investigate fraudulent, misleading, or inappropriate properties reported by users
        </p>
      </div>

      {reports.length === 0 ? (
        <EmptyState
          icon={Flag}
          title="No reported listings"
          description="All properties currently comply with platform standards."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reports.map((rep) => (
            <div key={rep.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                    <Link to={`/rooms/${rep.propertyId}`}>{rep.propertyTitle}</Link>
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>
                    Reason: {rep.reason}
                  </div>
                </div>

                <span className={`badge ${
                  rep.status === 'RESOLVED' ? 'badge-success' :
                  rep.status === 'INVESTIGATING' ? 'badge-warning' :
                  rep.status === 'DISMISSED' ? 'badge-neutral' : 'badge-danger'
                }`}>
                  {rep.status}
                </span>
              </div>

              {rep.description && (
                <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1rem', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '6px' }}>
                  "{rep.description}"
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  Reported by: <strong>{rep.reporterName}</strong> ({rep.reporterEmail}) on {new Date(rep.createdAt).toLocaleDateString()}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/rooms/${rep.propertyId}`} className="btn btn-secondary btn-sm">
                    <Eye size={14} /> View Property
                  </Link>
                  <button onClick={() => openStatusModal(rep)} className="btn btn-primary btn-sm">
                    Update Report
                  </button>
                </div>
              </div>

              {rep.adminNotes && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#0f172a', borderLeft: '3px solid #10b981', paddingLeft: '0.5rem' }}>
                  <strong>Admin Resolution Notes:</strong> {rep.adminNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Report Status Modal */}
      {modalOpen && selectedReport && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Update Report Investigation</h3>
              <button onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleUpdateStatus}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Investigation Status</label>
                  <select className="form-control" value={reportStatus} onChange={(e) => setReportStatus(e.target.value)}>
                    <option value="INVESTIGATING">INVESTIGATING</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="DISMISSED">DISMISSED</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Admin Resolution Notes</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Document action taken (e.g. Landlord contacted, warning issued, property suspended)..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={updating}>
                  {updating ? 'Saving...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportsPage;
