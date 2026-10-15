import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass } from 'lucide-react';
import { wishlistApi } from '../../api/client';
import PropertyCard from '../../components/PropertyCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const SavedRoomsPage = () => {
  const [savedRooms, setSavedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistApi.getAll();
      setSavedRooms(res.data || []);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleWishlistToggle = (propertyId, isSaved) => {
    if (!isSaved) {
      setSavedRooms((prev) => prev.filter((p) => p.id !== propertyId));
    }
  };

  if (loading) return <LoadingSpinner message="Loading saved rooms..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          Saved Rooms & Wishlist
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Quick access to your bookmarked properties
        </p>
      </div>

      {savedRooms.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved rooms yet"
          description="Browse available properties and click the heart icon on any card to save it here."
          action={
            <Link to="/rooms" className="btn btn-primary btn-sm">
              <Compass size={16} /> Explore Available Rooms
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {savedRooms.map((property) => (
            <PropertyCard
              key={property.id}
              property={{ ...property, wishlisted: true }}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRoomsPage;
