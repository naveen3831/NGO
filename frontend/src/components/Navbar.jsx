import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Menu, X, LogOut, Shield } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const { user, isAdmin, isMember, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Activities', path: '/activities' },
    { label: 'Awareness Programs', path: '/awareness' },
    { label: 'Events', path: '/events' },
    { label: 'Announcements', path: '/announcements' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="eco-header">
      <div className="container eco-nav-container">
        {/* Brand Logo with Vertical Divider */}
        <div className="eco-brand-wrap">
          <Link to="/" className="eco-brand-link" onClick={() => setMobileMenuOpen(false)}>
            <Logo variant="dark" size={38} />
          </Link>
          <span className="eco-nav-divider">|</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="eco-desktop-nav">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`eco-nav-link ${active ? 'active-pill' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Action: Member Login Pill */}
        <div className="eco-header-actions">
          {user ? (
            <div className="eco-user-actions">
              <Link
                to={isAdmin ? '/admin' : '/member'}
                className="btn-eco-member-login"
                title={isAdmin ? 'Administrator Dashboard' : 'Member Portal'}
              >
                {isAdmin ? <Shield size={16} /> : <User size={16} />}
                <span>{isAdmin ? 'Admin Dashboard' : `Hi, ${user.name.split(' ')[0]}`}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn-eco-logout"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-eco-member-login">
              <User size={16} />
              <span>Member Login</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="eco-mobile-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="eco-mobile-drawer">
          <div className="container eco-mobile-inner">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`eco-mobile-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="eco-mobile-action-wrap">
              {user ? (
                <>
                  <Link
                    to={isAdmin ? '/admin' : '/member'}
                    className="btn-eco-member-login btn-block text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {isAdmin ? 'Open Admin Console' : 'Open Member App'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-eco-logout-block mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn-eco-member-login btn-block text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={16} />
                  <span>Member Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
