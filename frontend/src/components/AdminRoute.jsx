import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccountSuspendedScreen from './AccountSuspendedScreen';

const AdminRoute = ({ children }) => {
  const { user, isAdmin, isSuspended, suspendedReason, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="route-loading">Verifying administrative access...</div>;
  }

  if (user && isSuspended) {
    return (
      <AccountSuspendedScreen
        reason={suspendedReason}
        onLogout={() => {
          logout();
          navigate('/login', { replace: true });
        }}
      />
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;

