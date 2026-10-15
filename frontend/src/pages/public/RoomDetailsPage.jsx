import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Heart, Star, ShieldCheck, Check, Calendar, Phone, Mail,
  User, AlertCircle, Send, Flag, ArrowLeft, Building2, CheckCircle2
} from 'lucide-react';
import { propertyApi, requestApi, wishlistApi, reviewApi, reportApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isTenant } = useAuth();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Inquiry Modal State
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [moveInDate, setMoveInDate] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  // Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Misleading information');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [propRes, revRes] = await Promise.all([
          propertyApi.getById(id),
          reviewApi.getByProperty(id)
        ]);
        setProperty(propRes.data);
        setIsWishlisted(propRes.data.wishlisted || false);
        setReviews(revRes.data || []);
      } catch (err) {
        console.error('Failed to load room details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isTenant) {
      alert('Only tenants can save rooms to their wishlist');
      return;
    }
    try {
      if (isWishlisted) {
        await wishlistApi.remove(property.id);
        setIsWishlisted(false);
      } else {
        await wishlistApi.add(property.id);
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!moveInDate) {
      setInquiryError('Please select your proposed move-in date');
      return;
    }

    try {
      setInquirySubmitting(true);
      setInquiryError('');
      await requestApi.create({
        propertyId: property.id,
        proposedMoveInDate: moveInDate,
        message: inquiryMessage,
      });
      setInquirySuccess(true);
    } catch (err) {
      setInquiryError(err.message || 'Failed to submit rental inquiry');
    } finally {
      setInquirySubmitting(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      setReportSubmitting(true);
      await reportApi.submit({
        propertyId: property.id,
        reason: reportReason,
        description: reportDescription,
      });
      setReportSuccess(true);
    } catch (err) {
      alert('Failed to submit report: ' + err.message);
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setReviewSubmitting(true);
      setReviewError('');
      const res = await reviewApi.submit({
        propertyId: property.id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviews([res.data, ...reviews]);
      setReviewComment('');
      alert('Thank you! Your review has been submitted.');
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
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

  if (loading) return <LoadingSpinner message="Loading room details..." />;
  if (!property) return (
    <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <h2>Property Not Found</h2>
      <Link to="/rooms" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Listings</Link>
    </div>
  );

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/rooms" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Search Results
          </Link>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleWishlistToggle}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : '#475569'} />
              <span>{isWishlisted ? 'Saved' : 'Save Room'}</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={() => setReportModalOpen(true)}
                className="btn btn-secondary btn-sm"
                style={{ color: '#ef4444' }}
                title="Report this listing"
              >
                <Flag size={16} /> Report
              </button>
            )}
          </div>
        </div>

        {/* Gallery */}
        <div style={{ marginBottom: '2.5rem' }}>
          {/* Main Image */}
          <div style={{
            width: '100%',
            height: '460px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: '#0f172a',
            marginBottom: '1rem'
          }}>
            <img
              src={images[activeImageIndex]}
              alt={property.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Thumbnail list */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    width: '90px',
                    height: '65px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: activeImageIndex === idx ? '3px solid var(--primary)' : '2px solid transparent',
                    opacity: activeImageIndex === idx ? 1 : 0.65,
                    transition: 'var(--transition)'
                  }}
                >
                  <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Two-Column Details & Contact */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }} className="details-layout">
          {/* Left Column: Property Details */}
          <div>
            {/* Header info */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="badge badge-primary">{formatEnum(property.roomType)}</span>
                <span className="badge badge-neutral">{property.categoryName}</span>
                <span className="badge badge-success">{formatEnum(property.availabilityStatus)}</span>
              </div>

              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                {property.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                <MapPin size={18} color="var(--primary)" />
                <span>{property.fullAddress}</span>
              </div>
            </div>

            {/* Price Overview Banner */}
            <div className="card" style={{ padding: '1.5rem', backgroundColor: '#f8fafc', marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>MONTHLY RENT</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
                    {formatCurrency(property.monthlyRent)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>SECURITY DEPOSIT</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                    {formatCurrency(property.securityDeposit)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>MAINTENANCE</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                    {property.maintenanceCharges > 0 ? formatCurrency(property.maintenanceCharges) : 'Included'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ROOMS AVAILABLE</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                    {property.availableRooms} {property.availableRooms > 1 ? 'Rooms' : 'Room'}
                  </div>
                </div>
              </div>
            </div>

            {/* Room Features Grid */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Room Specifications</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Furnishing Status</span>
                  <strong style={{ color: '#0f172a' }}>{formatEnum(property.furnishingStatus)}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Gender / Tenant Preference</span>
                  <strong style={{ color: '#0f172a' }}>{formatEnum(property.genderPreference)}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Electricity Charges</span>
                  <strong style={{ color: '#0f172a' }}>{property.electricityCharges || 'Standard submeter'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Listed Date</span>
                  <strong style={{ color: '#0f172a' }}>{new Date(property.createdAt).toLocaleDateString()}</strong>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.875rem' }}>About This Property</h3>
              <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                {property.description}
              </p>
            </div>

            {/* Facilities / Amenities */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Included Facilities & Amenities</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.875rem' }}>
                {property.facilities && property.facilities.map((fac) => (
                  <div key={fac.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.8rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--success)', display: 'flex' }}>
                      <CheckCircle2 size={18} />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>{fac.facilityName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            {property.houseRules && (
              <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.875rem' }}>House Rules & Policies</h3>
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                  {property.houseRules}
                </p>
              </div>
            )}

            {/* Reviews Section */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Tenant Reviews</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                    <Star size={18} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                      {property.averageRating > 0 ? property.averageRating.toFixed(1) : 'No reviews yet'}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      ({property.reviewCount} total {property.reviewCount === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Review submission form */}
              {isAuthenticated && isTenant && (
                <form onSubmit={handleReviewSubmit} style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Write a Review</h4>
                  {reviewError && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{reviewError}</div>}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Rating:</span>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={22}
                        onClick={() => setReviewRating(s)}
                        fill={s <= reviewRating ? '#f59e0b' : 'none'}
                        color={s <= reviewRating ? '#f59e0b' : '#cbd5e1'}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </div>

                  <div className="form-group">
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Share your experience regarding this room, facilities, or neighborhood..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-sm" disabled={reviewSubmitting}>
                    {reviewSubmitting ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {reviews.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Be the first tenant to leave a review for this property!
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{rev.tenantName}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                          ))}
                        </div>
                      </div>
                      <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5 }}>{rev.comment}</p>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Landlord Card & Action Modal */}
          <div>
            <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Rent for</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: '0.3rem 0' }}>
                  {formatCurrency(property.monthlyRent)}
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}> /month</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 700 }}>
                  ✓ Direct Owner Listing
                </div>
              </div>

              {/* Inquiry Action Button */}
              {isAuthenticated ? (
                isTenant ? (
                  <button
                    onClick={() => { setInquiryModalOpen(true); setInquirySuccess(false); }}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginBottom: '1.5rem' }}
                  >
                    <Send size={18} /> Inquire / Request Room
                  </button>
                ) : (
                  <div style={{ padding: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                    You are logged in as {formatEnum(user.role)}. Inquiries can only be submitted by tenants.
                  </div>
                )
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginBottom: '1.5rem', textAlign: 'center' }}
                >
                  Login to Request Room
                </Link>
              )}

              {/* Owner Profile Card */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Property Owner
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800
                  }}>
                    {property.ownerName?.charAt(0) || 'O'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{property.ownerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <ShieldCheck size={14} /> Verified Landlord
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                    <Phone size={16} color="var(--primary)" />
                    <span>{property.ownerPhone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                    <Mail size={16} color="var(--primary)" />
                    <span>{property.ownerEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Modal */}
        {inquiryModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Rental Booking Request</h3>
                <button onClick={() => setInquiryModalOpen(false)}>✕</button>
              </div>

              {inquirySuccess ? (
                <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                    <Check size={28} />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Inquiry Sent Successfully!</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    The property owner has received your move-in request and in-app notification. You can track their response in your tenant dashboard.
                  </p>
                  <button onClick={() => setInquiryModalOpen(false)} className="btn btn-primary btn-sm">
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit}>
                  <div className="modal-body">
                    {inquiryError && (
                      <div style={{ padding: '0.6rem 0.8rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        {inquiryError}
                      </div>
                    )}

                    <div className="form-group">
                      <label className="form-label">Property</label>
                      <input className="form-control" type="text" value={property.title} disabled />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Proposed Move-In Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        min={new Date().toISOString().split('T')[0]}
                        value={moveInDate}
                        onChange={(e) => setMoveInDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Message to Landlord</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Introduce yourself, your profession, duration of stay..."
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" onClick={() => setInquiryModalOpen(false)} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={inquirySubmitting}>
                      {inquirySubmitting ? 'Sending Request...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Report Listing Modal */}
        {reportModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ef4444' }}>Report Suspicious Listing</h3>
                <button onClick={() => setReportModalOpen(false)}>✕</button>
              </div>

              {reportSuccess ? (
                <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
                  <h4>Report Submitted</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Our moderation team has received your complaint and will investigate this listing.
                  </p>
                  <button onClick={() => setReportModalOpen(false)} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="form-label">Reason</label>
                      <select className="form-control" value={reportReason} onChange={(e) => setReportReason(e.target.value)}>
                        <option value="Misleading information">Misleading information or photos</option>
                        <option value="Fraudulent or scam listing">Fraudulent or scam listing</option>
                        <option value="Inappropriate content">Inappropriate or offensive content</option>
                        <option value="Room no longer available">Room is already rented or not available</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Details / Description</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Describe the issue..."
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" onClick={() => setReportModalOpen(false)} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-danger btn-sm" disabled={reportSubmitting}>
                      {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 868px) {
          .details-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RoomDetailsPage;
