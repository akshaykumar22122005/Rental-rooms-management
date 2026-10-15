import React from 'react';
import { ShieldCheck, Award, Users, HeartHandshake, Code, Database, Sparkles } from 'lucide-react';

const AboutPage = () => {
  return (
    <div style={{ padding: '3.5rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            About RentalRooms
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem', marginBottom: '1rem' }}>
            Simplifying Rental Accommodations
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Our platform connects individuals seeking rooms, flats, and PG accommodations directly with verified property owners across metropolitan and educational hubs.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem', marginBottom: '3.5rem' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>Zero Brokerage</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Connect directly with owners without middlemen or hidden commission fees.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>Verified Listings</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              All properties are moderated with real photographs, transparent deposit terms, and authentic amenity checklists.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <HeartHandshake size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>In-App Inquiries</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Submit proposed move-in dates and manage booking requests seamlessly with real-time status tracking.
            </p>
          </div>
        </div>

        {/* Technology Stack Card */}
        <div className="card" style={{ padding: '2rem', backgroundColor: '#f8fafc', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={22} color="var(--primary)" /> Engineering & Architecture Stack
          </h2>
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Built using industry-standard full-stack architecture adhering to modern clean-code principles:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <strong style={{ display: 'block', color: '#0f172a' }}>Frontend</strong>
              <span style={{ color: 'var(--text-muted)' }}>React.js 18, React Router, Axios, Responsive CSS</span>
            </div>
            <div>
              <strong style={{ display: 'block', color: '#0f172a' }}>Backend</strong>
              <span style={{ color: 'var(--text-muted)' }}>Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA</span>
            </div>
            <div>
              <strong style={{ display: 'block', color: '#0f172a' }}>Security</strong>
              <span style={{ color: 'var(--text-muted)' }}>JWT (JSON Web Token), BCrypt hashing, Role-Based Access Control</span>
            </div>
            <div>
              <strong style={{ display: 'block', color: '#0f172a' }}>Database</strong>
              <span style={{ color: 'var(--text-muted)' }}>MySQL 8.0, Relational integrity, Indexes, Constraints</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
