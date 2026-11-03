import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import {
  Home,
  FileText,
  Users,
  CreditCard,
  Calendar,
  Megaphone,
  Bell,
  BarChart2,
  UserCheck,
  Settings,
  ChevronDown,
  User,
  LogOut,
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login?role=admin');
  };

  // Sidebar navigation structure exactly matching the reference design
  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: Home, exact: true },
    { label: 'Website Content', path: '/admin/website', icon: FileText, hasSubmenu: true },
    { label: 'Members', path: '/admin/members', icon: Users },
    { label: 'Membership', path: '/admin/memberships', icon: CreditCard },
    { label: 'Meetings & Events', path: '/admin/events', icon: Calendar, hasSubmenu: true },
    { label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Reports', path: '/admin/reports', icon: BarChart2 },
    { label: 'Admin Users', path: '/admin/users', icon: UserCheck },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="eco-admin-wrapper">
      {/* Dark Forest Green Sidebar Navigation */}
      <aside className="eco-admin-sidebar">
        {/* Brand Lockup: Vector Emblem + 3-line Stacked Name */}
        <div className="eco-sidebar-brand">
          <Logo variant="light" size={32} showText={false} />
          <div className="eco-sidebar-brand-text">
            <span className="brand-title-primary">Godhavari Nadhi</span>
            <span className="brand-title-sub">Paryavarana</span>
            <span className="brand-title-sub">Parishubratha</span>
          </div>
        </div>

        {/* Navigation Items with Equal Spacing */}
        <nav className="eco-sidebar-nav">
          <div className="eco-nav-main-group">
            {navItems
              .filter((item) => item.label !== 'Settings')
              .map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`eco-nav-item ${active ? 'active' : ''}`}
                  >
                    <Icon size={16} className="eco-nav-icon" />
                    <span className="eco-nav-label">{item.label}</span>
                    {item.hasSubmenu && (
                      <ChevronDown size={14} className="eco-nav-chevron" />
                    )}
                  </Link>
                );
              })}
          </div>

          <div className="eco-nav-bottom-group">
            {navItems
              .filter((item) => item.label === 'Settings')
              .map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`eco-nav-item ${active ? 'active' : ''}`}
                  >
                    <Icon size={16} className="eco-nav-icon" />
                    <span className="eco-nav-label">{item.label}</span>
                  </Link>
                );
              })}
          </div>
        </nav>
      </aside>

      {/* Main Administrative Container */}
      <div className="eco-admin-main-container">
        {/* Top Header Bar */}
        <header className="eco-admin-topbar">
          <h1 className="eco-admin-page-heading">Admin Dashboard</h1>

          <div className="eco-admin-topbar-actions">
            {/* Bell Notification with Red Badge Dot */}
            <button className="eco-topbar-bell-btn" title="Notifications">
              <Bell size={20} />
              <span className="bell-red-badge"></span>
            </button>

            {/* Admin User Profile Pill with Dropdown */}
            <div className="eco-admin-profile-menu-wrap">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="eco-admin-profile-btn"
                title="Admin Account Options"
              >
                <div className="eco-avatar-circle">
                  <User size={16} />
                </div>
                <span className="eco-admin-user-title">Admin</span>
                <ChevronDown size={14} className="eco-chevron-down" />
              </button>

              {showProfileMenu && (
                <div className="eco-profile-dropdown-card">
                  <div className="profile-dropdown-user-info">
                    <p className="font-bold text-gray-900 text-sm">
                      {user?.name || 'Administrator'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || 'admin@gmail.com'}
                    </p>
                  </div>
                  <div className="profile-dropdown-divider"></div>
                  <Link
                    to="/admin/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="profile-dropdown-row"
                  >
                    <Settings size={14} /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="profile-dropdown-row text-red-600"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="eco-admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
