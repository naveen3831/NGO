import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Globe,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Building,
  Target,
  Eye,
  BarChart3,
  Phone,
  Mail,
  MapPin,
  Clock,
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
            cleanlinessDrives: res.data.statistics?.cleanlinessDrives || 142,
            volunteersActive: res.data.statistics?.volunteersActive || 1250,
            wasteRemovedTons: res.data.statistics?.wasteRemovedTons || 85,
            ghatsCleaned: res.data.statistics?.ghatsCleaned || 18,
            treesPlanted: res.data.statistics?.treesPlanted || 3500,
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
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      await api.patch('/admin/website', formData);
      setFeedback({
        type: 'success',
        message: 'Website CMS details successfully saved and updated in MongoDB database!',
      });
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
    setFormData((prev) => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        [key]: Number(val),
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
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Website Management (CMS)</h1>
          <p className="admin-page-subtitle">
            Configure organization mission, vision statements, contact points, and public impact metrics stored in MongoDB.
          </p>
        </div>
        <button
          onClick={fetchWebsiteData}
          className="btn btn-outline btn-sm flex items-center gap-1"
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Reload Live Content</span>
        </button>
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

      {loading ? (
        <div className="admin-card p-8 text-center text-muted">
          <RefreshCw size={24} className="animate-spin inline mb-2" />
          <p>Loading website configuration from database...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Section 1: Organization Branding & Identity */}
          <div className="admin-card mb-4">
            <div className="card-header-styled">
              <Building size={18} className="text-primary" />
              <h2 className="card-header-title">Organization Identity</h2>
            </div>
            <div className="admin-card-body">
              <div className="form-group mb-3">
                <label>Organization Official Name *</label>
                <input
                  type="text"
                  required
                  value={formData.orgName}
                  onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group mb-3">
                <label>Header / Hero Tagline *</label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="grid-2 gap-3">
                <div className="form-group">
                  <label className="flex items-center gap-1">
                    <Target size={15} className="text-primary" /> Mission Statement *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="flex items-center gap-1">
                    <Eye size={15} className="text-primary" /> Vision Statement *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.vision}
                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Public Impact Statistics */}
          <div className="admin-card mb-4">
            <div className="card-header-styled">
              <BarChart3 size={18} className="text-teal-600" />
              <h2 className="card-header-title">Public Impact Metrics</h2>
            </div>
            <div className="admin-card-body">
              <p className="text-sm text-muted mb-3">
                These numbers highlight the collective achievements of the NGO on the home and awareness pages.
              </p>
              <div className="grid-3 gap-3">
                <div className="form-group">
                  <label>Cleanliness Drives Completed</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.statistics.cleanlinessDrives}
                    onChange={(e) => handleStatChange('cleanlinessDrives', e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Active Volunteers Engaged</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.statistics.volunteersActive}
                    onChange={(e) => handleStatChange('volunteersActive', e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Waste Removed (Tons)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.statistics.wasteRemovedTons}
                    onChange={(e) => handleStatChange('wasteRemovedTons', e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>River Ghats Cleaned & Restored</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.statistics.ghatsCleaned}
                    onChange={(e) => handleStatChange('ghatsCleaned', e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Riverbank Trees Planted</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.statistics.treesPlanted}
                    onChange={(e) => handleStatChange('treesPlanted', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Official Contact & Helpline Details */}
          <div className="admin-card mb-4">
            <div className="card-header-styled">
              <Phone size={18} className="text-amber-600" />
              <h2 className="card-header-title">Contact & Helpline Information</h2>
            </div>
            <div className="admin-card-body">
              <div className="grid-3 gap-3 mb-3">
                <div className="form-group">
                  <label className="flex items-center gap-1">
                    <Mail size={14} /> Official Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactInfo.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="flex items-center gap-1">
                    <Phone size={14} /> Office Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="flex items-center gap-1">
                    <Phone size={14} className="text-red-500" /> Emergency River Helpline
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactInfo.helpline}
                    onChange={(e) => handleContactChange('helpline', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="grid-2 gap-3">
                <div className="form-group">
                  <label className="flex items-center gap-1">
                    <MapPin size={14} /> Head Office Physical Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactInfo.address}
                    onChange={(e) => handleContactChange('address', e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="flex items-center gap-1">
                    <Clock size={14} /> Office Hours
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactInfo.officeHours}
                    onChange={(e) => handleContactChange('officeHours', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Save Button */}
          <div className="flex justify-end gap-3 pb-8">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary flex items-center gap-2 px-6"
            >
              <Save size={16} />
              <span>{saving ? 'Saving to Database...' : 'Save & Publish CMS Content'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminWebsite;

