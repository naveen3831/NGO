import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { recordAdminAction } from '../../services/auditService';
import { uploadImageToCloud } from '../../utils/imageUtils';
import {
  Building2,
  Target,
  Eye,
  BarChart3,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Recycle,
  Waves,
  TreePine,
  Save,
  CheckCircle2,
  AlertTriangle,
  Landmark,
  ShieldCheck,
  ExternalLink,
  Info,
  Globe,
  Layers,
  Edit2,
} from 'lucide-react';

const defaultWebsiteData = {
  orgName: 'Godhavari Nadhi Paryavarana Parishubratha',
  logoUrl: '',
  tagline: 'Dedicated to the cleanliness, ecological revival, and purity of the sacred River Godavari',
  mission: 'To restore and protect the sacred Godavari River through sustained community cleanliness drives, riverbed desiltation, plastic pollution prevention, and widespread environmental awareness.',
  vision: 'A pristine, free-flowing, and vibrant River Godavari cherished and guarded by every riverbank community for generations to come.',
  statistics: {
    cleanlinessDrives: 142,
    volunteersActive: 1250,
    wasteRemovedTons: 85,
    ghatsCleaned: 18,
    treesPlanted: 3500,
  },
  contactInfo: {
    email: 'contact@godhavarinadhiorg.in',
    phone: '+91 883 245 7890',
    helpline: '+91 944 012 3456',
    address: 'Godavari Bund Road, Near Kotilingala Ghat, Rajahmundry, Andhra Pradesh - 533101',
    officeHours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
  },
};

const AdminWebsite = () => {
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [activeTab, setActiveTab] = useState('branding'); // 'branding' | 'metrics' | 'contact' | 'all'
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Pre-filled with authentic NGO details by default so boxes are never empty
  const [formData, setFormData] = useState(defaultWebsiteData);

  // Per-section Edit Toggle (Branding, Metrics, Contact)
  const [editingSections, setEditingSections] = useState({
    branding: false,
    metrics: false,
    contact: false,
  });

  const toggleSectionEdit = (sectionKey) => {
    setEditingSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Fetch saved content from backend on mount
  useEffect(() => {
    const fetchWebsiteData = async () => {
      try {
        const res = await api.get('/admin/website');
        if (res.data) {
          setFormData({
            orgName: res.data.orgName || defaultWebsiteData.orgName,
            logoUrl: res.data.logoUrl || '',
            tagline: res.data.tagline || defaultWebsiteData.tagline,
            mission: res.data.mission || defaultWebsiteData.mission,
            vision: res.data.vision || defaultWebsiteData.vision,
            statistics: {
              cleanlinessDrives:
                res.data.statistics?.cleanlinessDrives ??
                defaultWebsiteData.statistics.cleanlinessDrives,
              volunteersActive:
                res.data.statistics?.volunteersActive ??
                defaultWebsiteData.statistics.volunteersActive,
              wasteRemovedTons:
                res.data.statistics?.wasteRemovedTons ??
                defaultWebsiteData.statistics.wasteRemovedTons,
              ghatsCleaned:
                res.data.statistics?.ghatsCleaned ??
                defaultWebsiteData.statistics.ghatsCleaned,
              treesPlanted:
                res.data.statistics?.treesPlanted ??
                defaultWebsiteData.statistics.treesPlanted,
            },
            contactInfo: {
              email: res.data.contactInfo?.email || defaultWebsiteData.contactInfo.email,
              phone: res.data.contactInfo?.phone || defaultWebsiteData.contactInfo.phone,
              helpline:
                res.data.contactInfo?.helpline || defaultWebsiteData.contactInfo.helpline,
              address:
                res.data.contactInfo?.address || defaultWebsiteData.contactInfo.address,
              officeHours:
                res.data.contactInfo?.officeHours || defaultWebsiteData.contactInfo.officeHours,
            },
          });
        }
      } catch (err) {
        // Fallback to default NGO details so boxes are always pre-populated
        setFormData(defaultWebsiteData);
      }
    };

    fetchWebsiteData();
  }, []);

  const handleResetDefaults = () => {
    setFormData(defaultWebsiteData);
    setFeedback({
      type: 'info',
      message: 'Restored authentic Godhavari NGO organization details into all boxes.',
    });
  };

  const handleClearAll = () => {
    setFormData({
      orgName: '',
      tagline: '',
      mission: '',
      vision: '',
      statistics: {
        cleanlinessDrives: '',
        volunteersActive: '',
        wasteRemovedTons: '',
        ghatsCleaned: '',
        treesPlanted: '',
      },
      contactInfo: {
        email: '',
        phone: '',
        helpline: '',
        address: '',
        officeHours: '',
      },
    });
    setFeedback({
      type: 'info',
      message: 'All boxes cleared. You can type custom details or click "Restore Defaults".',
    });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      const { data: saved } = await api.patch('/admin/website', formData);
      const persistedLogo = saved?.logoUrl !== undefined ? saved.logoUrl : formData.logoUrl || '';
      setFormData((prev) => ({ ...prev, logoUrl: persistedLogo }));
      window.dispatchEvent(
        new CustomEvent('ngo-logo-updated', { detail: { logoUrl: persistedLogo } })
      );
      setFeedback({
        type: 'success',
        message: 'Organization content & live statistics successfully saved and published!',
      });
      recordAdminAction({
        action: 'Published updated homepage identity, mission & live impact statistics',
        category: 'CMS',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to save content.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStatChange = (key, val) => {
    const num = val === '' ? '' : Math.max(0, parseInt(val, 10) || 0);
    setFormData((prev) => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        [key]: num,
      },
    }));
  };

  const handleContactChange = (key, val) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [key]: val,
      },
    }));
  };

  return (
    <div className="ref-members-page">
      {/* 1. Header Row */}
      <div className="ref-members-header no-print">
        <div className="ref-header-left">
          <div className="ref-header-icon-box">
            <Globe size={24} />
          </div>
          <div className="ref-header-text">
            <h2>Website Content & Organization Identity</h2>
            <p>Configure homepage branding, dynamic impact counters, and official contact helplines.</p>
          </div>
        </div>

        <div className="ref-header-actions">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="ref-btn-refresh"
            style={{ textDecoration: 'none' }}
            title="View public website portal"
          >
            <ExternalLink size={14} />
            <span>View Public Site</span>
          </a>

          <button
            type="button"
            onClick={handleSubmit}
            className="ref-btn-enroll"
            disabled={saving}
            title="Save and publish content"
          >
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* 2. Feedback Alert Banner */}
      {feedback.message && (
        <div className={`ref-alert-banner ${feedback.type === 'danger' ? 'ref-alert-error' : ''}`}>
          <div className="ref-alert-left">
            {feedback.type === 'danger' ? (
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
            ) : feedback.type === 'info' ? (
              <Info size={18} className="text-blue-500 flex-shrink-0" />
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
            &times;
          </button>
        </div>
      )}

      {/* 3. Section Navigation Tabs */}
      <div className="ref-filter-tabs no-print">
        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`ref-tab-btn ${activeTab === 'branding' ? 'active' : ''}`}
        >
          <Building2 size={15} />
          <span>Branding & Identity</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('metrics')}
          className={`ref-tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
        >
          <BarChart3 size={15} />
          <span>Impact Numbers (5)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`ref-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
        >
          <Phone size={15} />
          <span>Contact & Helplines</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`ref-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
        >
          <Layers size={15} />
          <span>All Sections</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* =========================================================================
            SECTION 1: Organization Branding & Core Identity
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'branding') && (
          <div className="cms-section-card">
            <div className="cms-section-header">
              <div className="cms-section-header-left">
                <div className="cms-section-icon-box emerald">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="cms-section-title">Organization Identity & Branding</h3>
                  <p className="cms-section-desc">Official legal organization identity, hero title, and core mission/vision statements.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => toggleSectionEdit('branding')}
                  className="ref-btn-edit-action"
                  style={{
                    height: '28px',
                    padding: '0 0.65rem',
                    gap: '0.35rem',
                    backgroundColor: editingSections.branding ? '#ecfdf5' : '#ffffff',
                    borderColor: editingSections.branding ? '#059669' : '#e2e8f0',
                    color: editingSections.branding ? '#065f46' : '#334155',
                  }}
                  title="Toggle edit mode for Organization Identity"
                >
                  <Edit2 size={13} />
                  <span>{editingSections.branding ? 'Done' : 'Edit'}</span>
                </button>

                <span className="eco-tier-pill eco-tier-volunteer">
                  Core Profile
                </span>
              </div>
            </div>

            <div className="cms-section-body">
              {/* Organization Logo Upload / URL */}
              <div className="cms-field" style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
                <label className="cms-label">
                  <Sparkles size={14} className="text-emerald-700" />
                  <span>Organization Logo</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      border: '1px solid #d1fae5',
                      background: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Organization Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#047857', textAlign: 'center' }}>Default SVG</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingLogo}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        if (!file) return;
                        setUploadingLogo(true);
                        setFeedback({ type: '', message: '' });
                        try {
                          const uploaded = await uploadImageToCloud(file, 'branding', '/admin/upload');
                          setFormData((prev) => ({ ...prev, logoUrl: uploaded.url }));
                          setFeedback({
                            type: 'success',
                            message: 'Logo uploaded to Cloudinary. Click Save & Publish to store it in MongoDB.',
                          });
                        } catch (err) {
                          setFeedback({
                            type: 'danger',
                            message: err.response?.data?.message || err.message || 'Failed to upload logo to Cloudinary.',
                          });
                        } finally {
                          setUploadingLogo(false);
                        }
                      }}
                      className="cms-input"
                      style={{ flex: '1 1 200px', padding: '0.45rem 0.65rem' }}
                    />
                    {uploadingLogo && (
                      <span style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 600 }}>
                        Uploading to Cloudinary...
                      </span>
                    )}
                    <input
                      type="url"
                      placeholder="Or paste logo image URL (https://...)"
                      value={formData.logoUrl?.startsWith('data:') ? '' : formData.logoUrl || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, logoUrl: e.target.value }))}
                      className="cms-input"
                      style={{ flex: '1 1 220px' }}
                    />
                    {formData.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, logoUrl: '' }))}
                        className="eco-cms-btn-secondary"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
                      >
                        Reset to Default
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 2-Column: Official Name & Tagline */}
              <div className="ref-form-grid-2">
                <div className="cms-field">
                  <label className="cms-label">
                    <Landmark size={14} className="text-emerald-700" />
                    <span>Organization Official Name</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="cms-input-group">
                    <Landmark size={16} className="cms-input-icon" />
                    <input
                      type="text"
                      required
                      value={formData.orgName}
                      onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                      readOnly={!editingSections.branding}
                      placeholder="e.g. Godhavari Nadhi Paryavarana Parishubratha"
                      className="cms-input"
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: editingSections.branding ? '#059669' : '#e2e8f0',
                        boxShadow: editingSections.branding ? '0 0 0 2px rgba(5, 150, 105, 0.12)' : 'none',
                        color: '#0f172a',
                        fontWeight: 600,
                      }}
                    />
                  </div>
                </div>

                <div className="cms-field">
                  <label className="cms-label">
                    <Sparkles size={14} className="text-emerald-700" />
                    <span>Header / Hero Tagline</span>
                    <span className="required-star">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    readOnly={!editingSections.branding}
                    placeholder="e.g. Dedicated to the cleanliness, ecological revival, and purity of the sacred River Godavari"
                    className="cms-textarea"
                    style={{
                      minHeight: '44px',
                      resize: 'vertical',
                      backgroundColor: '#ffffff',
                      borderColor: editingSections.branding ? '#059669' : '#e2e8f0',
                      boxShadow: editingSections.branding ? '0 0 0 2px rgba(5, 150, 105, 0.12)' : 'none',
                      color: '#0f172a',
                      fontWeight: 500,
                      lineHeight: '1.45',
                    }}
                  />
                </div>
              </div>

              {/* 2-Column: Mission & Vision */}
              <div className="ref-form-grid-2" style={{ marginTop: '0.75rem' }}>
                <div className="cms-field">
                  <label className="cms-label">
                    <Target size={14} className="text-emerald-700" />
                    <span>Mission Statement</span>
                    <span className="required-star">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    readOnly={!editingSections.branding}
                    placeholder="Enter organization mission statement..."
                    className="cms-textarea"
                    style={{
                      backgroundColor: '#ffffff',
                      borderColor: editingSections.branding ? '#059669' : '#e2e8f0',
                      boxShadow: editingSections.branding ? '0 0 0 2px rgba(5, 150, 105, 0.12)' : 'none',
                      color: '#0f172a',
                      lineHeight: '1.55',
                    }}
                  />
                </div>

                <div className="cms-field">
                  <label className="cms-label">
                    <Eye size={14} className="text-emerald-700" />
                    <span>Vision Statement</span>
                    <span className="required-star">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.vision}
                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                    readOnly={!editingSections.branding}
                    placeholder="Enter organization vision statement..."
                    className="cms-textarea"
                    style={{
                      backgroundColor: '#ffffff',
                      borderColor: editingSections.branding ? '#059669' : '#e2e8f0',
                      boxShadow: editingSections.branding ? '0 0 0 2px rgba(5, 150, 105, 0.12)' : 'none',
                      color: '#0f172a',
                      lineHeight: '1.55',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 2: Public Impact Metrics (5 Counters)
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'metrics') && (
          <div className="cms-section-card">
            <div className="cms-section-header">
              <div className="cms-section-header-left">
                <div className="cms-section-icon-box blue">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="cms-section-title">Public Impact Metrics</h3>
                  <p className="cms-section-desc">These 5 counters update across the public homepage and awareness displays.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => toggleSectionEdit('metrics')}
                  className="ref-btn-edit-action"
                  style={{
                    height: '28px',
                    padding: '0 0.65rem',
                    gap: '0.35rem',
                    backgroundColor: editingSections.metrics ? '#eff6ff' : '#ffffff',
                    borderColor: editingSections.metrics ? '#2563eb' : '#e2e8f0',
                    color: editingSections.metrics ? '#1d4ed8' : '#334155',
                  }}
                  title="Toggle edit mode for Impact Metrics"
                >
                  <Edit2 size={13} />
                  <span>{editingSections.metrics ? 'Done' : 'Edit'}</span>
                </button>

                <span className="eco-tier-pill eco-tier-patron">
                  5 Live Counters
                </span>
              </div>
            </div>

            <div className="cms-section-body">
              <div className="cms-metrics-row">
                {/* Metric 1: Cleanliness Drives */}
                <div className="cms-metric-card">
                  <div className="cms-metric-card-top">
                    <div className="cms-metric-bubble" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                      <Sparkles size={16} />
                    </div>
                    <span className="metric-tag-pill green">Drives</span>
                  </div>
                  <span className="cms-metric-card-label">Cleanliness Drives</span>
                  <div className="cms-metric-input-container">
                    <input
                      type="number"
                      min="0"
                      value={formData.statistics.cleanlinessDrives}
                      onChange={(e) => handleStatChange('cleanlinessDrives', e.target.value)}
                      readOnly={!editingSections.metrics}
                      placeholder="142"
                      className="cms-metric-val-input"
                    />
                    <span className="cms-metric-suffix">Drives</span>
                  </div>
                  <span className="cms-metric-footer-note">Total Drives Completed</span>
                </div>

                {/* Metric 2: Volunteers Engaged */}
                <div className="cms-metric-card">
                  <div className="cms-metric-card-top">
                    <div className="cms-metric-bubble" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                      <Users size={16} />
                    </div>
                    <span className="metric-tag-pill blue">Volunteers</span>
                  </div>
                  <span className="cms-metric-card-label">Active Volunteers</span>
                  <div className="cms-metric-input-container">
                    <input
                      type="number"
                      min="0"
                      value={formData.statistics.volunteersActive}
                      onChange={(e) => handleStatChange('volunteersActive', e.target.value)}
                      readOnly={!editingSections.metrics}
                      placeholder="1250"
                      className="cms-metric-val-input"
                    />
                    <span className="cms-metric-suffix">Active</span>
                  </div>
                  <span className="cms-metric-footer-note">Registered Stewards</span>
                </div>

                {/* Metric 3: Waste Removed (Tons) */}
                <div className="cms-metric-card">
                  <div className="cms-metric-card-top">
                    <div className="cms-metric-bubble" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
                      <Recycle size={16} />
                    </div>
                    <span className="metric-tag-pill amber">Tons</span>
                  </div>
                  <span className="cms-metric-card-label">Waste Removed</span>
                  <div className="cms-metric-input-container">
                    <input
                      type="number"
                      min="0"
                      value={formData.statistics.wasteRemovedTons}
                      onChange={(e) => handleStatChange('wasteRemovedTons', e.target.value)}
                      readOnly={!editingSections.metrics}
                      placeholder="85"
                      className="cms-metric-val-input"
                    />
                    <span className="cms-metric-suffix">Tons</span>
                  </div>
                  <span className="cms-metric-footer-note">Metric Tons Intercepted</span>
                </div>

                {/* Metric 4: River Ghats Cleaned */}
                <div className="cms-metric-card">
                  <div className="cms-metric-card-top">
                    <div className="cms-metric-bubble" style={{ backgroundColor: '#ecfeff', color: '#0891b2' }}>
                      <Waves size={16} />
                    </div>
                    <span className="metric-tag-pill cyan">Ghats</span>
                  </div>
                  <span className="cms-metric-card-label">Ghats Restored</span>
                  <div className="cms-metric-input-container">
                    <input
                      type="number"
                      min="0"
                      value={formData.statistics.ghatsCleaned}
                      onChange={(e) => handleStatChange('ghatsCleaned', e.target.value)}
                      readOnly={!editingSections.metrics}
                      placeholder="18"
                      className="cms-metric-val-input"
                    />
                    <span className="cms-metric-suffix">Ghats</span>
                  </div>
                  <span className="cms-metric-footer-note">Protected Riverfront Ghats</span>
                </div>

                {/* Metric 5: Trees Planted */}
                <div className="cms-metric-card">
                  <div className="cms-metric-card-top">
                    <div className="cms-metric-bubble" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}>
                      <TreePine size={16} />
                    </div>
                    <span className="metric-tag-pill emerald">Trees</span>
                  </div>
                  <span className="cms-metric-card-label">Trees Planted</span>
                  <div className="cms-metric-input-container">
                    <input
                      type="number"
                      min="0"
                      value={formData.statistics.treesPlanted}
                      onChange={(e) => handleStatChange('treesPlanted', e.target.value)}
                      readOnly={!editingSections.metrics}
                      placeholder="3500"
                      className="cms-metric-val-input"
                    />
                    <span className="cms-metric-suffix">Trees</span>
                  </div>
                  <span className="cms-metric-footer-note">Riparian Buffer Saplings</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 3: Official Contact & Helplines
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'contact') && (
          <div className="cms-section-card">
            <div className="cms-section-header">
              <div className="cms-section-header-left">
                <div className="cms-section-icon-box amber">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="cms-section-title">Secretariat Contact & Helplines</h3>
                  <p className="cms-section-desc">Public helpline channels, secretariat headquarters address, and operating schedule.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => toggleSectionEdit('contact')}
                  className="ref-btn-edit-action"
                  style={{
                    height: '28px',
                    padding: '0 0.65rem',
                    gap: '0.35rem',
                    backgroundColor: editingSections.contact ? '#ecfdf5' : '#ffffff',
                    borderColor: editingSections.contact ? '#059669' : '#e2e8f0',
                    color: editingSections.contact ? '#065f46' : '#334155',
                  }}
                  title="Toggle edit mode for Contact & Helplines"
                >
                  <Edit2 size={13} />
                  <span>{editingSections.contact ? 'Done' : 'Edit'}</span>
                </button>

                <span className="eco-tier-pill eco-tier-annual">
                  Public Helplines
                </span>
              </div>
            </div>

            <div className="cms-section-body">
              {/* 3-Column: Email, Phone, Helpline */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
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
                      value={formData.contactInfo.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      readOnly={!editingSections.contact}
                      placeholder="e.g. contact@godhavarinadhiorg.in"
                      className="cms-input"
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: editingSections.contact ? '#059669' : '#e2e8f0',
                        boxShadow: editingSections.contact ? '0 0 0 2px rgba(5, 150, 105, 0.12)' : 'none',
                        color: '#0f172a',
                        fontWeight: 500,
                      }}
                    />
                  </div>
                </div>

                <div className="cms-field">
                  <label className="cms-label">
                    <Phone size={14} className="text-emerald-700" />
                    <span>Office Landline / Phone</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="cms-input-group">
                    <Phone size={16} className="cms-input-icon" />
                    <input
                      type="text"
                      required
                      value={formData.contactInfo.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      readOnly={!editingSections.contact}
                      placeholder="e.g. +91 883 245 7890"
                      className="cms-input"
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: editingSections.contact ? '#059669' : '#e2e8f0',
                        boxShadow: editingSections.contact ? '0 0 0 2px rgba(5, 150, 105, 0.12)' : 'none',
                        color: '#0f172a',
                        fontWeight: 500,
                      }}
                    />
                  </div>
                </div>

                <div className="cms-field">
                  <label className="cms-label">
                    <AlertTriangle size={14} className="text-rose-600" />
                    <span className="text-rose-800">Emergency River Helpline</span>
                    <span className="emergency-badge">24/7 Live</span>
                  </label>
                  <div className="cms-input-group">
                    <Phone size={16} className="cms-input-icon text-rose-600" />
                    <input
                      type="text"
                      required
                      value={formData.contactInfo.helpline}
                      onChange={(e) => handleContactChange('helpline', e.target.value)}
                      readOnly={!editingSections.contact}
                      placeholder="e.g. +91 944 012 3456"
                      className="cms-input"
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: editingSections.contact ? '#059669' : '#fca5a5',
                        boxShadow: editingSections.contact ? '0 0 0 2px rgba(5, 150, 105, 0.12)' : 'none',
                        color: '#0f172a',
                        fontWeight: 600,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 2-Column: Physical Address & Operating Hours */}
              <div className="ref-form-grid-2" style={{ marginTop: '0.75rem' }}>
                <div className="cms-field">
                  <label className="cms-label">
                    <MapPin size={14} className="text-emerald-700" />
                    <span>Head Office Physical Address</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="cms-input-group">
                    <MapPin size={16} className="cms-input-icon" />
                    <input
                      type="text"
                      required
                      value={formData.contactInfo.address}
                      onChange={(e) => handleContactChange('address', e.target.value)}
                      readOnly={!editingSections.contact}
                      placeholder="e.g. Godavari Bund Road, Near Kotilingala Ghat, Rajahmundry"
                      className="cms-input"
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: editingSections.contact ? '#059669' : '#e2e8f0',
                        boxShadow: editingSections.contact ? '0 0 0 2px rgba(5, 150, 105, 0.12)' : 'none',
                        color: '#0f172a',
                        fontWeight: 500,
                      }}
                    />
                  </div>
                </div>

                <div className="cms-field">
                  <label className="cms-label">
                    <Clock size={14} className="text-emerald-700" />
                    <span>Office Operating Hours</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="cms-input-group">
                    <Clock size={16} className="cms-input-icon" />
                    <input
                      type="text"
                      required
                      value={formData.contactInfo.officeHours}
                      onChange={(e) => handleContactChange('officeHours', e.target.value)}
                      readOnly={!editingSections.contact}
                      placeholder="e.g. Monday - Saturday: 9:00 AM - 6:00 PM"
                      className="cms-input"
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: editingSections.contact ? '#059669' : '#e2e8f0',
                        boxShadow: editingSections.contact ? '0 0 0 2px rgba(5, 150, 105, 0.12)' : 'none',
                        color: '#0f172a',
                        fontWeight: 500,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            BOTTOM ACTION DOCK
            ========================================================================= */}
        <div className="eco-cms-bottom-bar">
          <div className="eco-cms-bottom-meta">
            <ShieldCheck size={18} className="text-emerald-600" />
            <span>
              All updates are saved securely to MongoDB Atlas.
            </span>
          </div>

          <div className="eco-cms-bottom-actions">
            <button
              type="submit"
              disabled={saving}
              className="ref-btn-enroll"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminWebsite;
