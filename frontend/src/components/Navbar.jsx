import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, Menu, X, Shield, Smartphone, LogOut, User, LogIn } from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, isMember, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Cleanliness Drives', path: '/activities' },
    { label: 'Awareness', path: '/awareness' },
    { label: 'Events', path: '/events' },
    { label: 'Announcements', path: '/announcements' },
    { label: 'Contact', path: '/contact' },
    { label: 'Login', path: '/login' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="site-header">
      {/* Top Utility Strip */}
      <div className="top-utility-bar">
        <div className="container utility-content">
          <div className="utility-left">
            <span className="location-indicator">Rajahmundry, Andhra Pradesh</span>
            <span className="dot-sep">•</span>
            <span>Godhavari Nadhi Paryavarana Parishubratha</span>
          </div>
          <div className="utility-right">
            <span className="helpline-text">Helpline: +91 944 012 3456</span>
            <span className="dot-sep">•</span>
            {isAdmin ? (
              <Link to="/admin" className="portal-pill admin-pill">
                <Shield size={12} /> Admin Dashboard
              </Link>
            ) : isMember ? (
              <Link to="/member" className="portal-pill member-pill">
                <Smartphone size={12} /> Member App
              </Link>
            ) : (
              <div className="portal-quick-links">
                <Link to="/login?role=member" className="portal-quick-link">
                  Member Login
                </Link>
                <span className="dot-sep">/</span>
                <Link to="/login?role=admin" className="portal-quick-link">
                  Admin Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="main-navbar">
        <div className="container nav-wrapper">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-icon-wrap">
              <Droplet size={22} className="logo-icon" />
            </div>
            <div className="logo-text">
              <span className="brand-name">Godhavari Nadhi</span>
              <span className="brand-sub">Paryavarana Parishubratha</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="desktop-links">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="desktop-actions">
            {user ? (
              <div className="user-dropdown">
                <Link
                  to={isAdmin ? '/admin' : '/member'}
                  className="btn btn-outline btn-sm user-btn"
                >
                  <User size={15} />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-icon btn-sm" title="Logout">
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline btn-sm">
                  <LogIn size={15} /> Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Join Volunteer
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu-drawer">
            <div className="mobile-nav-links">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mobile-divider"></div>

              {user ? (
                <div className="mobile-auth-actions">
                  <Link
                    to={isAdmin ? '/admin' : '/member'}
                    className="btn btn-primary btn-block mb-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {isAdmin ? 'Open Admin Dashboard' : 'Open Member App'}
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline btn-block">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mobile-auth-actions">
                  <Link
                    to="/login"
                    className="btn btn-outline btn-block mb-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn size={15} className="inline mr-1" /> Role-Based Login (Admin / Member)
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Join as Volunteer
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
