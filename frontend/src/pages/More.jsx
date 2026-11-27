import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UserPlus,
  Megaphone,
  Image as ImageIcon,
  Sprout,
  LogOut,
  LogIn,
  ChevronRight,
} from 'lucide-react';

const More = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      label: 'Join Us',
      desc: 'Become a member or volunteer for River Godavari',
      icon: UserPlus,
      iconBg: '#e8f5e9',
      iconColor: '#006B3C',
      onClick: () => navigate('/register'),
    },
    {
      label: 'Announcements',
      desc: 'Official circulars, cleanliness alerts & notices',
      icon: Megaphone,
      iconBg: '#eff6ff',
      iconColor: '#1d4ed8',
      onClick: () => navigate('/announcements'),
    },
    {
      label: 'Gallery',
      desc: 'Photos from river cleanups & plantation drives',
      icon: ImageIcon,
      iconBg: '#fef3c7',
      iconColor: '#b45309',
      onClick: () => navigate('/initiatives?tab=gallery'),
    },
    {
      label: 'Initiatives',
      desc: 'Explore activities, events & conservation programs',
      icon: Sprout,
      iconBg: '#ecfdf5',
      iconColor: '#047857',
      onClick: () => navigate('/initiatives'),
    },
    ...(user
      ? [
          {
            label: 'Log Out',
            desc: 'Sign out of your account',
            icon: LogOut,
            iconBg: '#fee2e2',
            iconColor: '#dc2626',
            isDanger: true,
            onClick: handleLogout,
          },
        ]
      : [
          {
            label: 'Login',
            desc: 'Sign in to your member or admin account',
            icon: LogIn,
            iconBg: '#f1f5f9',
            iconColor: '#334155',
            onClick: () => navigate('/login'),
          },
        ]),
  ];

  return (
    <div style={{ minHeight: '75vh', background: '#F7FBF7', padding: '1.5rem 1rem 5rem' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.15rem' }}>
          <h2 style={{ margin: '0 0 0.25rem', color: '#064e3b', fontSize: '1.4rem', fontWeight: 800 }}>
            More Options
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.86rem' }}>
            Quick access to NGO initiatives, updates, gallery, and account actions.
          </p>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
            overflow: 'hidden',
          }}
        >
          {menuItems.map((item, idx, arr) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: 'none',
                  borderBottom: idx < arr.length - 1 ? '1px solid #f1f5f9' : 'none',
                  padding: '0.95rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: item.iconBg,
                      color: item.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: item.isDanger ? '#dc2626' : '#0f172a',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '1px' }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  size={17}
                  color={item.isDanger ? '#dc2626' : '#94a3b8'}
                  style={{ flexShrink: 0 }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default More;

