import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare } from 'lucide-react';
import { ownerApi } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const OwnerReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await ownerApi.getReviews();
        setReviews(res.data || []);
      } catch (err) {
        console.error('Failed to load owner reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <LoadingSpinner message="Loading property reviews..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          Tenant Feedback & Reviews
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Ratings and tenant testimonials across all your listed properties
        </p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews received yet"
          description="Tenant reviews submitted for your properties will be displayed here."
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

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Reviewed by <strong>{rev.tenantName}</strong> on {new Date(rev.createdAt).toLocaleDateString()}
              </div>

              <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: 1.6 }}>
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerReviewsPage;
