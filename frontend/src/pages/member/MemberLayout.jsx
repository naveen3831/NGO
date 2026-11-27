import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import Logo from '../../components/Logo';
import UserAvatar from '../../components/UserAvatar';
import {
  Home,
  Calendar,
  Users,
  Megaphone,
  CreditCard,
  User,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';

const MemberLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('ngo_member_sidebar');
    return saved !== null ? saved === 'true' : true;
  });
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    document.documentElement.style.setProperty('--admin-sidebar-w', sidebarOpen ? '232px' : '74px');
  }, [sidebarOpen]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await API.get('/member/notifications');
        const list = Array.isArray(data) ? data : [];
        setUnreadCount(list.filter((n) => !n.isRead).length);
      } catch {
        // Ignore
      }
    };
    fetchNotifications();
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem('ngo_member_sidebar', String(next));
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isVolunteer = user?.role?.toLowerCase() === 'volunteer';
  const roleLabel = isVolunteer ? 'Volunteer' : 'Member';

  const navItems = [
    { label: 'Dashboard', path: '/member', icon: Home, exact: true },
    { label: 'Drives & Events', path: '/member/drives', icon: Calendar },
    { label: 'Meetings', path: '/member/meetings', icon: Users },
    { label: 'Announcements', path: '/member/announcements', icon: Megaphone },
    { label: 'Digital ID Card', path: '/member/card', icon: CreditCard },
    { label: 'Profile', path: '/member/profile', icon: User },
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path || location.pathname === `${item.path}/`;
    return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
  };

  const getPageTitle = () => {
    const current = navItems.find((item) => isActive(item));
    if (current) {
      if (current.label === 'Dashboard') {
        return `${roleLabel} Dashboard`;
      }
      return current.label;
    }
    return `${roleLabel} Dashboard`;
  };

  return (
    <div className="eco-admin-wrapper">
      {/* Dark Forest Green Sidebar Navigation matching Admin Dashboard */}
      <aside className={`eco-admin-sidebar ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <div className="eco-sidebar-brand">
          <Link
            to="/"
            title="View Public Website"
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

        <nav className="eco-sidebar-nav">
          <div className="eco-nav-main-group">
            {navItems.map((item) => {
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

        <div className="admin-sidebar-footer">
          <Link
            to="/member/profile"
            className="admin-user-card"
            title="View Profile"
          >
            <UserAvatar
              src={user?.avatar}
              name={user?.name}
              fallback={roleLabel}
              className="admin-avatar"
            />
            <div className="admin-user-info">
              <span className="admin-name">{user?.name || roleLabel}</span>
              <span className="admin-role">{roleLabel} (Read-Only)</span>
            </div>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="admin-logout-btn"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Container matching Admin Dashboard */}
      <div className="eco-admin-main-container">
        <header className="eco-admin-topbar">
          <div className="eco-topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 className="eco-admin-page-heading">{getPageTitle()}</h1>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#f0fdf4',
                color: '#047857',
                border: '1px solid #bbf7d0',
                borderRadius: '9999px',
                padding: '0.2rem 0.7rem',
                fontSize: '0.74rem',
                fontWeight: 700,
              }}
            >
              <Eye size={12} />
              <span>Read-Only Access</span>
            </span>
          </div>

          <div className="eco-admin-topbar-actions">
            <Link
              to="/member/announcements"
              className="eco-topbar-bell-btn"
              title="Notifications & Announcements"
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

        <main className="eco-admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MemberLayout;
