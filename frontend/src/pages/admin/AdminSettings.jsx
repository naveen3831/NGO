import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Settings,
  User,
  Mail,
  Phone,
  Lock,
  Key,
  Save,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

const AdminSettings = () => {
  const { user, login } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
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

      const res = await api.patch('/admin/settings', payload);
      setFeedback({
        type: 'success',
        message: 'Administrator settings and profile updated successfully in MongoDB database!',
      });

      // Clear password fields on success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to update admin settings in database.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Administrator Settings</h1>
          <p className="admin-page-subtitle">
            Manage your administrative profile, contact details, and security credentials stored in MongoDB.
          </p>
        </div>
      </div>

      {feedback.message && (
        <div className={`alert-banner alert-${feedback.type} mb-4`}>
          {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback({ type: '', message: '' })}
            className="ml-auto text-xs opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleProfileSubmit}>
        {/* Profile Card */}
        <div className="admin-card mb-4">
          <div className="card-header-styled">
            <User size={18} className="text-primary" />
            <h2 className="card-header-title">Administrator Profile</h2>
          </div>
          <div className="admin-card-body">
            <div className="grid-3 gap-3">
              <div className="form-group">
                <label className="flex items-center gap-1">
                  <User size={14} /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="flex items-center gap-1">
                  <Mail size={14} /> Administrator Email *
                </label>
                <input
                  type="email"
                  required
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="flex items-center gap-1">
                  <Phone size={14} /> Contact Phone *
                </label>
                <input
                  type="text"
                  required
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security / Password Change Card */}
        <div className="admin-card mb-4">
          <div className="card-header-styled">
            <Lock size={18} className="text-amber-600" />
            <h2 className="card-header-title">Security & Password Management</h2>
          </div>
          <div className="admin-card-body">
            <p className="text-sm text-muted mb-3">
              Leave these fields blank if you do not wish to change your password.
            </p>

            <div className="grid-3 gap-3">
              <div className="form-group">
                <label>Current Password</label>
                <div className="input-with-icon password-input-wrap">
                  <Key size={15} className="input-field-icon" />
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="form-control"
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

              <div className="form-group">
                <label>New Password</label>
                <div className="input-with-icon password-input-wrap">
                  <Lock size={15} className="input-field-icon" />
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    placeholder="Enter new password (min. 6 chars)"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="form-control"
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

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="input-with-icon password-input-wrap">
                  <Lock size={15} className="input-field-icon" />
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="form-control"
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

        {/* Database Status Info Box */}
        <div className="admin-card mb-4 bg-slate-50 border-slate-200">
          <div className="admin-card-body flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-primary rounded-lg flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Active Super Administrator Account</h4>
              <p className="text-xs text-slate-600">
                Credentials and privilege levels are authenticated directly against MongoDB Atlas cluster with bcrypt hashing and JWT authorization.
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pb-8">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex items-center gap-2 px-6"
          >
            <Save size={16} />
            <span>{loading ? 'Saving Settings...' : 'Save Settings to Database'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;

