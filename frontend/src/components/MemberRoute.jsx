import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MemberRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="route-loading">Verifying member authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/member/login" replace />;
  }

  return children;
};

export default MemberRoute;

