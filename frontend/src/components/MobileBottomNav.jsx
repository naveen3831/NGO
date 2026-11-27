import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Sprout,
  Calendar,
  Bell,
  MoreHorizontal,
  X,
  Compass,
  BookOpen,
  Image as ImageIcon,
  Megaphone,
  CreditCard,
  Clock,
  ArrowRight,
} from 'lucide-react';

const getMobileNavSections = (isMember, isAdmin) => [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: Home,
    hasSubmenu: false,
  },
  {
    id: 'events',
    label: 'Events',
    path: '/initiatives?tab=events',
    icon: Calendar,
    hasSubmenu: false,
  },
  {
    id: 'updates',
    label: 'Updates',
    path: '/announcements',
    icon: Bell,
    hasSubmenu: false,
  },
  {
    id: 'more',
    label: 'More',
    path: '/more',
    icon: MoreHorizontal,
    hasSubmenu: false,
  },
];

const MobileBottomNav = () => {
  const { user, isAdmin, isMember } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activePopup, setActivePopup] = useState(null);

  const mobileNavSections = getMobileNavSections(Boolean(user && isMember), Boolean(user && isAdmin));

  // Close popup whenever route changes
  useEffect(() => {
    setActivePopup(null);
  }, [location.pathname, location.search]);

  const isSectionActive = (section) => {
    if (section.id === 'home') {
      return location.pathname === '/';
    }
    if (section.id === 'events') {
      return (
        (location.pathname === '/initiatives' && location.search.includes('tab=events')) ||
        location.pathname.startsWith('/events')
      );
    }
    if (section.id === 'initiatives') {
      return (
        (location.pathname.startsWith('/initiatives') && !location.search.includes('tab=events')) ||
        location.pathname.startsWith('/activities') ||
        location.pathname.startsWith('/awareness') ||
        location.pathname.startsWith('/gallery')
      );
    }
    if (section.id === 'updates') {
      return location.pathname.startsWith('/announcements');
    }
    if (section.id === 'more') {
      return location.pathname === '/more';
    }
    return location.pathname.startsWith(section.path);
  };

  const handleItemClick = (e, section) => {
    if (!section.hasSubmenu) {
      setActivePopup(null);
      return; // Let normal Link navigation happen
    }

    // If section has sub-menu, toggle the popup sheet
    e.preventDefault();
    if (activePopup === section.id) {
      setActivePopup(null);
    } else {
      setActivePopup(section.id);
    }
  };

  const currentPopupSection = mobileNavSections.find(s => s.id === activePopup);

  return (
    <>
      {/* 1. Backdrop Overlay when a popup sub-menu is open */}
      {activePopup && (
        <div
          className="mobile-dock-backdrop"
          onClick={() => setActivePopup(null)}
          aria-hidden="true"
        />
      )}

      {/* 2. Floating Popover Sub-Menu Sheet */}
      {currentPopupSection && (
        <div className="mobile-dock-popover" role="dialog" aria-modal="true">
          <div className="mobile-dock-popover-header">
            <div className="mobile-dock-popover-title-wrap">
              <span className="mobile-dock-popover-badge">SECTION PORTAL</span>
              <h3 className="mobile-dock-popover-title">{currentPopupSection.fullTitle}</h3>
            </div>
            <button
              onClick={() => setActivePopup(null)}
              className="mobile-dock-popover-close"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>

          {/* Primary Main Section Link */}
          <Link
            to={currentPopupSection.path}
            className="mobile-dock-popover-mainlink"
            onClick={() => setActivePopup(null)}
          >
            <span>Explore All {currentPopupSection.fullTitle}</span>
            <ArrowRight size={15} />
          </Link>

          {/* Subpages Grid / List */}
          <div className="mobile-dock-popover-list">
            {currentPopupSection.children.map((child) => {
              const ChildIcon = child.icon;
              const isChildActive = location.pathname === child.path;

              return (
                <Link
                  key={child.path}
                  to={child.path}
                  className={`mobile-dock-popover-item ${isChildActive ? 'active' : ''}`}
                  onClick={() => setActivePopup(null)}
                >
                  <div className="mobile-dock-popover-item-icon">
                    <ChildIcon size={18} />
                  </div>
                  <div className="mobile-dock-popover-item-text">
                    <div className="mobile-dock-popover-item-title">{child.label}</div>
                    <div className="mobile-dock-popover-item-desc">{child.desc}</div>
                  </div>
                  {isChildActive && <span className="mobile-dock-active-indicator" />}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Bottom Dock Navigation Bar - ALL 6 SECTIONS */}
      <nav className="mobile-app-bottom-dock" aria-label="Mobile Bottom Navigation">
        <div className="mobile-dock-inner">
          {mobileNavSections.map((sec) => {
            const IconComponent = sec.icon;
            const active = isSectionActive(sec);
            const isPopupOpen = activePopup === sec.id;

            return (
              <Link
                key={sec.id}
                to={sec.path}
                onClick={(e) => handleItemClick(e, sec)}
                className={`mobile-dock-item ${active ? 'active' : ''} ${isPopupOpen ? 'popover-open' : ''}`}
                aria-haspopup={sec.hasSubmenu ? 'true' : 'false'}
                aria-expanded={isPopupOpen}
              >
                <div className="mobile-dock-icon-wrap">
                  <IconComponent size={19} strokeWidth={active ? 2.5 : 1.9} />
                  {sec.hasSubmenu && (
                    <span className={`mobile-dock-chevron-dot ${active ? 'active-dot' : ''}`} />
                  )}
                </div>
                <span className="mobile-dock-label">{sec.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
