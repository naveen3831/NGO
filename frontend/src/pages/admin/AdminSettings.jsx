import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  User,
  Mail,
  Phone,
  Lock,
  Key,
  Save,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  ShieldCheck,
  Edit3,
  BadgeCheck,
} from 'lucide-react';

const AdminSettings = () => {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Dr. K. V. Subba Rao',
    email: user?.email || 'admin@gmail.com',
    phone: user?.phone || '+91 944 012 3456',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    if (passwordData.newPassword) {
      if (!passwordData.currentPassword) {
        setFeedback({
          type: 'danger',
          message: 'Please provide your current password to set a new password.',
        });
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setFeedback({
          type: 'danger',
          message: 'New password and confirm password do not match.',
        });
        return;
      }
      if (passwordData.newPassword.length < 6) {
        setFeedback({
          type: 'danger',
          message: 'New password must be at least 6 characters.',
        });
        return;
      }
    }

    try {
      setLoading(true);
      const payload = {
        name: profileData.name.trim(),
        email: profileData.email.trim(),
        phone: profileData.phone.trim(),
      };

      if (passwordData.newPassword) {
        payload.currentPassword = passwordData.currentPassword.trim();
        payload.newPassword = passwordData.newPassword.trim();
      }

      await api.patch('/admin/settings', payload);
      setFeedback({
        type: 'success',
        message: 'Administrator profile and settings updated successfully in MongoDB database!',
      });

      // Clear password fields on success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to update admin profile in database.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eco-cms-page">
      {/* Page Header */}
      <div className="eco-cms-header-row">
        <div className="eco-cms-header-info">
          <div className="eco-cms-badge-row">
            <span className="eco-cms-live-badge">
              <span className="live-dot-pulse"></span>
              Admin Account &bull; Verified Super Admin
            </span>
          </div>
          <h1 className="eco-cms-main-title">Administrator Profile &amp; Settings</h1>
          <p className="eco-cms-sub-title">
            Manage your personal administrative profile details, contact information, and security credentials.
          </p>
        </div>

        <div className="eco-cms-header-actions">
          <button
            type="button"
            onClick={handleProfileSubmit}
            className="eco-cms-btn-primary"
            disabled={loading}
          >
            <Save size={14} />
            <span>{loading ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback.message && (
        <div className={`eco-cms-alert-banner alert-${feedback.type}`}>
          <div className="eco-cms-alert-content">
            {feedback.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-700" />
            ) : (
              <AlertTriangle size={18} className="text-red-700" />
            )}
            <span className="font-medium text-sm">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ type: '', message: '' })}
            className="eco-cms-alert-dismiss"
          >
            &times;
          </button>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="eco-cms-card">
        <div className="eco-cms-card-body flex items-center gap-4">
          <div className="admin-avatar" style={{ width: 54, height: 54, fontSize: '1.4rem' }}>
            {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'D'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-gray-900">{profileData.name}</h2>
              <span className="badge badge-green flex items-center gap-1">
                <BadgeCheck size={13} /> Super Admin
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {profileData.email} &bull; {profileData.phone} &bull; Full Administrative Permissions
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleProfileSubmit} className="eco-cms-form-flow">
        {/* Card 1: Edit Profile Form */}
        <div className="eco-cms-card">
          <div className="eco-cms-card-header">
            <div className="eco-cms-card-icon-tile green">
              <Edit3 size={18} />
            </div>
            <div>
              <h2 className="eco-cms-card-title">Edit Profile Details</h2>
              <p className="eco-cms-card-subtitle">
                Update your official display name, notification email, and primary phone number.
              </p>
            </div>
          </div>

          <div className="eco-cms-card-body">
            <div className="eco-cms-grid-3">
              {/* Full Name */}
              <div className="eco-form-field-group">
                <label className="eco-form-label">
                  <User size={14} className="text-emerald-700" />
                  <span>Full Name</span>
                  <span className="required-star">*</span>
                </label>
                <div className="eco-input-icon-wrap">
                  <User size={16} className="eco-input-left-icon" />
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Enter full name"
                    className="eco-form-input with-icon"
                  />
                </div>
              </div>

              {/* Official Email */}
              <div className="eco-form-field-group">
                <label className="eco-form-label">
                  <Mail size={14} className="text-emerald-700" />
                  <span>Administrator Email</span>
                  <span className="required-star">*</span>
                </label>
                <div className="eco-input-icon-wrap">
                  <Mail size={16} className="eco-input-left-icon" />
                  <input
                    type="email"
                    required
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    placeholder="admin@gmail.com"
                    className="eco-form-input with-icon"
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div className="eco-form-field-group">
                <label className="eco-form-label">
                  <Phone size={14} className="text-emerald-700" />
                  <span>Contact Phone</span>
                  <span className="required-star">*</span>
                </label>
                <div className="eco-input-icon-wrap">
                  <Phone size={16} className="eco-input-left-icon" />
                  <input
                    type="text"
                    required
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+91 944 012 3456"
                    className="eco-form-input with-icon"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Security & Password Management */}
        <div className="eco-cms-card">
          <div className="eco-cms-card-header">
            <div className="eco-cms-card-icon-tile amber">
              <Lock size={18} />
            </div>
            <div>
              <h2 className="eco-cms-card-title">Security &amp; Password Management</h2>
              <p className="eco-cms-card-subtitle">
                Leave these fields blank if you do not wish to change your password.
              </p>
            </div>
          </div>

          <div className="eco-cms-card-body">
            <div className="eco-cms-grid-3">
              {/* Current Password */}
              <div className="eco-form-field-group">
                <label className="eco-form-label">
                  <Key size={14} className="text-amber-600" />
                  <span>Current Password</span>
                </label>
                <div className="eco-input-icon-wrap">
                  <Key size={16} className="eco-input-left-icon" />
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="eco-form-input with-icon"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="btn-password-toggle"
                    title={showCurrentPw ? 'Hide password' : 'View password'}
                  >
                    {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="eco-form-field-group">
                <label className="eco-form-label">
                  <Lock size={14} className="text-amber-600" />
                  <span>New Password</span>
                </label>
                <div className="eco-input-icon-wrap">
                  <Lock size={16} className="eco-input-left-icon" />
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="eco-form-input with-icon"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="btn-password-toggle"
                    title={showNewPw ? 'Hide password' : 'View password'}
                  >
                    {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="eco-form-field-group">
                <label className="eco-form-label">
                  <Lock size={14} className="text-amber-600" />
                  <span>Confirm New Password</span>
                </label>
                <div className="eco-input-icon-wrap">
                  <Lock size={16} className="eco-input-left-icon" />
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="eco-form-input with-icon"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="btn-password-toggle"
                    title={showConfirmPw ? 'Hide password' : 'View password'}
                  >
                    {showConfirmPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="eco-cms-bottom-bar">
          <div className="eco-cms-bottom-meta">
            <ShieldCheck size={18} className="text-emerald-600" />
            <span>
              Profile changes are authenticated and directly persisted to the <strong>MongoDB Atlas</strong> database.
            </span>
          </div>

          <div className="eco-cms-bottom-actions">
            <button
              type="submit"
              disabled={loading}
              className="eco-cms-btn-save-primary"
            >
              <Save size={16} />
              <span>{loading ? 'Saving Profile...' : 'Save & Update Profile'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
