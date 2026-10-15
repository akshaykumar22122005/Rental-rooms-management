import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const loggedInUser = await login(email, password);

      if (redirectPath) {
        navigate(redirectPath);
      } else if (loggedInUser.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (loggedInUser.role === 'ROLE_OWNER') {
        navigate('/owner/dashboard');
      } else {
        navigate('/tenant/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Shortcut Logins
  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    // Auto submit
    setTimeout(async () => {
      try {
        setLoading(true);
        const loggedInUser = await login(demoEmail, demoPassword);
        if (loggedInUser.role === 'ROLE_ADMIN') navigate('/admin/dashboard');
        else if (loggedInUser.role === 'ROLE_OWNER') navigate('/owner/dashboard');
        else navigate('/tenant/dashboard');
      } catch (err) {
        setError(err.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    }, 50);
  };

  return (
    <div style={{ padding: '3.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <Lock size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Sign in to manage your room listings or bookings
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span> : <LogIn size={18} />}
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Demo Credentials Quick-Fill Buttons */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <Sparkles size={14} color="#f59e0b" /> Demo 1-Click Login Shortcuts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('tenant@rentalrooms.com', 'Tenant@12345')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', fontSize: '0.8rem' }}
            >
              <span>🔑 Tenant (Priya Patel)</span>
              <span style={{ color: 'var(--text-muted)' }}>Tenant@12345</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('owner@rentalrooms.com', 'Owner@12345')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', fontSize: '0.8rem' }}
            >
              <span>🏠 Landlord (Rajesh Sharma)</span>
              <span style={{ color: 'var(--text-muted)' }}>Owner@12345</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@rentalrooms.com', 'Admin@12345')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', fontSize: '0.8rem' }}
            >
              <span>🛡️ Super Admin</span>
              <span style={{ color: 'var(--text-muted)' }}>Admin@12345</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
