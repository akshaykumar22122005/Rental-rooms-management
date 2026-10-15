import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trash2 } from 'lucide-react';
import { reviewApi } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';

const TenantReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await reviewApi.getMyReviews();
      setReviews(res.data || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const promptDelete = (id) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      setActionLoading(true);
      await reviewApi.delete(deletingId);
      setReviews((prev) => prev.filter((r) => r.id !== deletingId));
      setDeleteModalOpen(false);
      setDeletingId(null);
    } catch (err) {
      alert('Failed to delete review: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your reviews..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          My Reviews & Ratings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Feedback and ratings you've submitted for rental accommodations
        </p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews submitted yet"
          description="Once you have rented or visited rooms, you can submit ratings and reviews from the property details page."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reviews.map((rev) => (
            <div key={rev.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                  <Link to={`/rooms/${rev.propertyId}`}>{rev.propertyTitle}</Link>
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
              </div>

              <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                "{rev.comment}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Posted on {new Date(rev.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => promptDelete(rev.id)}
                  className="btn btn-danger-outline btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteModalOpen}
        title="Delete Review"
        message="Are you sure you want to permanently delete this review?"
        confirmText="Delete"
        confirmType="danger"
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default TenantReviewsPage;
