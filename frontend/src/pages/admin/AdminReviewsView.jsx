import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trash2 } from 'lucide-react';
import { adminApi, reviewApi } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const AdminReviewsView = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await adminApi.getAllReviews();
      setReviews(res.data || []);
    } catch (err) {
      console.error('Failed to load reviews for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await reviewApi.delete(id);
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (err) {
      alert('Failed to delete review: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading reviews..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          Platform User Reviews
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Monitor community ratings and moderate inappropriate tenant feedback
        </p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews posted yet" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map((rev) => (
            <div key={rev.id} className="card" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <div>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>
                    <Link to={`/rooms/${rev.propertyId}`}>{rev.propertyTitle}</Link>
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                    by {rev.tenantName}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
              </div>

              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                "{rev.comment}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
                <button onClick={() => handleDelete(rev.id)} className="btn btn-danger-outline btn-sm">
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviewsView;
