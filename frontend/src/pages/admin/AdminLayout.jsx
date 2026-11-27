import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import Logo from '../../components/Logo';
import UserAvatar from '../../components/UserAvatar';
import {
  Home,
  FileText,
  Users,
  Calendar,
  Megaphone,
  Bell,
  Key,
  Settings,
  User,
  LogOut,
  Menu,
  Image as ImageIcon,
  HeartHandshake,
  Mail,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('ngo_admin_sidebar');
    return saved !== null ? saved === 'true' : true;
  });

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchAdminInbox = async () => {
    try {
      const { data } = await API.get('/admin/notifications/admin-inbox');
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // Ignore transient polling errors
    }
  };

  useEffect(() => {
    fetchAdminInbox();

    const token = localStorage.getItem('token');
    const baseUrl = (API.defaults.baseURL || '/api/v1').replace(/\/+$/, '');
    let eventSource = null;

    if (token) {
      eventSource = new EventSource(
        `${baseUrl}/admin/notifications/stream?token=${encodeURIComponent(token)}`
      );

      eventSource.addEventListener('new_registration', (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.notification) {
            setUnreadCount((prev) => prev + 1);
          }
          window.dispatchEvent(
            new CustomEvent('ngo-admin-realtime', {
              detail: { type: 'new_registration', ...payload },
            })
          );
        } catch {
          // Ignore malformed SSE payload
        }
      });

      eventSource.addEventListener('member_updated', (event) => {
        try {
          const payload = JSON.parse(event.data);
          window.dispatchEvent(
            new CustomEvent('ngo-admin-realtime', {
              detail: { type: 'member_updated', ...payload },
            })
          );
        } catch {
          // Ignore malformed SSE payload
        }
      });
    }

    const syncUnread = () => fetchAdminInbox();
    window.addEventListener('ngo-admin-notifications-sync', syncUnread);
    const pollInterval = setInterval(fetchAdminInbox, 15000);

    return () => {
      if (eventSource) eventSource.close();
      window.removeEventListener('ngo-admin-notifications-sync', syncUnread);
      clearInterval(pollInterval);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--admin-sidebar-w', sidebarOpen ? '232px' : '74px');
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem('ngo_admin_sidebar', String(next));
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Sidebar navigation structure exactly matching the reference design
  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: Home, exact: true },
    { label: 'Members', path: '/admin/members', icon: Users },
    { label: 'Drives & Events', path: '/admin/events', icon: Calendar },
    { label: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { label: 'Contact Messages', path: '/admin/contacts', icon: Mail },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Website Content', path: '/admin/website', icon: FileText },
    { label: 'Profile', path: '/admin/profile', icon: User },
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
  };

  const getPageTitle = () => {
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      return 'Admin Dashboard';
    }
    if (location.pathname.startsWith('/admin/meetings')) return 'Meetings & Sessions';
    if (location.pathname.startsWith('/admin/events')) return 'Drives & Events';
    if (location.pathname.startsWith('/admin/members')) return 'Members & Membership';
    const current = navItems.find((item) => isActive(item));
    if (current) {
      if (current.label === 'Dashboard') return 'Admin Dashboard';
      return current.label;
    }
    return 'Admin Dashboard';
  };

  return (
    <div className="eco-admin-wrapper">
      {/* Dark Forest Green Sidebar Navigation */}
      <aside className={`eco-admin-sidebar ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        {/* Brand Lockup: Vector Emblem + 3-line Stacked Name + Hide Button */}
        <div className="eco-sidebar-brand">
          <Link
            to="/"
            title="View Public Website (Home & Navbar)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              flex: 1,
              minWidth: 0,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Logo variant="light" size={34} showText={false} />
            <div className="eco-sidebar-brand-text" style={{ minWidth: 0 }}>
              <span className="brand-title-primary">Godhavari Nadhi</span>
              <span className="brand-title-sub">Paryavarana</span>
              <span className="brand-title-sub">Parishubratha</span>
            </div>
          </Link>
          <button
            type="button"
            onClick={toggleSidebar}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
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
                    title={item.label}
                    className={`eco-nav-item ${active ? 'active' : ''}`}
                  >
                    <Icon size={16} className="eco-nav-icon" />
                    <span className="eco-nav-label">{item.label}</span>
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
                    title={item.label}
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
            <UserAvatar
              src={user?.avatar}
              name={user?.name}
              fallback="D"
              className="admin-avatar"
            />
            <div className="admin-user-info">
              <span className="admin-name">{user?.name || 'Dr. K. V. Subba Rao'}</span>
              <span className="admin-role">Administrator</span>
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
        {/* Top Header Bar with Hamburger Menu Toggle */}
        <header className="eco-admin-topbar">
          <div className="eco-topbar-left">
            <h1 className="eco-admin-page-heading">{getPageTitle()}</h1>
          </div>

          <div className="eco-admin-topbar-actions">
            {/* Full-Page Notifications Navigation */}
            <Link
              to="/admin/notifications"
              className="eco-topbar-bell-btn"
              title="View Full-Page Notifications Center"
              aria-label="Notifications"
              style={{ position: 'relative' }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    minWidth: '18px',
                    height: '18px',
                    padding: '0 4px',
                    borderRadius: '9999px',
                    background: '#dc2626',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #ffffff',
                  }}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
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
