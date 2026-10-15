import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Heart, Star, Bed, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { wishlistApi } from '../api/client';

const PropertyCard = ({ property, onWishlistToggle }) => {
  const { isAuthenticated, isTenant } = useAuth();
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(property.wishlisted || false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const defaultImage = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
  const displayImage = property.images && property.images.length > 0 ? property.images[0] : defaultImage;

  const handleHeartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isTenant) {
      alert('Only tenants can save rooms to their wishlist');
      return;
    }

    try {
      setLoadingWishlist(true);
      if (wishlisted) {
        await wishlistApi.remove(property.id);
        setWishlisted(false);
      } else {
        await wishlistApi.add(property.id);
        setWishlisted(true);
      }
      if (onWishlistToggle) {
        onWishlistToggle(property.id, !wishlisted);
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const formatEnum = (str) => {
    if (!str) return '';
    return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Image container */}
      <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
        <img
          src={displayImage}
          alt={property.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onError={(e) => { e.target.src = defaultImage; }}
        />

        {/* Badges on image */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
          <span className="badge badge-primary">
            {formatEnum(property.roomType)}
          </span>
          {property.categoryName && (
            <span className="badge badge-neutral" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
              {property.categoryName}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleHeartClick}
          disabled={loadingWishlist}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            transition: 'var(--transition)'
          }}
          title={wishlisted ? 'Remove from saved' : 'Save room'}
        >
          <Heart
            size={18}
            fill={wishlisted ? '#ef4444' : 'none'}
            color={wishlisted ? '#ef4444' : '#475569'}
          />
        </button>

        {/* Rent badge overlay */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(4px)',
          color: '#ffffff',
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
          fontSize: '0.95rem'
        }}>
          {formatCurrency(property.monthlyRent)} <span style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.85 }}>/mo</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Title */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', lineHeight: 1.4 }}>
          <Link to={`/rooms/${property.id}`} style={{ color: 'inherit' }}>
            {property.title}
          </Link>
        </h3>

        {/* Locality & City */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          <MapPin size={15} color="var(--primary)" />
          <span>{property.locality}, {property.city}</span>
        </div>

        {/* Info tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#475569' }}>
          <span style={{ backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            {formatEnum(property.furnishingStatus)}
          </span>
          <span style={{ backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            Deposit: {formatCurrency(property.securityDeposit)}
          </span>
          {property.genderPreference && property.genderPreference !== 'ANY' && (
            <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              {formatEnum(property.genderPreference)}
            </span>
          )}
        </div>

        {/* Facilities Preview */}
        {property.facilities && property.facilities.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
            {property.facilities.slice(0, 3).map((f) => (
              <span key={f.id} style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                • {f.facilityName}
              </span>
            ))}
            {property.facilities.length > 3 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                +{property.facilities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer info & CTA */}
        <div style={{ marginTop: 'auto', paddingTop: '0.875rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
            <Star size={15} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontWeight: 700, color: '#1e293b' }}>
              {property.averageRating > 0 ? property.averageRating.toFixed(1) : 'New'}
            </span>
            {property.reviewCount > 0 && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                ({property.reviewCount})
              </span>
            )}
          </div>

          <Link to={`/rooms/${property.id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
