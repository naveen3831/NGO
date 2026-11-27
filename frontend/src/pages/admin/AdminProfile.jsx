import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import UserAvatar, { PortraitUploadField } from '../../components/UserAvatar';
import { hasCustomPortrait } from '../../components/OfficialIdCard';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  Briefcase,
  Key,
  Lock,
  FileText,
  Edit2,
  X,
  Check,
  Waves,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

const AdminProfile = () => {
  const { user, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'security' | 'mandates'

  const [formData, setFormData] = useState({
    name: user?.name || 'Dr. K. V. Subba Rao',
    email: user?.email || 'admin@gmail.com',
    phone: user?.phone || '+91 98480 12345',
    designation: user?.designation || 'President & Chief Coordinator',
    officeLocation: user?.officeLocation || 'Godavari Bund Road, Near Kotilingala Ghat, Rajahmundry, Andhra Pradesh',
    bio: user?.bio || 'Dedicated environmentalist leading the cleanup and revival of the sacred River Godavari since 2018. Coordinating community riverfront cleanliness drives, plastic waste interception, and ecological reforestation.',
    avatar: user?.avatar || '',
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Modal: Edit Profile
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    officeLocation: '',
    bio: '',
    avatar: '',
  });

  // Password Change Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Load latest profile on mount
  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data?.user) {
          const u = res.data.user;
          setFormData((prev) => ({
            ...prev,
            name: u.name || prev.name,
            email: u.email || prev.email,
            phone: u.phone || prev.phone,
            designation: u.designation || prev.designation,
            officeLocation: u.officeLocation || prev.officeLocation,
            bio: u.bio || prev.bio,
            avatar: u.avatar !== undefined ? u.avatar : prev.avatar,
          }));
        }
      } catch (err) {
        console.warn('Using stored local profile', err);
      }
    };

    fetchCurrentProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const openEditModal = () => {
    setEditFormData({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      designation: formData.designation,
      officeLocation: formData.officeLocation,
      bio: formData.bio,
      avatar: hasCustomPortrait(formData.avatar) ? formData.avatar : '',
    });
    setShowEditModal(true);
  };

  // Submit Edit Profile Updates
  const handleEditSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      const payload = {
        name: editFormData.name.trim(),
        email: editFormData.email.trim(),
        phone: editFormData.phone.trim(),
        designation: editFormData.designation.trim(),
        officeLocation: editFormData.officeLocation.trim(),
        bio: editFormData.bio.trim(),
        avatar: editFormData.avatar,
      };

      const { data } = await api.patch('/admin/settings', payload);
      const savedUser = data?.user || {};

      setFormData((prev) => ({
        ...prev,
        ...payload,
        ...(savedUser.avatar !== undefined ? { avatar: savedUser.avatar } : {}),
      }));

      if (refreshProfile) {
        await refreshProfile();
      }

      setShowEditModal(false);
      setFeedback({
        type: 'success',
        message: 'Administrator profile successfully updated and saved to MongoDB database!',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to update profile details.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Submit Password Change
  const handlePasswordSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setPasswordSaving(true);
    setFeedback({ type: '', message: '' });

    if (!passwordData.currentPassword) {
      setPasswordSaving(false);
      setFeedback({
        type: 'danger',
        message: 'Please enter your current password.',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordSaving(false);
      setFeedback({
        type: 'danger',
        message: 'New password must be at least 6 characters long.',
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordSaving(false);
      setFeedback({
        type: 'danger',
        message: 'New password and confirm password do not match.',
      });
      return;
    }

    try {
      await api.patch('/admin/settings', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setFeedback({
        type: 'success',
        message: 'Security password changed successfully and persisted to database!',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to change password.',
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (showEditModal) {
    return (
      <div className="ref-members-page">
        {/* Top Back Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="ref-btn-enroll"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              padding: '0.55rem 1.15rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Admin Profile</span>
          </button>

          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Administrator Profile &bull; Edit Identity &amp; Photo
          </span>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ padding: '1.4rem 1.75rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                Edit Administrator Profile
              </h3>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                Update identity, profile photo, contact details, and organization role
              </p>
            </div>
          </div>

          <form onSubmit={handleEditSubmit}>
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <PortraitUploadField
                value={editFormData.avatar}
                name={editFormData.name}
                fallback="A"
                label="Administrator Profile Photo"
                onChange={(avatar) => setEditFormData((prev) => ({ ...prev, avatar }))}
                onError={(message) => setFeedback({ type: 'danger', message })}
              />

              <div className="ref-form-grid-2">
                <div className="cms-field">
                  <label className="cms-label">
                    <User size={14} className="text-emerald-700" />
                    <span>Full Legal Name</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="cms-input-group">
                    <User size={16} className="cms-input-icon" />
                    <input
                      type="text"
                      required
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      placeholder="Enter full legal name..."
                      className="cms-input"
                    />
                  </div>
                </div>

                <div className="cms-field">
                  <label className="cms-label">
                    <Briefcase size={14} className="text-emerald-700" />
                    <span>Role / Designation</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="cms-input-group">
                    <Briefcase size={16} className="cms-input-icon" />
                    <input
                      type="text"
                      required
                      value={editFormData.designation}
                      onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value })}
                      placeholder="e.g. President & Chief Coordinator"
                      className="cms-input"
                    />
                  </div>
                </div>
              </div>

              <div className="ref-form-grid-2">
                <div className="cms-field">
                  <label className="cms-label">
                    <Mail size={14} className="text-emerald-700" />
                    <span>Official Email Address</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="cms-input-group">
                    <Mail size={16} className="cms-input-icon" />
                    <input
                      type="email"
                      required
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      placeholder="Enter official email..."
                      className="cms-input"
                    />
                  </div>
                </div>

                <div className="cms-field">
                  <label className="cms-label">
                    <Phone size={14} className="text-emerald-700" />
                    <span>Primary Mobile Phone</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="cms-input-group">
                    <Phone size={16} className="cms-input-icon" />
                    <input
                      type="tel"
                      required
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      placeholder="Enter mobile phone..."
                      className="cms-input"
                    />
                  </div>
                </div>
              </div>

              <div className="cms-field">
                <label className="cms-label">
                  <MapPin size={14} className="text-emerald-700" />
                  <span>Head Secretariat Physical Address</span>
                </label>
                <div className="cms-input-group">
                  <MapPin size={16} className="cms-input-icon" />
                  <input
                    type="text"
                    value={editFormData.officeLocation}
                    onChange={(e) => setEditFormData({ ...editFormData, officeLocation: e.target.value })}
                    placeholder="Enter secretariat office address..."
                    className="cms-input"
                  />
                </div>
              </div>

              <div className="cms-field">
                <label className="cms-label">
                  <FileText size={14} className="text-emerald-700" />
                  <span>Bio &amp; Environmental Mission</span>
                </label>
                <textarea
                  rows={4}
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                  placeholder="Enter brief biographical summary..."
                  className="cms-textarea"
                />
              </div>
            </div>

            <div
              style={{
                padding: '1.15rem 1.75rem',
                borderTop: '1px solid #f1f5f9',
                background: '#f8fafc',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
              }}
            >
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="ref-modal-btn-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="ref-modal-btn-save"
              >
                <Check size={15} />
                <span>{saving ? 'Saving...' : 'Save & Update Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="ref-members-page">
      {/* 1. Page Header */}
      <div className="ref-members-header no-print">
        <div className="ref-header-left">
          <div className="ref-header-icon-box">
            <User size={24} />
          </div>
          <div className="ref-header-text">
            <h2>Admin Profile</h2>
            <p>Manage your administrator identity, official contact information, and security credentials.</p>
          </div>
        </div>

        <div className="ref-header-actions">
          <button
            type="button"
            onClick={openEditModal}
            className="ref-btn-enroll"
            title="Edit administrator profile details"
          >
            <Edit2 size={15} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* 2. Feedback Alert Banner */}
      {feedback.message && (
        <div className={`ref-alert-banner ${feedback.type === 'danger' ? 'ref-alert-error' : ''}`}>
          <div className="ref-alert-left">
            {feedback.type === 'danger' ? (
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ type: '', message: '' })}
            className="ref-alert-dismiss"
            title="Dismiss notification"
          >
            Dismiss &times;
          </button>
        </div>
      )}

      {/* 3. Pastel KPI Metric Strip */}
      <div className="ref-kpi-grid">
        <div className="ref-kpi-card" style={{ padding: '0.85rem 1rem', gap: '0.75rem' }}>
          <div className="ref-kpi-icon-bubble ref-bubble-blue" style={{ width: '38px', height: '38px', minWidth: '38px' }}>
            <ShieldCheck size={18} />
          </div>
          <div className="ref-kpi-details" style={{ minWidth: 0 }}>
            <span className="ref-kpi-value" style={{ fontSize: '0.98rem', fontWeight: 700, whiteSpace: 'nowrap', lineHeight: 1.25 }}>
              Super Admin
            </span>
            <span className="ref-kpi-label" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap', marginTop: '0.15rem' }}>
              System Access Role
            </span>
          </div>
        </div>

        <div className="ref-kpi-card" style={{ padding: '0.85rem 1rem', gap: '0.75rem' }}>
          <div className="ref-kpi-icon-bubble ref-bubble-green" style={{ width: '38px', height: '38px', minWidth: '38px' }}>
            <CheckCircle2 size={18} />
          </div>
          <div className="ref-kpi-details" style={{ minWidth: 0 }}>
            <span className="ref-kpi-value" style={{ fontSize: '0.98rem', fontWeight: 700, whiteSpace: 'nowrap', lineHeight: 1.25 }}>
              Verified Active
            </span>
            <span className="ref-kpi-label" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap', marginTop: '0.15rem' }}>
              Account Status
            </span>
          </div>
        </div>

        <div className="ref-kpi-card" style={{ padding: '0.85rem 1rem', gap: '0.75rem' }}>
          <div className="ref-kpi-icon-bubble ref-bubble-orange" style={{ width: '38px', height: '38px', minWidth: '38px' }}>
            <Calendar size={18} />
          </div>
          <div className="ref-kpi-details" style={{ minWidth: 0 }}>
            <span className="ref-kpi-value" style={{ fontSize: '0.98rem', fontWeight: 700, whiteSpace: 'nowrap', lineHeight: 1.25 }}>
              Since 2018
            </span>
            <span className="ref-kpi-label" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap', marginTop: '0.15rem' }}>
              Trustee Tenure
            </span>
          </div>
        </div>

        <div className="ref-kpi-card" style={{ padding: '0.85rem 1rem', gap: '0.75rem' }}>
          <div className="ref-kpi-icon-bubble ref-bubble-purple" style={{ width: '38px', height: '38px', minWidth: '38px' }}>
            <Key size={18} />
          </div>
          <div className="ref-kpi-details" style={{ minWidth: 0 }}>
            <span className="ref-kpi-value" style={{ fontSize: '0.98rem', fontWeight: 700, whiteSpace: 'nowrap', lineHeight: 1.25 }}>
              MongoDB Synced
            </span>
            <span className="ref-kpi-label" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap', marginTop: '0.15rem' }}>
              Cloud Database
            </span>
          </div>
        </div>
      </div>

      {/* 4. Split 2-Column Executive Profile Dashboard Layout */}
      <div className="ref-profile-split-layout">
        {/* LEFT COLUMN: Executive Profile Card */}
        <div className="ref-profile-sidebar-card">
          <div className="ref-profile-sidebar-banner"></div>
          
          <div className="ref-profile-sidebar-avatar-wrap">
            <div className="ref-profile-sidebar-avatar">
              <UserAvatar
                src={formData.avatar}
                name={formData.name}
                fallback="A"
                style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
              />
              <span className="ref-profile-online-badge" title="Active Account"></span>
            </div>
            <span className="eco-tier-pill eco-tier-patron" style={{ fontSize: '0.72rem' }}>
              <ShieldCheck size={12} />
              Super Admin
            </span>
          </div>

          <div className="ref-profile-sidebar-body">
            <div>
              <h3 className="ref-profile-sidebar-name">{formData.name}</h3>
              <p className="ref-profile-sidebar-role">{formData.designation}</p>
              <p className="ref-profile-sidebar-org">Godhavari Nadhi Paryavarana Parishubratha</p>
            </div>

            <div className="ref-profile-sidebar-meta-list">
              <div className="ref-profile-sidebar-meta-row">
                <Mail size={15} className="ref-profile-sidebar-meta-icon" />
                <span>{formData.email}</span>
              </div>
              <div className="ref-profile-sidebar-meta-row">
                <Phone size={15} className="ref-profile-sidebar-meta-icon" />
                <span>{formData.phone}</span>
              </div>
              <div className="ref-profile-sidebar-meta-row">
                <MapPin size={15} className="ref-profile-sidebar-meta-icon" />
                <span>Rajahmundry, Andhra Pradesh</span>
              </div>
              <div className="ref-profile-sidebar-meta-row">
                <Calendar size={15} className="ref-profile-sidebar-meta-icon" />
                <span>Trustee since 15 January 2018</span>
              </div>
            </div>

            <div className="ref-profile-sidebar-actions">
              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className="ref-btn-refresh"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Lock size={14} />
                <span>Change Password</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tabbed Content Container */}
        <div>
          {/* Section Navigation Tabs */}
          <div className="cms-tabs-bar no-print" style={{ marginBottom: '1.25rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`cms-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <User size={15} />
              <span>Overview & Contact</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`cms-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            >
              <Lock size={15} />
              <span>Security & Passwords</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mandates')}
              className={`cms-tab-btn ${activeTab === 'mandates' ? 'active' : ''}`}
            >
              <Waves size={15} />
              <span>Ghat Stewardship</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW & CONTACT DETAILS */}
          {activeTab === 'overview' && (
            <div className="cms-section-card">
              <div className="cms-section-header">
                <div className="cms-section-header-left">
                  <div className="cms-section-icon-box emerald">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="cms-section-title">Verified Profile Details</h3>
                    <p className="cms-section-desc">Official administrator identity, headquarters address, and stewardship bio.</p>
                  </div>
                </div>
              </div>

              <div className="ref-profile-details-grid">
                <div className="ref-profile-detail-item">
                  <span className="ref-profile-detail-label">
                    <User size={13} className="text-emerald-700" />
                    <span>Full Legal Name</span>
                  </span>
                  <span className="ref-profile-detail-value">{formData.name}</span>
                </div>

                <div className="ref-profile-detail-item">
                  <span className="ref-profile-detail-label">
                    <Briefcase size={13} className="text-emerald-700" />
                    <span>Role / Designation</span>
                  </span>
                  <span className="ref-profile-detail-value">
                    {formData.designation}
                    <span className="eco-tier-pill eco-tier-patron" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                      Super Admin
                    </span>
                  </span>
                </div>

                <div className="ref-profile-detail-item">
                  <span className="ref-profile-detail-label">
                    <Mail size={13} className="text-emerald-700" />
                    <span>Official Email Address</span>
                  </span>
                  <span className="ref-profile-detail-value">
                    {formData.email}
                    <span className="eco-status-pill status-active" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                      Verified
                    </span>
                  </span>
                </div>

                <div className="ref-profile-detail-item">
                  <span className="ref-profile-detail-label">
                    <Phone size={13} className="text-emerald-700" />
                    <span>Primary Contact Mobile</span>
                  </span>
                  <span className="ref-profile-detail-value">
                    {formData.phone}
                    <span className="eco-status-pill status-active" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                      Primary
                    </span>
                  </span>
                </div>

                <div className="ref-profile-detail-item" style={{ gridColumn: 'span 2' }}>
                  <span className="ref-profile-detail-label">
                    <MapPin size={13} className="text-emerald-700" />
                    <span>Head Secretariat Physical Address</span>
                  </span>
                  <span className="ref-profile-detail-value" style={{ fontWeight: 600, color: '#334155' }}>
                    {formData.officeLocation || 'Godavari Bund Road, Near Kotilingala Ghat, Rajahmundry, Andhra Pradesh'}
                  </span>
                </div>

                <div className="ref-profile-bio-box">
                  <span className="ref-profile-detail-label" style={{ color: '#065f46' }}>
                    <FileText size={13} className="text-emerald-700" />
                    <span>Environmental Mission & Stewardship Bio</span>
                  </span>
                  <p className="ref-profile-bio-text">
                    "{formData.bio || 'Dedicated environmentalist leading the cleanup and revival of the sacred River Godavari since 2018.'}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECURITY & PASSWORDS */}
          {activeTab === 'security' && (
            <div className="cms-section-card">
              <div className="cms-section-header">
                <div className="cms-section-header-left">
                  <div className="cms-section-icon-box amber">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h3 className="cms-section-title">Security & Password Management</h3>
                    <p className="cms-section-desc">Change your password and manage administrative authentication.</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.5rem' }}>
                <form onSubmit={handlePasswordSubmit} style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="cms-field">
                    <label className="cms-label">
                      <Key size={14} className="text-emerald-700" />
                      <span>Current Password</span>
                      <span className="required-star">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Enter current password..."
                      className="cms-input no-icon"
                    />
                  </div>

                  <div className="cms-field">
                    <label className="cms-label">
                      <Lock size={14} className="text-emerald-700" />
                      <span>New Password</span>
                      <span className="required-star">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter new password (min. 6 characters)..."
                      className="cms-input no-icon"
                    />
                  </div>

                  <div className="cms-field">
                    <label className="cms-label">
                      <CheckCircle2 size={14} className="text-emerald-700" />
                      <span>Confirm New Password</span>
                      <span className="required-star">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password..."
                      className="cms-input no-icon"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="ref-btn-enroll"
                    style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                  >
                    <Check size={16} />
                    <span>{passwordSaving ? 'Updating...' : 'Save New Password'}</span>
                  </button>
                </form>

                <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
                  <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
                  <span>Passwords are salted and securely hashed with bcrypt before saving to MongoDB Atlas.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GHAT STEWARDSHIP MANDATES */}
          {activeTab === 'mandates' && (
            <div className="cms-section-card">
              <div className="cms-section-header">
                <div className="cms-section-header-left">
                  <div className="cms-section-icon-box emerald">
                    <Waves size={20} />
                  </div>
                  <div>
                    <h3 className="cms-section-title">Riverfront Stewardship Mandates</h3>
                    <p className="cms-section-desc">Designated sacred Godavari riverbank reaches stewarded by Dr. K. V. Subba Rao.</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.96rem', color: '#0f172a' }}>Kotilingala Temple Ghat Reach</h4>
                    <span className="eco-status-pill status-active">Primary Lead</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.55, margin: '0.35rem 0 0.85rem 0' }}>
                    Oversees daily municipal waste interception, segregated bio-waste collection, and devotee awareness booths.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, color: '#047857' }}>
                    <span>48 Cleanliness Drives</span>
                    <span>96% Cleanliness Score</span>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.96rem', color: '#0f172a' }}>Pushkar Ghat Promenade Reach</h4>
                    <span className="eco-status-pill status-active">Stewardship Lead</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.55, margin: '0.35rem 0 0.85rem 0' }}>
                    Directs mass festival cleanliness drives, clay idol distribution counters, and volunteer deployment.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, color: '#047857' }}>
                    <span>38 Cleanliness Drives</span>
                    <span>92% Cleanliness Score</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminProfile;
