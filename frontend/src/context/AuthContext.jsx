import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load stored credentials on boot
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('userInfo');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const { data } = await API.get('/auth/me');
          if (data.user) {
            setUser(data.user);
            setMembership(data.membership || null);
            localStorage.setItem('userInfo', JSON.stringify(data.user));
          }
        } catch (err) {
          console.warn('Session expired or network issue:', err.message);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Admin login handler
  const adminLogin = async (email, password) => {
    const { data } = await API.post('/auth/admin/login', { email, password });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    return data;
  };

  // Member login handler (supports Email, Member ID, or Phone)
  const memberLogin = async (identifier, password) => {
    const { data } = await API.post('/auth/member/login', { identifier, password });
    setUser(data);
    setMembership(data.membership || null);
    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    return data;
  };

  // Member registration
  const registerMember = async (formData) => {
    const { data } = await API.post('/auth/register', formData);
    setUser(data);
    setMembership(data.membership || null);
    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    return data;
  };

  // Refresh profile & membership
  const refreshProfile = async () => {
    try {
      const { data } = await API.get('/auth/me');
      if (data.user) {
        setUser(data.user);
        setMembership(data.membership || null);
        localStorage.setItem('userInfo', JSON.stringify(data.user));
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setMembership(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        membership,
        isAdmin: user?.role === 'admin',
        isMember: ['member', 'volunteer', 'staff'].includes(user?.role),
        loading,
        adminLogin,
        memberLogin,
        registerMember,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
