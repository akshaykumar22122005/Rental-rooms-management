import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { propertyApi, categoryApi, facilityApi } from '../../api/client';
import PropertyCard from '../../components/PropertyCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const RoomsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [locality, setLocality] = useState(searchParams.get('locality') || '');
  const [minRent, setMinRent] = useState(searchParams.get('minRent') || '');
  const [maxRent, setMaxRent] = useState(searchParams.get('maxRent') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [roomType, setRoomType] = useState(searchParams.get('roomType') || '');
  const [furnishingStatus, setFurnishingStatus] = useState(searchParams.get('furnishingStatus') || '');
  const [genderPreference, setGenderPreference] = useState(searchParams.get('genderPreference') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'recently_added');
  const [selectedFacilities, setSelectedFacilities] = useState(() => {
    const fac = searchParams.get('facilityIds');
    return fac ? fac.split(',').map((id) => Number(id)) : [];
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Load Categories & Facilities once
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, facRes] = await Promise.all([
          categoryApi.getAll(),
          facilityApi.getAll(),
        ]);
        setCategories(catRes.data || []);
        setFacilities(facRes.data || []);
      } catch (err) {
        console.error('Failed to load metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch properties whenever query params change
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          size: 9,
          sortBy,
        };

        if (query) params.query = query;
        if (city) params.city = city;
        if (locality) params.locality = locality;
        if (minRent) params.minRent = minRent;
        if (maxRent) params.maxRent = maxRent;
        if (categoryId) params.categoryId = categoryId;
        if (roomType) params.roomType = roomType;
        if (furnishingStatus) params.furnishingStatus = furnishingStatus;
        if (genderPreference) params.genderPreference = genderPreference;
        if (selectedFacilities.length > 0) {
          params.facilityIds = selectedFacilities.join(',');
        }

        const res = await propertyApi.search(params);
        setProperties(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [currentPage, sortBy, searchParams]);

  const applyFilters = (e) => {
    if (e) e.preventDefault();
    setCurrentPage(0);

    const newParams = new URLSearchParams();
    if (query) newParams.set('query', query);
    if (city) newParams.set('city', city);
    if (locality) newParams.set('locality', locality);
    if (minRent) newParams.set('minRent', minRent);
    if (maxRent) newParams.set('maxRent', maxRent);
    if (categoryId) newParams.set('categoryId', categoryId);
    if (roomType) newParams.set('roomType', roomType);
    if (furnishingStatus) newParams.set('furnishingStatus', furnishingStatus);
    if (genderPreference) newParams.set('genderPreference', genderPreference);
    if (sortBy) newParams.set('sortBy', sortBy);
    if (selectedFacilities.length > 0) {
      newParams.set('facilityIds', selectedFacilities.join(','));
    }

    setSearchParams(newParams);
    setShowMobileFilters(false);
  };

  const resetFilters = () => {
    setQuery('');
    setCity('');
    setLocality('');
    setMinRent('');
    setMaxRent('');
    setCategoryId('');
    setRoomType('');
    setFurnishingStatus('');
    setGenderPreference('');
    setSelectedFacilities([]);
    setSortBy('recently_added');
    setCurrentPage(0);
    setSearchParams(new URLSearchParams());
  };

  const toggleFacility = (id) => {
    setSelectedFacilities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ padding: '2.5rem 0', minHeight: '80vh' }}>
      <div className="container">
        {/* Title & mobile filter toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
              Explore Available Rooms
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Showing {totalElements} verified rental accommodations
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Sorting */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  const p = new URLSearchParams(searchParams);
                  p.set('sortBy', e.target.value);
                  setSearchParams(p);
                }}
                className="form-control"
                style={{ padding: '0.45rem 0.75rem', width: 'auto', fontSize: '0.875rem' }}
              >
                <option value="recently_added">Recently Added</option>
                <option value="lowest_rent">Lowest Rent</option>
                <option value="highest_rent">Highest Rent</option>
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'none' }}
              id="mobile-filter-btn"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Property Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }} className="rooms-layout">
          {/* Filter Sidebar */}
          <aside className={`filter-sidebar ${showMobileFilters ? 'open' : ''}`}>
            <form onSubmit={applyFilters} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Filter size={18} /> Filters
                </span>
                <button
                  type="button"
                  onClick={resetFilters}
                  style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <RotateCcw size={13} /> Reset
                </button>
              </div>

              {/* Keyword Search */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Keyword / Property</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search title, rules..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* City */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Bengaluru, Pune"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              {/* Locality */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Locality / Area</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Koramangala, Hitec City"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                />
              </div>

              {/* Monthly Rent Range */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Monthly Rent (₹)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min"
                    value={minRent}
                    onChange={(e) => setMinRent(e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max"
                    value={maxRent}
                    onChange={(e) => setMaxRent(e.target.value)}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.categoryName}</option>
                  ))}
                </select>
              </div>

              {/* Room Type */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Room Type</label>
                <select
                  className="form-control"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="SINGLE_ROOM">Single Room</option>
                  <option value="DOUBLE_ROOM">Double Room</option>
                  <option value="SHARED_ROOM">Shared Room</option>
                  <option value="STUDIO_APARTMENT">Studio Apartment</option>
                  <option value="ONE_BHK">1 BHK</option>
                  <option value="TWO_BHK">2 BHK</option>
                  <option value="PG">PG</option>
                </select>
              </div>

              {/* Furnishing */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Furnishing</label>
                <select
                  className="form-control"
                  value={furnishingStatus}
                  onChange={(e) => setFurnishingStatus(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="FULLY_FURNISHED">Fully Furnished</option>
                  <option value="SEMI_FURNISHED">Semi Furnished</option>
                  <option value="UNFURNISHED">Unfurnished</option>
                </select>
              </div>

              {/* Gender Preference */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Gender / Occupancy</label>
                <select
                  className="form-control"
                  value={genderPreference}
                  onChange={(e) => setGenderPreference(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="MALE_ONLY">Male Only</option>
                  <option value="FEMALE_ONLY">Female Only</option>
                  <option value="FAMILY_ONLY">Family Only</option>
                </select>
              </div>

              {/* Facilities Checklist */}
              {facilities.length > 0 && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Amenities / Facilities</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
                    {facilities.map((f) => (
                      <label key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedFacilities.includes(f.id)}
                          onChange={() => toggleFacility(f.id)}
                        />
                        <span>{f.facilityName}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply Button */}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Apply Filters
              </button>
            </form>
          </aside>

          {/* Listings Container */}
          <main>
            {loading ? (
              <LoadingSpinner message="Searching rental rooms..." />
            ) : properties.length === 0 ? (
              <EmptyState
                title="No rooms match your filters"
                description="Try broadening your rent range or clearing some amenity requirements."
                action={
                  <button onClick={resetFilters} className="btn btn-outline btn-sm">
                    Clear All Filters
                  </button>
                }
              />
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>

                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        className={`btn btn-sm ${currentPage === idx ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setCurrentPage(idx)}
                      >
                        {idx + 1}
                      </button>
                    ))}

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={currentPage >= totalPages - 1}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .rooms-layout {
            grid-template-columns: 1fr !important;
          }
          #mobile-filter-btn {
            display: inline-flex !important;
          }
          .filter-sidebar {
            display: none;
          }
          .filter-sidebar.open {
            display: block !important;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RoomsPage;
