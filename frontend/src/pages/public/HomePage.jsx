import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Shield, Clock, Award, Key, ArrowRight, Building, CheckCircle, Sparkles } from 'lucide-react';
import { propertyApi, categoryApi } from '../../api/client';
import PropertyCard from '../../components/PropertyCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search bar form state
  const [searchCity, setSearchCity] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchMaxRent, setSearchMaxRent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, catRes] = await Promise.all([
          propertyApi.getFeatured(),
          categoryApi.getAll()
        ]);
        setFeaturedRooms(featRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity.trim()) params.append('city', searchCity.trim());
    if (searchCategory) params.append('categoryId', searchCategory);
    if (searchMaxRent) params.append('maxRent', searchMaxRent);
    navigate(`/rooms?${params.toString()}`);
  };

  const popularCities = [
    { name: 'Bengaluru', rooms: '150+ listings', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hyderabad', rooms: '120+ listings', image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=600&q=80' },
    { name: 'Pune', rooms: '90+ listings', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80' },
    { name: 'Mumbai', rooms: '200+ listings', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
        color: '#ffffff',
        padding: '5rem 0 6rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Sparkles size={16} color="#fbbf24" />
              <span>Smart accommodation matching for students & professionals</span>
            </div>

            <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
              Find Your Perfect <span style={{ color: '#93c5fd' }}>Rental Room</span>
            </h1>
            <p style={{ fontSize: '1.15rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '650px', margin: '0 auto 2.5rem auto' }}>
              Explore verified rental accommodations, private flats, shared rooms, and executive PGs. Connect directly with landlords with zero brokerage fees.
            </p>

            {/* Quick Search Form */}
            <form onSubmit={handleSearchSubmit} style={{
              backgroundColor: '#ffffff',
              padding: '0.875rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center',
              textAlign: 'left'
            }}>
              {/* City */}
              <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', borderRight: '1px solid #e2e8f0' }}>
                <MapPin size={20} color="var(--primary)" />
                <div style={{ width: '100%' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>City</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, Pune"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontWeight: 600, fontSize: '0.925rem', color: '#0f172a' }}
                  />
                </div>
              </div>

              {/* Category */}
              <div style={{ flex: '1 1 180px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', borderRight: '1px solid #e2e8f0' }}>
                <Building size={20} color="var(--primary)" />
                <div style={{ width: '100%' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Category</label>
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontWeight: 600, fontSize: '0.925rem', color: '#0f172a', background: 'transparent' }}
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.categoryName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Max Rent */}
              <div style={{ flex: '1 1 160px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem' }}>
                <div style={{ width: '100%' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Max Budget (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 15000"
                    value={searchMaxRent}
                    onChange={(e) => setSearchMaxRent(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontWeight: 600, fontSize: '0.925rem', color: '#0f172a' }}
                  />
                </div>
              </div>

              {/* Search Button */}
              <button type="submit" className="btn btn-primary" style={{ padding: '0.875rem 1.75rem', flex: '0 0 auto' }}>
                <Search size={18} />
                <span>Search Rooms</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Explore by City
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
                Popular Rental Hubs
              </h2>
            </div>
            <Link to="/rooms" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--primary)' }}>
              <span>View all locations</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {popularCities.map((city) => (
              <div
                key={city.name}
                onClick={() => navigate(`/rooms?city=${city.name}`)}
                style={{
                  position: 'relative',
                  height: '240px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'var(--transition)'
                }}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  color: '#fff'
                }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{city.name}</h3>
                  <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>{city.rooms}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#f1f5f9' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Handpicked Listings
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
                Featured Rental Rooms
              </h2>
            </div>
            <Link to="/rooms" className="btn btn-outline btn-sm">
              Explore All Rooms
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching featured rooms..." />
          ) : featuredRooms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: 'var(--radius-lg)' }}>
              No featured rooms available at the moment.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.75rem' }}>
              {featuredRooms.map((room) => (
                <PropertyCard key={room.id} property={room} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Accommodation Types
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
              Tailored For Every Lifestyle
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              From cozy private rooms to full family apartments, discover what best suits your budget and needs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {categories.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/rooms?categoryId=${c.id}`)}
                className="card"
                style={{ cursor: 'pointer', textAlign: 'center', padding: '1.75rem 1.25rem' }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}>
                  <Building size={24} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem' }}>
                  {c.categoryName}
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  {c.description || 'Verified rooms'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#f8fafc', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3.5rem auto' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Seamless Process
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
              How It Works
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '1rem'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Search & Filter</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Filter rooms by rent range, city, locality, furnishing status, and amenities with real-time MySQL search.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '1rem'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>View Details & Rules</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Inspect high-res photos, house rules, deposit terms, utility charges, and verified owner contact credentials.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '1rem'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Submit Inquiry</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Select a proposed move-in date and send an inquiry. Landlords receive immediate in-app notifications.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '1rem'
              }}>
                4
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Get Confirmation</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Track acceptance status on your dashboard, communicate with the landlord, and move into your new room.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Landlord Banner */}
      <section style={{
        padding: '4rem 0',
        backgroundColor: '#0f172a',
        color: '#ffffff'
      }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
          <div>
            <span style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Are you a property owner?
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.3rem', marginBottom: '0.5rem' }}>
              List Your Room & Connect With Tenants
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '600px' }}>
              Manage multiple listings, view real-time rental inquiries, accept or reject requests, and track tenant reviews in your dedicated owner dashboard.
            </p>
          </div>
          <div>
            <Link to="/register" className="btn btn-primary btn-lg">
              Post Your Property Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
