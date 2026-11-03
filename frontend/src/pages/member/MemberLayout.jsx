import React from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  CreditCard,
  Calendar,
  Clock,
  Bell,
  User,
  LogOut,
  Droplet,
  Globe,
} from 'lucide-react';

const MemberLayout = () => {
  const { user, membership, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/member/login');
  };

  const navItems = [
    { label: 'Home', path: '/member', icon: Home, end: true },
    { label: 'My Card', path: '/member/card', icon: CreditCard },
    { label: 'Drives', path: '/member/drives', icon: Calendar },
    { label: 'Meetings', path: '/member/meetings', icon: Clock },
    { label: 'Notices', path: '/member/announcements', icon: Bell },
    { label: 'Profile', path: '/member/profile', icon: User },
  ];

  return (
    <div className="member-app-container">
      {/* Mobile Device Frame */}
      <div className="mobile-phone-frame">
        {/* App Top Bar */}
        <header className="member-app-header">
          <div className="app-header-left">
            <div className="app-logo-badge">
              <Droplet size={18} className="text-white" />
            </div>
            <div>
              <h1 className="app-header-title">Godhavari Parishubratha</h1>
              <p className="app-header-sub">Member Mobile App</p>
            </div>
          </div>
          <div className="app-header-right">
            <Link to="/" title="Exit to Public Website" className="header-icon-btn">
              <Globe size={16} />
            </Link>
            <button onClick={handleLogout} title="Sign Out" className="header-icon-btn">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Member Status Pill Banner */}
        <div className="member-quick-status-bar">
          <div className="status-pill-left">
            <span className="dot dot-active"></span>
            <span>ID: <strong>{user?.memberId || 'GNPP-MEMBER'}</strong></span>
          </div>
          <div className="status-pill-right">
            <span className="membership-tier-badge">
              {membership?.membershipType || 'Active Member'}
            </span>
          </div>
        </div>

        {/* App Scrollable Screen Content */}
        <main className="member-app-body">
          <Outlet />
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="member-bottom-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `bottom-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={20} className="bottom-nav-icon" />
                <span className="bottom-nav-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MemberLayout;

