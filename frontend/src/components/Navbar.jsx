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
  Key,
  Compass,
  Bell,
  ArrowRight,
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
    },
    {
      label: 'Announcements',
      path: '/announcements',
    },
    {
      label: 'Initiatives',
      path: '/initiatives',
    },
    {
      label: 'About Us',
      path: '/about',
    },
    {
      label: 'Contact Us',
      path: '/contact',
    },
  ];

  const isCurrentActive = (item) => {
    if (item.path === '/') return location.pathname === '/';
    if (item.path === '/initiatives') {
      return (
        location.pathname.startsWith('/initiatives') ||
        location.pathname.startsWith('/activities') ||
        location.pathname.startsWith('/events') ||
        location.pathname.startsWith('/gallery')
      );
    }
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
            <>
              <div
                className="eco-nav-dropdown-wrapper eco-desktop-profile-dropdown"
                onMouseEnter={() => handleMouseEnter('__profile__')}
                onMouseLeave={handleMouseLeave}
              >
              <button
                type="button"
                onClick={() => setActiveDropdown((prev) => (prev === '__profile__' ? null : '__profile__'))}
                aria-label="Member Profile Menu"
                title={user?.name || 'My Profile'}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#006B3C',
                  color: '#ffffff',
                  border: '2px solid #bbf7d0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 107, 60, 0.25)',
                }}
              >
                <User size={19} />
              </button>

              <div
                className={`eco-nav-dropdown-menu ${activeDropdown === '__profile__' ? 'visible' : ''}`}
                style={{ left: 'auto', right: 0, minWidth: '220px' }}
              >
                <div style={{ padding: '0.6rem 0.9rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.25rem' }}>
                  <div style={{ fontWeight: 700, color: '#064e3b', fontSize: '0.9rem' }}>
                    {user?.name || 'Member'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {user?.memberId || 'Volunteer Member'}
                  </div>
                </div>

                <Link
                  to="/member/profile"
                  className="eco-dropdown-item"
                  onClick={() => setActiveDropdown(null)}
                >
                  <span className="eco-drop-icon-wrap"><User size={13} /></span>
                  <span className="eco-drop-item-text">My Profile</span>
                </Link>

                <Link
                  to="/member/announcements"
                  className="eco-dropdown-item"
                  onClick={() => setActiveDropdown(null)}
                >
                  <span className="eco-drop-icon-wrap"><Megaphone size={13} /></span>
                  <span className="eco-drop-item-text">Announcements</span>
                </Link>

                <Link
                  to="/member/meetings"
                  className="eco-dropdown-item"
                  onClick={() => setActiveDropdown(null)}
                >
                  <span className="eco-drop-icon-wrap"><Clock size={13} /></span>
                  <span className="eco-drop-item-text">Meetings</span>
                </Link>

                <Link
                  to="/member/profile#password"
                  className="eco-dropdown-item"
                  onClick={() => setActiveDropdown(null)}
                >
                  <span className="eco-drop-icon-wrap"><Key size={13} /></span>
                  <span className="eco-drop-item-text">Forgot Password</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDropdown(null);
                    handleLogout();
                  }}
                  className="eco-dropdown-item"
                  style={{ width: '100%', background: 'none', border: 'none', borderTop: '1px solid #f1f5f9', marginTop: '0.25rem', paddingTop: '0.6rem', color: '#dc2626', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span className="eco-drop-icon-wrap" style={{ background: '#fee2e2', color: '#dc2626' }}><LogOut size={13} /></span>
                  <span className="eco-drop-item-text" style={{ color: '#dc2626' }}>Log Out</span>
                </button>
              </div>
              </div>
              <Link
                to="/member/announcements"
                aria-label="Notifications"
                title="Notifications"
                className="eco-mobile-notif-btn"
              >
                <Bell size={19} />
              </Link>
            </>
          ) : (
            <div className="eco-guest-actions">
              <Link to="/login" className="btn-eco-login-outline">
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn-eco-join-pill">
                <span>Join Us</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;