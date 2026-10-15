import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to their appropriate home dashboard
    if (user?.role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'ROLE_OWNER') return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/tenant/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
