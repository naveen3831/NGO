import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  Key,
  CreditCard,
  Edit3,
  CheckCircle2,
  ShieldCheck,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const MemberProfile = () => {
  const { user, membership, refreshProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || 'B+');
  const [city, setCity] = useState(user?.address?.city || 'Rajahmundry');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [requestingVolunteer, setRequestingVolunteer] = useState(false);
  const [activeSection, setActiveSection] = useState(location.hash === '#password' ? 'settings' : null);

  useEffect(() => {
    if (location.hash === '#password') {
      setActiveSection('settings');
    }
  }, [location.hash]);

  const handleRequestVolunteer = async () => {
    setRequestingVolunteer(true);
    setFeedback('');
    try {
      const res = await API.post('/member/membership/request-tier', {
        requestedTier: 'Volunteer Member',
      });
      await refreshProfile();
      setFeedback(res.data?.message || 'Volunteer membership request sent to Admin for approval!');
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Unable to submit volunteer request.');
    } finally {
      setRequestingVolunteer(false);
    }
  };

  useEffect(() => {
    if (location.hash === '#password') {
      const el = document.getElementById('password');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    try {
      await API.patch('/member/profile', {
        name,
        phone,
        bloodGroup,
        address: { city },
      });
      await refreshProfile();
      setFeedback('Profile details successfully updated!');
      setEditing(false);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    try {
      await API.patch('/member/profile', { password: newPassword });
      setPasswordMsg('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Unable to update password.');
    }
  };

  const infoTiles = [
    { icon: ShieldCheck, label: 'Membership ID', value: user?.memberId || '—' },
    { icon: CreditCard, label: 'Membership Status', value: membership?.status || 'Pending' },
    { icon: Mail, label: 'Email Address', value: user?.email || '—' },
    { icon: Phone, label: 'Phone Number', value: user?.phone || '—' },
    { icon: Heart, label: 'Blood Group', value: user?.bloodGroup || 'B+' },
    {
      icon: MapPin,
      label: 'Location',
      value: `${user?.address?.city || 'Rajahmundry'}, Andhra Pradesh`,
    },
  ];

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '0.5rem 0 2.5rem' }}>
      {feedback && (
        <div
          style={{
            background: '#E8F5E9',
            color: '#064e3b',
            border: '1px solid #86efac',
            borderRadius: '12px',
            padding: '0.85rem 1.15rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} />
          <span>{feedback}</span>
        </div>
      )}

      {/* QUICK ACCOUNT OPTIONS MENU */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
          overflow: 'hidden',
          marginBottom: '1.5rem',
        }}
      >
        {[
          {
            label: 'My Account',
            desc: `ID: ${user?.memberId || 'GNPP'} • Status: ${membership?.status || 'Pending'}`,
            icon: User,
            iconBg: '#e8f5e9',
            iconColor: '#006B3C',
            onClick: () => setActiveSection((prev) => (prev === 'account' ? null : 'account')),
          },
          {
            label: 'My Activities & Events',
            desc: 'Enrolled drives, activities & meetings',
            icon: CreditCard,
            iconBg: '#ecfdf5',
            iconColor: '#047857',
            onClick: () => navigate('/member/drives'),
          },
          {
            label: 'Notifications',
            desc: 'Announcements, circulars & river alerts',
            icon: Bell,
            iconBg: '#eff6ff',
            iconColor: '#1d4ed8',
            onClick: () => navigate('/member/announcements'),
          },
          {
            label: 'Settings',
            desc: 'Password & account security',
            icon: Settings,
            iconBg: '#f1f5f9',
            iconColor: '#334155',
            onClick: () => setActiveSection((prev) => (prev === 'settings' ? null : 'settings')),
          },
          {
            label: 'Help & Support',
            desc: 'Contact NGO secretariat & help desk',
            icon: HelpCircle,
            iconBg: '#fef3c7',
            iconColor: '#b45309',
            onClick: () => navigate('/contact'),
          },
          {
            label: 'Log Out',
            desc: 'Sign out of your member session',
            icon: LogOut,
            iconBg: '#fee2e2',
            iconColor: '#dc2626',
            isDanger: true,
            onClick: () => {
              logout();
              navigate('/');
            },
          },
        ].map((item, idx, arr) => {
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
                padding: '0.9rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
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
                      fontSize: '0.94rem',
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
              <ChevronRight size={17} color={item.isDanger ? '#dc2626' : '#94a3b8'} style={{ flexShrink: 0 }} />
            </button>
          );
        })}
      </div>

      {/* 2. EXPANDABLE ACCOUNT / SETTINGS SECTION */}
      {activeSection && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left Card: Personal Details */}
          {activeSection === 'account' && (
            <div
              id="personal-details"
              style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem',
              paddingBottom: '0.85rem',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <h3 style={{ margin: 0, color: '#064e3b', fontSize: 'clamp(1rem, 3.8vw, 1.15rem)', display: 'flex', alignItems: 'center', gap: '0.45rem', whiteSpace: 'nowrap' }}>
              <User size={18} color="#006B3C" style={{ flexShrink: 0 }} />
              <span>Personal Details</span>
            </h3>
            <button
              type="button"
              onClick={() => setEditing(!editing)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: editing ? '#fee2e2' : '#E8F5E9',
                color: editing ? '#dc2626' : '#006B3C',
                border: '1px solid ' + (editing ? '#fecaca' : '#bbf7d0'),
                borderRadius: '9999px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 650,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <Edit3 size={13} style={{ flexShrink: 0 }} />
              <span>{editing ? 'Cancel' : 'Edit Info'}</span>
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleUpdate} className="auth-form-body">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="btn-hero-join-mission"
                style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem' }}>
              {infoTiles.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.9rem',
                      padding: '0.85rem 1rem',
                      background: '#F7FBF7',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: '#E8F5E9',
                        color: '#006B3C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={17} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#173D2B', wordBreak: 'break-word' }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
            </div>
          )}

          {/* Right Card: Reset / Forgot Password */}
          {activeSection === 'settings' && (
            <div
              id="password"
              style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
            scrollMarginTop: '90px',
          }}
        >
          <div
            style={{
              marginBottom: '1.25rem',
              paddingBottom: '0.85rem',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <h3 style={{ margin: '0 0 0.25rem', color: '#064e3b', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={18} color="#006B3C" />
              <span>Reset / Forgot Password</span>
            </h3>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
              Update your account password securely at any time.
            </p>
          </div>

          {passwordMsg && (
            <div className="alert-banner alert-success mb-3" style={{ fontSize: '0.86rem' }}>
              {passwordMsg}
            </div>
          )}
          {passwordError && (
            <div className="alert-banner alert-danger mb-3" style={{ fontSize: '0.86rem' }}>
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="auth-form-body">
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn-hero-join-mission"
              style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}
            >
              Update Password
            </button>
          </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberProfile;
