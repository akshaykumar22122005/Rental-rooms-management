import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import RoomsPage from '../pages/public/RoomsPage';
import RoomDetailsPage from '../pages/public/RoomDetailsPage';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Tenant Pages
import TenantDashboardPage from '../pages/tenant/TenantDashboardPage';
import SavedRoomsPage from '../pages/tenant/SavedRoomsPage';
import MyRequestsPage from '../pages/tenant/MyRequestsPage';
import TenantReviewsPage from '../pages/tenant/TenantReviewsPage';
import TenantProfilePage from '../pages/tenant/TenantProfilePage';

// Owner Pages
import OwnerDashboardPage from '../pages/owner/OwnerDashboardPage';
import MyPropertiesPage from '../pages/owner/MyPropertiesPage';
import AddEditPropertyPage from '../pages/owner/AddEditPropertyPage';
import OwnerRequestsPage from '../pages/owner/OwnerRequestsPage';
import OwnerReviewsPage from '../pages/owner/OwnerReviewsPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ManageUsersPage from '../pages/admin/ManageUsersPage';
import ManagePropertiesPage from '../pages/admin/ManagePropertiesPage';
import ManageCategoriesPage from '../pages/admin/ManageCategoriesPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminRequestsView from '../pages/admin/AdminRequestsView';
import AdminReviewsView from '../pages/admin/AdminReviewsView';

// Reusable
import NotificationsView from '../components/NotificationsView';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooms/:id" element={<RoomDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Tenant Protected Dashboard */}
      <Route
        path="/tenant"
        element={
          <ProtectedRoute allowedRoles={['ROLE_TENANT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<TenantDashboardPage />} />
        <Route path="saved" element={<SavedRoomsPage />} />
        <Route path="requests" element={<MyRequestsPage />} />
        <Route path="notifications" element={<NotificationsView />} />
        <Route path="reviews" element={<TenantReviewsPage />} />
        <Route path="profile" element={<TenantProfilePage />} />
      </Route>

      {/* Landlord / Owner Protected Dashboard */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRoles={['ROLE_OWNER', 'ROLE_ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<OwnerDashboardPage />} />
        <Route path="properties" element={<MyPropertiesPage />} />
        <Route path="properties/new" element={<AddEditPropertyPage />} />
        <Route path="properties/:id/edit" element={<AddEditPropertyPage />} />
        <Route path="requests" element={<OwnerRequestsPage />} />
        <Route path="reviews" element={<OwnerReviewsPage />} />
        <Route path="notifications" element={<NotificationsView />} />
        <Route path="profile" element={<TenantProfilePage />} />
      </Route>

      {/* Super Admin Protected Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<ManageUsersPage />} />
        <Route path="properties" element={<ManagePropertiesPage />} />
        <Route path="categories" element={<ManageCategoriesPage />} />
        <Route path="requests" element={<AdminRequestsView />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="reviews" element={<AdminReviewsView />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
