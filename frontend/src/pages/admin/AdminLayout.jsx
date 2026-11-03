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
    { label: 'Profile', path: '/admin/profile', icon: User },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const getPageTitle = () => {
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      return 'Admin Dashboard';
    }
    const current = navItems.find((item) => isActive(item));
    if (current) {
      if (current.label === 'Dashboard') return 'Admin Dashboard';
      return current.label;
    }
    if (location.pathname.startsWith('/admin/meetings')) return 'Meetings & Events';
    return 'Admin Dashboard';
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

        {/* Sidebar Admin Profile Footer */}
        <div className="admin-sidebar-footer">
          <Link
            to="/admin/profile"
            className="admin-user-card"
            title="View Admin Profile"
          >
            <div className="admin-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
            </div>
            <div className="admin-user-info">
              <span className="admin-name">{user?.name || 'Dr. K. V. Subba Rao'}</span>
              <span className="admin-role">Super Admin</span>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="admin-logout-btn"
            title="Sign out of Admin Dashboard"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Administrative Container */}
      <div className="eco-admin-main-container">
        {/* Top Header Bar */}
        <header className="eco-admin-topbar">
          <h1 className="eco-admin-page-heading">{getPageTitle()}</h1>

          <div className="eco-admin-topbar-actions">
            {/* Bell Notification with Red Badge Dot */}
            <button className="eco-topbar-bell-btn" title="Notifications">
              <Bell size={20} />
              <span className="bell-red-badge"></span>
            </button>
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
