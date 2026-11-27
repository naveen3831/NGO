import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccountSuspendedScreen from './AccountSuspendedScreen';

const MemberRoute = ({ children }) => {
  const { user, membership, isSuspended, suspendedReason, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="route-loading">Verifying member authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isSuspended) {
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

  const role = user.role?.toLowerCase();
  if (role === 'member' || role === 'volunteer') {
    const mStatus = membership?.status;
    if (
      user.accountStatus === 'Pending' ||
      (mStatus && !['Active', 'Approved'].includes(mStatus))
    ) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default MemberRoute;
