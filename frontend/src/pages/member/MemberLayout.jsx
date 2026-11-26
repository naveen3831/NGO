import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HeroBanner from '../../components/HeroBanner';
import {
  Home,
  CreditCard,
  Calendar,
  Clock,
  Bell,
  User,
} from 'lucide-react';

const MemberLayout = () => {
  const { user, membership } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/member', icon: Home, end: true },
    { label: 'My Card', path: '/member/card', icon: CreditCard },
    { label: 'Drives', path: '/member/drives', icon: Calendar },
    { label: 'Meetings', path: '/member/meetings', icon: Clock },
    { label: 'Notices', path: '/member/announcements', icon: Bell },
    { label: 'Profile', path: '/member/profile', icon: User },
  ];

  return (
    <div className="site-wrapper">
      <Navbar />

      <main className="main-content-flow" style={{ backgroundColor: '#F7FBF7' }}>
        <HeroBanner
          title={`Namaste, ${user?.name || 'Member'}`}
          subtitle={`Member ID: ${user?.memberId || 'GNPP-MEMBER'} • ${membership?.membershipType || 'Volunteer Member'}`}
        />

        {/* Member Sub-Navigation Bar matching website pill tabs */}
        <nav className="member-bottom-nav" style={{ position: 'relative', zIndex: 10 }}>
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
                <Icon size={17} className="bottom-nav-icon" />
                <span className="bottom-nav-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="member-app-body">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MemberLayout;
