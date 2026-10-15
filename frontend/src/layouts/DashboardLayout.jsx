import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Heart,
  CalendarCheck,
  Bell,
  Star,
  User,
  LogOut,
  Building,
  PlusCircle,
  Users,
  Layers,
  Flag,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  const { user, logout, isTenant, isOwner, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tenantLinks = [
    { name: 'Overview', path: '/tenant/dashboard', icon: LayoutDashboard },
    { name: 'Browse Rooms', path: '/rooms', icon: Compass },
    { name: 'Saved Rooms', path: '/tenant/saved', icon: Heart },
    { name: 'My Rental Requests', path: '/tenant/requests', icon: CalendarCheck },
    { name: 'Notifications', path: '/tenant/notifications', icon: Bell },
    { name: 'My Reviews', path: '/tenant/reviews', icon: Star },
    { name: 'My Profile', path: '/tenant/profile', icon: User },
  ];

  const ownerLinks = [
    { name: 'Overview', path: '/owner/dashboard', icon: LayoutDashboard },
    { name: 'My Properties', path: '/owner/properties', icon: Building },
    { name: 'Add Property', path: '/owner/properties/new', icon: PlusCircle },
    { name: 'Rental Requests', path: '/owner/requests', icon: CalendarCheck },
    { name: 'Reviews', path: '/owner/reviews', icon: Star },
    { name: 'Notifications', path: '/owner/notifications', icon: Bell },
    { name: 'My Profile', path: '/owner/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Manage Properties', path: '/admin/properties', icon: Building },
    { name: 'Rental Categories', path: '/admin/categories', icon: Layers },
    { name: 'Rental Requests', path: '/admin/requests', icon: CalendarCheck },
    { name: 'Reported Listings', path: '/admin/reports', icon: Flag },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
  ];

  const links = isAdmin ? adminLinks : isOwner ? ownerLinks : tenantLinks;
  const roleTitle = isAdmin ? 'Super Admin' : isOwner ? 'Property Owner' : 'Room Seeker';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navbar />

      <div className="container" style={{ display: 'flex', flex: 1, padding: '2rem 1.5rem', gap: '2rem' }}>
        {/* Sidebar */}
        <aside style={{ width: '260px', flexShrink: 0 }} className="dashboard-sidebar">
          <div className="card" style={{ padding: '1.25rem', position: 'sticky', top: '90px' }}>
            {/* User Profile Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              paddingBottom: '1.25rem',
              marginBottom: '1rem',
              borderBottom: '1px solid var(--border)'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem'
              }}>
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.fullName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {roleTitle}
                </div>
              </div>
            </div>

            {/* Nav list */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {links.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path.endsWith('/dashboard')}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.625rem 0.875rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--primary)' : '#475569',
                      backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                      transition: 'var(--transition)'
                    })}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--danger)',
                  marginTop: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '1rem',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <section style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </section>
      </div>

      <style>{`
        @media (max-width: 868px) {
          .dashboard-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
