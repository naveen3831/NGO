import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  Bell,
  Megaphone,
  Globe,
  LogOut,
  Shield,
  Droplet,
  ChevronRight,
} from 'lucide-react';

const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Members & Membership', path: '/admin/members', icon: Users },
    { label: 'Drives & Events', path: '/admin/events', icon: Calendar },
    { label: 'Meetings', path: '/admin/meetings', icon: Clock },
    { label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo-circle">
            <Droplet size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="admin-brand-title">GNPP Admin</h2>
            <p className="admin-brand-sub">Parishubratha Portal</p>
          </div>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section-title">MANAGEMENT</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-link ${active ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {active && <ChevronRight size={14} className="nav-arrow" />}
              </Link>
            );
          })}

          <div className="admin-nav-section-title mt-4">PORTALS</div>
          <Link to="/" className="admin-nav-link" target="_blank" rel="noopener noreferrer">
            <Globe size={18} />
            <span>Public Website</span>
          </Link>
          <Link to="/member" className="admin-nav-link" target="_blank" rel="noopener noreferrer">
            <Shield size={18} />
            <span>Member App View</span>
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-avatar">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="admin-user-info">
              <span className="admin-name">{user?.name || 'Administrator'}</span>
              <span className="admin-role">Super Admin</span>
            </div>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn" title="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumbs">
            <span className="text-muted">Godhavari Nadhi Paryavarana Parishubratha</span>
            <span className="breadcrumb-slash">/</span>
            <span className="breadcrumb-active">
              {navItems.find((n) => isActive(n))?.label || 'Dashboard'}
            </span>
          </div>

          <div className="admin-topbar-actions">
            <span className="live-status-pill">
              <span className="status-dot"></span> Live DB Connected
            </span>
            <Link to="/" className="btn btn-outline btn-sm">
              View Website
            </Link>
          </div>
        </header>

        <div className="admin-page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

