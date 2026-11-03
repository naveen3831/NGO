import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Award,
  Calendar,
  Clock,
  Bell,
  Megaphone,
  Globe,
  Settings,
  LogOut,
  Droplet,
  ChevronRight,
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login?role=admin');
  };

  // Sidebar structure strictly matching Section 5.3 of the UI/UX Document
  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Members', path: '/admin/members', icon: Users },
    { label: 'Memberships', path: '/admin/memberships', icon: Award },
    { label: 'Meetings & Events', path: '/admin/events', icon: Calendar },
    { label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Website Management', path: '/admin/website', icon: Globe },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar Navigation - Strictly Administrative */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo-circle">
            <Droplet size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="admin-brand-title">GNPP Admin</h2>
            <p className="admin-brand-sub">Management Portal</p>
          </div>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section-title">ADMINISTRATIVE MODULES</div>
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
          <button onClick={handleLogout} className="admin-logout-btn" title="Sign out of Admin Dashboard">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Administrative Content Area */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumbs">
            <span className="text-muted">Admin Console</span>
            <span className="breadcrumb-slash">/</span>
            <span className="breadcrumb-active">
              {navItems.find((n) => isActive(n))?.label || 'Dashboard'}
            </span>
          </div>

          <div className="admin-topbar-actions">
            <span className="live-status-pill">
              <span className="status-dot"></span> Live DB Connected
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-sm flex items-center gap-1 text-xs"
              title="Sign Out"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
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
