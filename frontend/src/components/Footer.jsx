import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '4rem 0 2rem 0', marginTop: 'auto' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--primary)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Home size={20} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                Rental<span style={{ color: '#60a5fa' }}>Rooms</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#94a3b8' }}>
              The modern Rental Rooms Management System connecting accommodation seekers with verified property owners.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#f8fafc', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/" style={{ color: '#cbd5e1' }}>Home</Link></li>
              <li><Link to="/rooms" style={{ color: '#cbd5e1' }}>Browse Rooms</Link></li>
              <li><Link to="/about" style={{ color: '#cbd5e1' }}>About Us</Link></li>
              <li><Link to="/contact" style={{ color: '#cbd5e1' }}>Contact Support</Link></li>
              <li><Link to="/register" style={{ color: '#cbd5e1' }}>List Your Property</Link></li>
            </ul>
          </div>

          {/* Room Types */}
          <div>
            <h4 style={{ color: '#f8fafc', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Popular Room Types
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/rooms?roomType=STUDIO_APARTMENT" style={{ color: '#cbd5e1' }}>Studio Apartments</Link></li>
              <li><Link to="/rooms?roomType=ONE_BHK" style={{ color: '#cbd5e1' }}>1 BHK Flats</Link></li>
              <li><Link to="/rooms?roomType=TWO_BHK" style={{ color: '#cbd5e1' }}>2 BHK Flats</Link></li>
              <li><Link to="/rooms?roomType=PG" style={{ color: '#cbd5e1' }}>PG & Paying Guests</Link></li>
              <li><Link to="/rooms?roomType=SINGLE_ROOM" style={{ color: '#cbd5e1' }}>Single Private Rooms</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#f8fafc', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="#60a5fa" />
                <span>100 Tech Hub Road, Knowledge Park</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="#60a5fa" />
                <span>+91 1800 200 4567</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#60a5fa" />
                <span>support@rentalrooms.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.825rem'
        }}>
          <div>
            © {new Date().getFullYear()} Rental Rooms Management System. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>Built with Java 21, Spring Boot & React</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
