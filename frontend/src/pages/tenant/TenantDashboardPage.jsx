import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Heart, Bell, Star, Compass, ArrowRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { requestApi, wishlistApi, notificationApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const TenantDashboardPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [reqRes, wishRes, notifRes] = await Promise.all([
          requestApi.getMyRequests(),
          wishlistApi.getAll(),
          notificationApi.getAll()
        ]);
        setRequests(reqRes.data || []);
        setWishlistCount((wishRes.data || []).length);
        setUnreadNotifications(notifRes.data?.unreadCount || 0);
      } catch (err) {
        console.error('Failed to load tenant dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;

  const pendingRequests = requests.filter((r) => r.status === 'PENDING').length;
  const acceptedRequests = requests.filter((r) => r.status === 'ACCEPTED').length;

  return (
    <div>
      {/* Welcome Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          Welcome, {user?.fullName}! 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Track your rental applications, saved rooms, and landlord responses
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL REQUESTS</span>
            <CalendarCheck size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{requests.length}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>PENDING INQUIRIES</span>
            <Clock size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{pendingRequests}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>ACCEPTED</span>
            <CheckCircle2 size={20} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{acceptedRequests}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #ec4899' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>SAVED ROOMS</span>
            <Heart size={20} color="#ec4899" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{wishlistCount}</div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        <Link to="/rooms" className="btn btn-primary btn-sm">
          <Compass size={16} /> Browse Rental Rooms
        </Link>
        <Link to="/tenant/saved" className="btn btn-secondary btn-sm">
          <Heart size={16} /> View Saved Rooms ({wishlistCount})
        </Link>
        <Link to="/tenant/requests" className="btn btn-secondary btn-sm">
          <CalendarCheck size={16} /> View All Applications
        </Link>
      </div>

      {/* Recent Requests Section */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
            Recent Rental Requests
          </h2>
          <Link to="/tenant/requests" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <span>See all</span> <ArrowRight size={14} />
          </Link>
        </div>

        {requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>You haven't submitted any rental requests yet.</p>
            <Link to="/rooms" className="btn btn-primary btn-sm">
              Explore Rooms Now
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Location</th>
                  <th>Move-In Date</th>
                  <th>Monthly Rent</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 5).map((req) => (
                  <tr key={req.id}>
                    <td style={{ fontWeight: 600 }}>{req.propertyTitle}</td>
                    <td>{req.propertyLocality}, {req.propertyCity}</td>
                    <td>{new Date(req.proposedMoveInDate).toLocaleDateString()}</td>
                    <td>₹{req.propertyRent?.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${
                        req.status === 'ACCEPTED' ? 'badge-success' :
                        req.status === 'REJECTED' ? 'badge-danger' :
                        req.status === 'CANCELLED' ? 'badge-neutral' : 'badge-warning'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/rooms/${req.propertyId}`} className="btn btn-outline btn-sm">
                        View Room
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboardPage;
