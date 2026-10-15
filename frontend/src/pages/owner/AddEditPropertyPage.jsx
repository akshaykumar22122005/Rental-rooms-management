import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Building, Upload, Plus, Trash2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { propertyApi, categoryApi, facilityApi } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';

const AddEditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [categories, setCategories] = useState([]);
  const [facilitiesList, setFacilitiesList] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    city: '',
    locality: '',
    fullAddress: '',
    monthlyRent: '',
    securityDeposit: '',
    maintenanceCharges: '0',
    electricityCharges: 'As per sub-meter',
    roomType: 'ONE_BHK',
    furnishingStatus: 'FULLY_FURNISHED',
    availableRooms: 1,
    genderPreference: 'ANY',
    availabilityStatus: 'AVAILABLE',
    houseRules: '',
    facilityIds: [],
    imageUrls: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'],
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const [catRes, facRes] = await Promise.all([
          categoryApi.getAll(),
          facilityApi.getAll(),
        ]);
        setCategories(catRes.data || []);
        setFacilitiesList(facRes.data || []);

        if (isEditing) {
          const propRes = await propertyApi.getById(id);
          const p = propRes.data;
          setFormData({
            title: p.title || '',
            description: p.description || '',
            categoryId: p.categoryId || '',
            city: p.city || '',
            locality: p.locality || '',
            fullAddress: p.fullAddress || '',
            monthlyRent: p.monthlyRent || '',
            securityDeposit: p.securityDeposit || '',
            maintenanceCharges: p.maintenanceCharges || '0',
            electricityCharges: p.electricityCharges || '',
            roomType: p.roomType || 'ONE_BHK',
            furnishingStatus: p.furnishingStatus || 'FULLY_FURNISHED',
            availableRooms: p.availableRooms || 1,
            genderPreference: p.genderPreference || 'ANY',
            availabilityStatus: p.availabilityStatus || 'AVAILABLE',
            houseRules: p.houseRules || '',
            facilityIds: (p.facilities || []).map((f) => f.id),
            imageUrls: p.images && p.images.length > 0 ? p.images : [],
          });
        } else if (catRes.data && catRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
        }
      } catch (err) {
        console.error('Failed to initialize property form:', err);
        setError('Failed to load form details');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFacilityToggle = (facId) => {
    setFormData((prev) => ({
      ...prev,
      facilityIds: prev.facilityIds.includes(facId)
        ? prev.facilityIds.filter((item) => item !== facId)
        : [...prev.facilityIds, facId],
    }));
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, idx) => idx !== index),
    }));
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      const data = new FormData();
      for (let i = 0; i < files.length; i++) {
        data.append('files', files[i]);
      }
      const res = await propertyApi.uploadImages(data);
      if (res.data) {
        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...res.data],
        }));
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.city || !formData.fullAddress || !formData.monthlyRent) {
      setError('Please fill in all mandatory fields');
      return;
    }

    try {
      setSaving(true);
      setError('');
      if (isEditing) {
        await propertyApi.update(id, formData);
      } else {
        await propertyApi.create(formData);
      }
      navigate('/owner/properties');
    } catch (err) {
      setError(err.message || 'Failed to save property listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading property form..." />;

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/owner/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to My Properties
        </Link>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
          {isEditing ? 'Edit Rental Room Listing' : 'Add New Rental Room Listing'}
        </h1>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Section 1: Basic Info */}
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>
            1. Basic Property Information
          </h3>

          <div className="form-group">
            <label className="form-label">Property Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Spacious 1 BHK Apartment near Metro Station"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="categoryId" className="form-control" value={formData.categoryId} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.categoryName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Room Type *</label>
              <select name="roomType" className="form-control" value={formData.roomType} onChange={handleChange} required>
                <option value="SINGLE_ROOM">Single Room</option>
                <option value="DOUBLE_ROOM">Double Room</option>
                <option value="SHARED_ROOM">Shared Room</option>
                <option value="STUDIO_APARTMENT">Studio Apartment</option>
                <option value="ONE_BHK">1 BHK</option>
                <option value="TWO_BHK">2 BHK</option>
                <option value="PG">PG</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Furnishing Status *</label>
              <select name="furnishingStatus" className="form-control" value={formData.furnishingStatus} onChange={handleChange} required>
                <option value="FULLY_FURNISHED">Fully Furnished</option>
                <option value="SEMI_FURNISHED">Semi Furnished</option>
                <option value="UNFURNISHED">Unfurnished</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows={4}
              placeholder="Highlight special features, nearby landmarks, security, sunlight..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Section 2: Location */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>
            2. Location & Address
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                className="form-control"
                placeholder="e.g. Bengaluru"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Locality / Area *</label>
              <input
                type="text"
                name="locality"
                className="form-control"
                placeholder="e.g. Koramangala"
                value={formData.locality}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Address *</label>
            <input
              type="text"
              name="fullAddress"
              className="form-control"
              placeholder="Door number, building name, street, pincode"
              value={formData.fullAddress}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Section 3: Pricing & Deposit */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>
            3. Pricing & Charges
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Monthly Rent (₹) *</label>
              <input
                type="number"
                name="monthlyRent"
                className="form-control"
                placeholder="15000"
                value={formData.monthlyRent}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Security Deposit (₹) *</label>
              <input
                type="number"
                name="securityDeposit"
                className="form-control"
                placeholder="30000"
                value={formData.securityDeposit}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Maintenance Charges (₹)</label>
              <input
                type="number"
                name="maintenanceCharges"
                className="form-control"
                placeholder="0"
                value={formData.maintenanceCharges}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available Rooms</label>
              <input
                type="number"
                name="availableRooms"
                className="form-control"
                min={1}
                value={formData.availableRooms}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Electricity Charges Description</label>
              <input
                type="text"
                name="electricityCharges"
                className="form-control"
                placeholder="e.g. As per sub-meter ₹8/unit"
                value={formData.electricityCharges}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Occupancy / Gender Preference</label>
              <select name="genderPreference" className="form-control" value={formData.genderPreference} onChange={handleChange}>
                <option value="ANY">Any (No preference)</option>
                <option value="MALE_ONLY">Male Only</option>
                <option value="FEMALE_ONLY">Female Only</option>
                <option value="FAMILY_ONLY">Family Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Facilities & Amenities */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>
            4. Available Amenities & Facilities
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem' }}>
            {facilitiesList.map((f) => (
              <label key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px', backgroundColor: formData.facilityIds.includes(f.id) ? '#eff6ff' : '#f8fafc' }}>
                <input
                  type="checkbox"
                  checked={formData.facilityIds.includes(f.id)}
                  onChange={() => handleFacilityToggle(f.id)}
                />
                <span>{f.facilityName}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 5: House Rules */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>
            5. House Rules & Policies
          </h3>
          <div className="form-group">
            <textarea
              name="houseRules"
              className="form-control"
              rows={3}
              placeholder="e.g. Smoking strictly prohibited indoors, quiet hours after 10:30 PM, visitors allowed..."
              value={formData.houseRules}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Section 6: Photos & Images */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>
            6. Property Images
          </h3>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {/* File upload input */}
            <div>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                <Upload size={16} /> Upload Local Image Files
                <input type="file" multiple accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
              {uploadingImage && <span style={{ fontSize: '0.8rem', color: 'var(--primary)', marginLeft: '0.5rem' }}>Uploading...</span>}
            </div>

            {/* Add Image URL */}
            <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
              <input
                type="url"
                className="form-control"
                placeholder="Or paste image URL (https://...)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <button type="button" onClick={handleAddImageUrl} className="btn btn-secondary btn-sm">
                <Plus size={16} /> Add
              </button>
            </div>
          </div>

          {/* Image Previews */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {formData.imageUrls.map((url, idx) => (
              <div key={idx} style={{ position: 'relative', width: '130px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img src={url} alt="Room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    backgroundColor: 'rgba(239, 68, 68, 0.9)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Remove image"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Link to="/owner/properties" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? 'Saving Property...' : isEditing ? 'Save Changes' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditPropertyPage;
