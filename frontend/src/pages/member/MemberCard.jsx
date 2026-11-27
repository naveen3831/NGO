import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import OfficialIdCard, {
  DEFAULT_ORG_NAME,
  downloadOfficialIdCard,
  hasCustomPortrait,
} from '../../components/OfficialIdCard';
import { compressPortraitImage } from '../../utils/imageUtils';
import {
  CreditCard,
  ShieldCheck,
  Download,
  Printer,
  Eye,
  Camera,
} from 'lucide-react';

const MemberCard = () => {
  const { user, membership, refreshProfile, updateAvatar } = useAuth();
  const [branding, setBranding] = useState({
    orgName: DEFAULT_ORG_NAME,
    logoUrl: '',
  });
  const [downloading, setDownloading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoFeedback, setPhotoFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    refreshProfile?.();

    const loadBranding = () => {
      API.get('/public/content')
        .then((res) => {
          if (res.data) {
            setBranding({
              orgName: res.data.orgName?.trim() || DEFAULT_ORG_NAME,
              logoUrl: res.data.logoUrl?.trim() || '',
            });
          }
        })
        .catch(() => {});
    };

    loadBranding();
    window.addEventListener('ngo-logo-updated', loadBranding);
    return () => window.removeEventListener('ngo-logo-updated', loadBranding);
  }, []);

  const isVolunteer = user?.role?.toLowerCase() === 'volunteer';
  const roleLabel = isVolunteer ? 'Volunteer' : 'Member';

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadOfficialIdCard({ user, membership, branding });
    } finally {
      setDownloading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadingPhoto(true);
    setPhotoFeedback({ type: '', message: '' });
    try {
      const compressed = await compressPortraitImage(file);
      await updateAvatar(compressed);
      setPhotoFeedback({
        type: 'success',
        message: 'Profile photo updated on your Digital ID Card.',
      });
    } catch (err) {
      setPhotoFeedback({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Could not update photo.',
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="ref-members-page">
      {/* Page Header */}
      <div className="ref-header-section">
        <div className="ref-header-left">
          <div className="ref-header-icon-box">
            <CreditCard size={24} className="text-emerald-700" />
          </div>
          <div>
            <h1 className="ref-page-title">Digital {roleLabel} ID Card</h1>
            <p className="ref-page-subtitle">
              Official identification pass authorized by {branding.orgName}.
            </p>
          </div>
        </div>
        <div className="ref-header-actions">
          <label
            className="ref-btn-refresh"
            style={{ cursor: uploadingPhoto ? 'wait' : 'pointer' }}
          >
            <Camera size={15} />
            <span>
              {uploadingPhoto
                ? 'Updating Photo…'
                : hasCustomPortrait(user?.avatar)
                ? 'Change Photo'
                : 'Add Photo'}
            </span>
            <input
              type="file"
              accept="image/*"
              disabled={uploadingPhoto}
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
          </label>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="ref-btn-enroll"
            style={{ cursor: 'pointer' }}
          >
            <Download size={15} />
            <span>{downloading ? 'Preparing…' : 'Download ID Card'}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="ref-btn-refresh"
            style={{ cursor: 'pointer' }}
          >
            <Printer size={15} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {photoFeedback.message && (
        <div
          className={`ref-alert-banner ${photoFeedback.type === 'error' ? 'ref-alert-error' : ''}`}
          style={{ marginBottom: '1rem' }}
        >
          <div className="ref-alert-left">
            <span>{photoFeedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setPhotoFeedback({ type: '', message: '' })}
            className="ref-alert-dismiss"
          >
            Dismiss &times;
          </button>
        </div>
      )}

      {/* Card Preview Container */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1.35rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShieldCheck size={20} className="text-emerald-700" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              Official {roleLabel} Identification Card
            </h3>
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#f8fafc',
              color: '#475569',
              border: '1px solid #cbd5e1',
              borderRadius: '9999px',
              padding: '0.28rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <Eye size={12} /> Read-Only Pass
          </span>
        </div>

        <div className="official-id-card-print-area">
          <OfficialIdCard user={user} membership={membership} branding={branding} />
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
