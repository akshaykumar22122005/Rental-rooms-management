import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2, Eye, Building } from 'lucide-react';
import { ownerApi, propertyApi } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';

const MyPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProperties = async () => {
    try {
      const res = await ownerApi.getMyProperties({ page: 0, size: 50 });
      setProperties(res.data.content || []);
    } catch (err) {
      console.error('Failed to load properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const promptDelete = (id) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      setActionLoading(true);
      await propertyApi.delete(deletingId);
      setProperties((prev) => prev.filter((p) => p.id !== deletingId));
      setDeleteModalOpen(false);
      setDeletingId(null);
    } catch (err) {
      alert('Failed to delete property: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your properties..." />;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
            My Listed Properties
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage room listings, edit pricing, or toggle availability
          </p>
        </div>

        <Link to="/owner/properties/new" className="btn btn-primary btn-sm">
          <PlusCircle size={16} /> Add New Listing
        </Link>
      </div>

      {properties.length === 0 ? (
        <EmptyState
          icon={Building}
          title="No properties listed yet"
          description="Create your first rental room listing to start connecting with prospective tenants."
          action={
            <Link to="/owner/properties/new" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Post Property Listing
            </Link>
          }
        />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Rent & Deposit</th>
                  <th>Availability</th>
                  <th>Moderation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#e2e8f0', flexShrink: 0 }}>
                          <img
                            src={p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=200&q=80'}
                            alt={p.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.availableRooms} rooms available</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.categoryName}</td>
                    <td>{p.locality}, {p.city}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>₹{p.monthlyRent?.toLocaleString('en-IN')}/mo</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dep: ₹{p.securityDeposit?.toLocaleString('en-IN')}</div>
                    </td>
                    <td>
                      <span className={`badge ${p.availabilityStatus === 'AVAILABLE' ? 'badge-success' : 'badge-neutral'}`}>
                        {p.availabilityStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${p.moderationStatus === 'APPROVED' ? 'badge-primary' : 'badge-warning'}`}>
                        {p.moderationStatus}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Link to={`/rooms/${p.id}`} className="btn btn-secondary btn-sm" title="View Public Page">
                          <Eye size={14} />
                        </Link>
                        <Link to={`/owner/properties/${p.id}/edit`} className="btn btn-secondary btn-sm" title="Edit Listing">
                          <Edit3 size={14} />
                        </Link>
                        <button onClick={() => promptDelete(p.id)} className="btn btn-danger-outline btn-sm" title="Delete Listing">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteModalOpen}
        title="Delete Property"
        message="Are you sure you want to permanently delete this listing? All associated images and pending inquiries will be removed."
        confirmText="Delete Property"
        confirmType="danger"
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default MyPropertiesPage;
