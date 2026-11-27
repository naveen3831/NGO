import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext();

const checkAccountSuspended = (u, m, flag) => {
  if (flag === true) return true;
  if (!u || u.email === 'admin@gmail.com') return false;
  return Boolean(
    u.isActive === false ||
      u.accountStatus?.toLowerCase() === 'inactive' ||
      m?.status === 'Suspended'
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const [suspendedOverride, setSuspendedOverride] = useState(false);
  const [suspendedReason, setSuspendedReason] = useState('');
  const [loading, setLoading] = useState(true);

  const syncFromMeResponse = useCallback((data) => {
    if (!data?.user) return;
    setUser(data.user);
    setMembership(data.membership || null);
    localStorage.setItem('userInfo', JSON.stringify(data.user));
    const suspended = checkAccountSuspended(data.user, data.membership, data.isSuspended);
    setSuspendedOverride(suspended);
    setSuspendedReason(
      suspended ? data.membership?.remarks || data.user.accessReason || '' : ''
    );
  }, []);

  // Load stored credentials on boot
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('userInfo');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const { data } = await API.get('/auth/me');
          syncFromMeResponse(data);
        } catch (err) {
          console.warn('Session expired or network issue:', err.message);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [syncFromMeResponse]);

  // Refresh profile & membership
  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const { data } = await API.get('/auth/me');
      syncFromMeResponse(data);
    } catch (err) {
      if (err.response?.status === 401) {
        setUser(null);
        setMembership(null);
        setSuspendedOverride(false);
        setSuspendedReason('');
      } else {
        console.error('Failed to refresh profile:', err);
      }
    }
  }, [syncFromMeResponse]);

  // Keep active non-root sessions synced with real-time admin suspension / reactivation
  useEffect(() => {
    if (!user || user.email === 'admin@gmail.com') return undefined;

    const handleSuspendedEvent = (e) => {
      setSuspendedOverride(true);
      if (e.detail?.reason) {
        setSuspendedReason(e.detail.reason);
      }
      refreshProfile();
    };

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        refreshProfile();
      }
    };

    window.addEventListener('ngo:account-suspended', handleSuspendedEvent);
    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    const pollTimer = setInterval(refreshProfile, 5000);

    return () => {
      window.removeEventListener('ngo:account-suspended', handleSuspendedEvent);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      clearInterval(pollTimer);
    };
  }, [user?._id, user?.email, refreshProfile]);

  // Admin login handler
  const adminLogin = async (email, password) => {
    const { data } = await API.post('/auth/admin/login', { email, password });
    setUser(data);
    setSuspendedOverride(false);
    setSuspendedReason('');
    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    return data;
  };

  // Member login handler (supports Email, Member ID, or Phone)
  const memberLogin = async (identifier, password) => {
    const { data } = await API.post('/auth/member/login', { identifier, password });
    setUser(data);
    setMembership(data.membership || null);
    setSuspendedOverride(false);
    setSuspendedReason('');
    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    return data;
  };

  // Member / Volunteer registration (requires admin approval before login)
  const registerMember = async (formData) => {
    const { data } = await API.post('/auth/register', formData);
    return data;
  };

  // Update logged-in user's portrait image across session & components
  const updateAvatar = async (avatarDataUrl) => {
    const { data } = await API.patch('/auth/avatar', { avatar: avatarDataUrl });
    setUser((prev) => {
      const next = { ...(prev || {}), ...(data.user || {}), avatar: data.avatar ?? avatarDataUrl };
      localStorage.setItem('userInfo', JSON.stringify(next));
      return next;
    });
    return data;
  };

  // Logout
  const logout = () => {
    setUser(null);
    setMembership(null);
    setSuspendedOverride(false);
    setSuspendedReason('');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
  };

  const isSuspended = checkAccountSuspended(user, membership, suspendedOverride);

  return (
    <AuthContext.Provider
      value={{
        user,
        membership,
        isSuspended,
        suspendedReason,
        isAdmin: Boolean(
          user &&
          !isSuspended &&
          (user.role?.toLowerCase() === 'admin' ||
            user.role?.toLowerCase() === 'super admin' ||
            user.role?.toLowerCase() === 'super_admin')
        ),
        isMember: Boolean(
          user &&
          ['member', 'volunteer', 'staff', 'general volunteer', 'general_volunteer'].includes(
            user.role?.toLowerCase()
          )
        ),
        loading,
        adminLogin,
        memberLogin,
        registerMember,
        refreshProfile,
        updateAvatar,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
