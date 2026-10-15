import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Compass, User, LogOut, LayoutDashboard, Menu, X, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, isAuthenticated, logout, isTenant, isOwner, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isOwner) return '/owner/dashboard';
    return '/tenant/dashboard';
  };

  return (
    <nav style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--primary)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Home size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Rental<span style={{ color: 'var(--primary)' }}>Rooms</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'none', mdDisplay: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-links">
          <Link to="/" style={{ fontWeight: 600, color: '#475569', transition: 'var(--transition)' }}>Home</Link>
          <Link to="/rooms" style={{ fontWeight: 600, color: '#475569', transition: 'var(--transition)' }}>Browse Rooms</Link>
          <Link to="/about" style={{ fontWeight: 600, color: '#475569', transition: 'var(--transition)' }}>About</Link>
          <Link to="/contact" style={{ fontWeight: 600, color: '#475569', transition: 'var(--transition)' }}>Contact</Link>
        </div>

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              {isOwner && (
                <Link to="/owner/properties/new" className="btn btn-outline btn-sm" style={{ display: 'none', mdDisplay: 'inline-flex' }}>
                  <PlusCircle size={16} /> Post Room
                </Link>
              )}

              <NotificationBell />

              <Link to={getDashboardPath()} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>

              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: '0.5rem', color: '#334155', display: 'flex', alignItems: 'center' }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: '#334155' }}>Home</Link>
          <Link to="/rooms" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: '#334155' }}>Browse Rooms</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: '#334155' }}>About</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: '#334155' }}>Contact</Link>
          {isAuthenticated && (
            <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--primary)' }}>My Dashboard</Link>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-links { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
