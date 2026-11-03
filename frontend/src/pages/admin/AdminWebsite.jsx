import React, { useState, useEffect } from 'react';
import api from '../../services/api';
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
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Landmark,
  ShieldCheck,
  ExternalLink,
  Info,
} from 'lucide-react';

const AdminWebsite = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    orgName: 'Godhavari Nadhi Paryavarana Parishubratha',
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
  });

  const fetchWebsiteData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/website');
      if (res.data) {
        setFormData({
          orgName: res.data.orgName || 'Godhavari Nadhi Paryavarana Parishubratha',
          tagline: res.data.tagline || '',
          mission: res.data.mission || '',
          vision: res.data.vision || '',
          statistics: {
            cleanlinessDrives: res.data.statistics?.cleanlinessDrives ?? 142,
            volunteersActive: res.data.statistics?.volunteersActive ?? 1250,
            wasteRemovedTons: res.data.statistics?.wasteRemovedTons ?? 85,
            ghatsCleaned: res.data.statistics?.ghatsCleaned ?? 18,
            treesPlanted: res.data.statistics?.treesPlanted ?? 3500,
          },
          contactInfo: {
            email: res.data.contactInfo?.email || 'contact@godhavarinadhiorg.in',
            phone: res.data.contactInfo?.phone || '+91 883 245 7890',
            helpline: res.data.contactInfo?.helpline || '+91 944 012 3456',
            address: res.data.contactInfo?.address || 'Godavari Bund Road, Rajahmundry, AP',
            officeHours: res.data.contactInfo?.officeHours || 'Monday - Saturday: 9:00 AM - 6:00 PM',
          },
        });
      }
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: 'Could not load existing website CMS data from MongoDB.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsiteData();
  }, []);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      await api.patch('/admin/website', formData);
      setFeedback({
        type: 'success',
        message: 'Website CMS details successfully saved and updated in MongoDB database!',
      });
      // Scroll smoothly to top notification
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to persist website updates to database.',
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
    <div className="eco-cms-page">
      {/* CMS Header Section with Actions */}
      <div className="eco-cms-header-row">
        <div className="eco-cms-header-info">
          <div className="eco-cms-badge-row">
            <span className="eco-cms-live-badge">
              <span className="live-dot-pulse"></span>
              Live CMS &bull; MongoDB Atlas Connected
            </span>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="eco-cms-preview-link"
              title="View live website"
            >
              <span>View Public Portal</span>
              <ExternalLink size={12} />
            </a>
          </div>
          <h1 className="eco-cms-main-title">Website Content Management</h1>
          <p className="eco-cms-sub-title">
            Configure organization mission, vision statements, public impact metrics, and emergency helplines stored in MongoDB.
          </p>
        </div>

        <div className="eco-cms-header-actions">
          <button
            type="button"
            onClick={fetchWebsiteData}
            className="eco-cms-btn-secondary"
            disabled={loading}
            title="Reload live content from database"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Reload Live Content</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="eco-cms-btn-primary"
            disabled={saving || loading}
          >
            <Save size={14} />
            <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Alert / Feedback Notification */}
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

      {loading ? (
        <div className="eco-cms-loading-box">
          <RefreshCw size={28} className="animate-spin text-emerald-800 mb-3" />
          <p className="font-semibold text-gray-800">Loading website configuration from MongoDB...</p>
          <span className="text-xs text-gray-500">Retrieving official organization profile & metrics</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="eco-cms-form-flow">
          {/* Card 1: Organization Branding & Core Statements */}
          <div className="eco-cms-card">
            <div className="eco-cms-card-header">
              <div className="eco-cms-card-icon-tile green">
                <Building2 size={20} />
              </div>
              <div>
                <h2 className="eco-cms-card-title">Organization Identity &amp; Branding</h2>
                <p className="eco-cms-card-subtitle">
                  Configure legal NGO identity, hero title, and official mission/vision statements.
                </p>
              </div>
            </div>

            <div className="eco-cms-card-body">
              {/* Official Name */}
              <div className="eco-form-field-group">
                <label className="eco-form-label">
                  <Landmark size={14} className="text-emerald-700" />
                  <span>Organization Official Name</span>
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.orgName}
                  onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                  placeholder="e.g. Godhavari Nadhi Paryavarana Parishubratha"
                  className="eco-form-input"
                />
                <span className="eco-form-help-text">
                  This official name appears on the navbar brand, public footer, and membership ID cards.
                </span>
              </div>

              {/* Tagline */}
              <div className="eco-form-field-group">
                <label className="eco-form-label">
                  <Sparkles size={14} className="text-emerald-700" />
                  <span>Header / Hero Tagline</span>
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Preserving the Purity, Ecological Splendor, and Spiritual Heritage of the Sacred Godavari River"
                  className="eco-form-input"
                />
                <span className="eco-form-help-text">
                  Hero tagline shown prominently beneath the main homepage heading.
                </span>
              </div>

              {/* Mission & Vision Side-by-Side Grid */}
              <div className="eco-cms-grid-2">
                <div className="eco-form-field-group">
                  <label className="eco-form-label">
                    <Target size={14} className="text-emerald-700" />
                    <span>Mission Statement</span>
                    <span className="required-star">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    placeholder="Enter the primary mission statement..."
                    className="eco-form-textarea"
                  />
                  <span className="eco-form-help-text">
                    Defines the core operational objectives of our river cleanliness movement.
                  </span>
                </div>

                <div className="eco-form-field-group">
                  <label className="eco-form-label">
                    <Eye size={14} className="text-emerald-700" />
                    <span>Vision Statement</span>
                    <span className="required-star">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.vision}
                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                    placeholder="Enter the long-term vision statement..."
                    className="eco-form-textarea"
                  />
                  <span className="eco-form-help-text">
                    Outlines the ecological future we strive to realize along the Godavari.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Public Impact Metrics (Balanced 5-Column Executive Editor) */}
          <div className="eco-cms-card">
            <div className="eco-cms-card-header">
              <div className="eco-cms-card-icon-tile teal">
                <BarChart3 size={20} />
              </div>
              <div>
                <h2 className="eco-cms-card-title">Public Impact Metrics</h2>
                <p className="eco-cms-card-subtitle">
                  These verified numbers highlight the collective achievements on the home and awareness pages.
                </p>
              </div>
            </div>

            <div className="eco-cms-card-body">
              <div className="eco-metric-editor-grid">
                {/* Metric 1: Cleanliness Drives */}
                <div className="eco-metric-input-card card-green">
                  <div className="metric-tile-header">
                    <div className="metric-tile-icon-bubble green">
                      <Sparkles size={16} />
                    </div>
                    <span className="metric-tag-pill green">Drives</span>
                  </div>
                  <div className="metric-tile-label">Cleanliness Drives</div>
                  <div className="metric-input-wrapper">
                    <input
                      type="number"
                      min="0"
                      value={formData.statistics.cleanlinessDrives}
                      onChange={(e) => handleStatChange('cleanlinessDrives', e.target.value)}
                      className="eco-metric-number-field"
                    />
                  </div>
                  <span className="metric-tile-footnote">Drives Completed</span>
                </div>

                {/* Metric 2: Volunteers Engaged */}
                <div className="eco-metric-input-card card-blue">
                  <div className="metric-tile-header">
                    <div className="metric-tile-icon-bubble blue">
                      <Users size={16} />
                    </div>
                    <span className="metric-tag-pill blue">Volunteers</span>
                  </div>
                  <div className="metric-tile-label">Active Volunteers</div>
                  <div className="metric-input-wrapper">
                    <input
                      type="number"
                      min="0"
                      value={formData.statistics.volunteersActive}
                      onChange={(e) => handleStatChange('volunteersActive', e.target.value)}
                      className="eco-metric-number-field"
                    />
                  </div>
                  <span className="metric-tile-footnote">Members Engaged</span>
                </div>

                {/* Metric 3: Waste Removed (Tons) */}
                <div className="eco-metric-input-card card-amber">
                  <div className="metric-tile-header">
                    <div className="metric-tile-icon-bubble amber">
                      <Recycle size={16} />
                    </div>
                    <span className="metric-tag-pill amber">Tons</span>
                  </div>
                  <div className="metric-tile-label">Waste Removed</div>
                  <div className="metric-input-wrapper">
                    <input
                      type="number"
                      min="0"
                      value={formData.statistics.wasteRemovedTons}
                      onChange={(e) => handleStatChange('wasteRemovedTons', e.target.value)}
                      className="eco-metric-number-field"
                    />
                  </div>
                  <span className="metric-tile-footnote">Metric Tons Lifted</span>
                </div>

                {/* Metric 4: River Ghats Cleaned */}
                <div className="eco-metric-input-card card-cyan">
                  <div className="metric-tile-header">
                    <div className="metric-tile-icon-bubble cyan">
                      <Waves size={16} />
                    </div>
                    <span className="metric-tag-pill cyan">Ghats</span>
                  </div>
                  <div className="metric-tile-label">Ghats Restored</div>
                  <div className="metric-input-wrapper">
                    <input
                      type="number"
                      min="0"
                      value={formData.statistics.ghatsCleaned}
                      onChange={(e) => handleStatChange('ghatsCleaned', e.target.value)}
                      className="eco-metric-number-field"
                    />
                  </div>
                  <span className="metric-tile-footnote">Riverfront Ghats</span>
                </div>

                {/* Metric 5: Trees Planted */}
                <div className="eco-metric-input-card card-emerald">
                  <div className="metric-tile-header">
                    <div className="metric-tile-icon-bubble emerald">
                      <TreePine size={16} />
                    </div>
                    <span className="metric-tag-pill emerald">Plantation</span>
                  </div>
                  <div className="metric-tile-label">Trees Planted</div>
                  <div className="metric-input-wrapper">
                    <input
                      type="number"
                      min="0"
                      value={formData.statistics.treesPlanted}
                      onChange={(e) => handleStatChange('treesPlanted', e.target.value)}
                      className="eco-metric-number-field"
                    />
                  </div>
                  <span className="metric-tile-footnote">Riparian Saplings</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Contact, Helplines & Physical Secretariat */}
          <div className="eco-cms-card">
            <div className="eco-cms-card-header">
              <div className="eco-cms-card-icon-tile amber">
                <Phone size={20} />
              </div>
              <div>
                <h2 className="eco-cms-card-title">Contact &amp; Helpline Information</h2>
                <p className="eco-cms-card-subtitle">
                  Public contact points for citizens, volunteers, media inquiries, and 24/7 river emergency support.
                </p>
              </div>
            </div>

            <div className="eco-cms-card-body">
              {/* Row 1: 3 Communication Channels */}
              <div className="eco-cms-grid-3">
                {/* Email Address */}
                <div className="eco-form-field-group">
                  <label className="eco-form-label">
                    <Mail size={14} className="text-emerald-700" />
                    <span>Official Email Address</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="eco-input-icon-wrap">
                    <Mail size={16} className="eco-input-left-icon" />
                    <input
                      type="email"
                      required
                      value={formData.contactInfo.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      placeholder="e.g. contact@godhavari.org"
                      className="eco-form-input with-icon"
                    />
                  </div>
                </div>

                {/* Office Phone */}
                <div className="eco-form-field-group">
                  <label className="eco-form-label">
                    <Phone size={14} className="text-emerald-700" />
                    <span>Office Landline / Phone</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="eco-input-icon-wrap">
                    <Phone size={16} className="eco-input-left-icon" />
                    <input
                      type="text"
                      required
                      value={formData.contactInfo.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      placeholder="e.g. +91 883 245 7890"
                      className="eco-form-input with-icon"
                    />
                  </div>
                </div>

                {/* Emergency River Helpline */}
                <div className="eco-form-field-group">
                  <label className="eco-form-label">
                    <AlertTriangle size={14} className="text-rose-600" />
                    <span className="text-rose-800">Emergency River Helpline</span>
                    <span className="emergency-badge">24/7</span>
                  </label>
                  <div className="eco-input-icon-wrap">
                    <Phone size={16} className="eco-input-left-icon text-rose-600" />
                    <input
                      type="text"
                      required
                      value={formData.contactInfo.helpline}
                      onChange={(e) => handleContactChange('helpline', e.target.value)}
                      placeholder="e.g. +91 944 012 3456"
                      className="eco-form-input with-icon emergency-input"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: 2 Column Physical Address & Office Hours */}
              <div className="eco-cms-grid-2 mt-4">
                {/* Physical Secretariat Address */}
                <div className="eco-form-field-group">
                  <label className="eco-form-label">
                    <MapPin size={14} className="text-emerald-700" />
                    <span>Head Office Physical Address</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="eco-input-icon-wrap">
                    <MapPin size={16} className="eco-input-left-icon" />
                    <input
                      type="text"
                      required
                      value={formData.contactInfo.address}
                      onChange={(e) => handleContactChange('address', e.target.value)}
                      placeholder="e.g. Godavari Bund Road, Opp. Kotilingala Temple Ghat, Rajahmundry, AP"
                      className="eco-form-input with-icon"
                    />
                  </div>
                </div>

                {/* Office Hours */}
                <div className="eco-form-field-group">
                  <label className="eco-form-label">
                    <Clock size={14} className="text-emerald-700" />
                    <span>Office Operating Hours</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="eco-input-icon-wrap">
                    <Clock size={16} className="eco-input-left-icon" />
                    <input
                      type="text"
                      required
                      value={formData.contactInfo.officeHours}
                      onChange={(e) => handleContactChange('officeHours', e.target.value)}
                      placeholder="e.g. Monday - Saturday: 8:30 AM - 6:30 PM"
                      className="eco-form-input with-icon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky / Floating Action Bar at the Bottom */}
          <div className="eco-cms-bottom-bar">
            <div className="eco-cms-bottom-meta">
              <ShieldCheck size={18} className="text-emerald-600" />
              <span>
                Changes are verified and directly persisted to the <strong>MongoDB Atlas</strong> database.
              </span>
            </div>

            <div className="eco-cms-bottom-actions">
              <button
                type="button"
                onClick={fetchWebsiteData}
                disabled={loading || saving}
                className="eco-cms-btn-secondary"
              >
                <RefreshCw size={14} />
                <span>Discard Changes</span>
              </button>
              <button
                type="submit"
                disabled={saving}
                className="eco-cms-btn-save-primary"
              >
                <Save size={16} />
                <span>{saving ? 'Saving to Database...' : 'Save & Publish CMS Content'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminWebsite;
