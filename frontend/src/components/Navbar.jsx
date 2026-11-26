import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  ChevronDown,
  Info,
  Target,
  Star,
  Brush,
  Sprout,
  Waves,
  Users,
  BookOpen,
  Calendar,
  Clock,
  Megaphone,
  FileText,
  Shield,
  LogOut,
  Menu,
  X,
  User,
  MapPin,
  Phone,
  Mail,
  Image as ImageIcon,
} from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const { user, isAdmin, isMember, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleMouseEnter = (label) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navMenuItems = [
    {
      label: 'Home',
      path: '/',
      icon: Home,
    },
    {
      label: 'About Us',
      path: '/about',
    },
    {
      label: 'Activities',
      path: '/activities',
    },
    {
      label: 'Events',
      path: '/events',
      icon: Calendar,
    },
    {
      label: 'Gallery',
      path: '/gallery',
      icon: ImageIcon,
    },
    {
      label: 'Announcements',
      path: '/announcements',
      icon: Megaphone,
    },
    {
      label: 'Contact Us',
      path: '/contact',
    },
  ];

  const isCurrentActive = (item) => {
    if (item.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.path);
  };

  return (
    <header className="eco-header">
      <div className="eco-nav-container">
        {/* Brand Logo */}
        <div className="eco-brand-wrap">
          <Link to="/" className="eco-brand-link" onClick={() => setMobileMenuOpen(false)}>
            <Logo variant="dark" size={44} />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="eco-desktop-nav">
          {navMenuItems.map((item) => {
            const ItemIcon = item.icon;
            const active = isCurrentActive(item);

            if (item.hasDropdown) {
              const isOpen = activeDropdown === item.label;

              return (
                <div
                  key={item.label}
                  className={`eco-nav-dropdown-wrapper ${isOpen ? 'open' : ''}`}
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={item.path}
                    className={`eco-nav-link ${active ? 'active' : ''}`}
                  >
                    {ItemIcon && <ItemIcon size={14} className="eco-nav-item-icon" />}
                    <span>{item.label}</span>
                  </Link>

                  {/* Dropdown Card */}
                  <div className={`eco-nav-dropdown-menu ${isOpen ? 'visible' : ''}`}>
                    {item.children.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.label}
                          to={sub.path}
                          className="eco-dropdown-item"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <span className="eco-drop-icon-wrap">
                            <SubIcon size={13} />
                          </span>
                          <span className="eco-drop-item-text">{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`eco-nav-link ${active ? 'active' : ''}`}
              >
                {ItemIcon && <ItemIcon size={14} className="eco-nav-item-icon" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Action: Join Us Pill */}
        <div className="eco-header-actions">
          {user && isAdmin ? (
            <div className="eco-user-actions">
              <Link to="/admin" className="btn-eco-join-pill" title="Go to Admin Dashboard">
                <Shield size={14} />
                <span>Admin Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn-eco-logout"
                title="Sign Out"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : user && isMember ? (
            <div className="eco-user-actions">
              <Link to="/member" className="btn-eco-join-pill" title="Member Portal">
                <User size={14} />
                <span>Member Portal</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn-eco-logout"
                title="Sign Out"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <div className="eco-guest-actions">
              <Link to="/register" className="btn-eco-join-pill">
                <span>Join Us</span>
              </Link>
              <Link to="/login" className="btn-eco-login-outline">
                <span>Login</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="eco-mobile-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="eco-mobile-drawer">
          <div className="container eco-mobile-inner">
            <Link
              to="/"
              className={`eco-mobile-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home size={16} />
              <span>Home</span>
            </Link>

            {navMenuItems
              .filter((i) => i.path !== '/')
              .map((item) => (
                <div key={item.label} className="eco-mobile-nav-group">
                  <Link
                    to={item.path}
                    className={`eco-mobile-link ${isCurrentActive(item) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                  </Link>

                  {item.hasDropdown && (
                    <div className="eco-mobile-sub-list">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.path}
                          className="eco-mobile-sub-link"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

            <div className="eco-mobile-action-wrap">
              {user && isAdmin ? (
                <Link
                  to="/admin"
                  className="btn-eco-join-pill btn-block text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield size={16} />
                  <span>Admin Dashboard</span>
                </Link>
              ) : user && isMember ? (
                <>
                  <Link
                    to="/member"
                    className="btn-eco-join-pill btn-block text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={16} />
                    <span>Open Member Portal</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-eco-logout-block mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <Link
                    to="/register"
                    className="btn-eco-join-pill btn-block text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Users size={16} />
                    <span>Join Us</span>
                  </Link>
                  <Link
                    to="/login"
                    className="btn-eco-login-outline btn-block text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Member Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;