import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../../components/UserAvatar';
import { hasCustomPortrait } from '../../components/OfficialIdCard';
import { compressPortraitImage } from '../../utils/imageUtils';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  CreditCard,
  ShieldCheck,
  Briefcase,
  Calendar,
  Eye,
  Camera,
  Trash2,
} from 'lucide-react';

const MemberProfile = () => {
  const { user, membership, updateAvatar } = useAuth();
  const [photoStatus, setPhotoStatus] = useState({ type: '', message: '' });
  const [savingPhoto, setSavingPhoto] = useState(false);

  const isVolunteer = user?.role?.toLowerCase() === 'volunteer';
  const roleLabel = isVolunteer ? 'Volunteer' : 'Member';

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setSavingPhoto(true);
    setPhotoStatus({ type: '', message: '' });
    try {
      const compressed = await compressPortraitImage(file);
      await updateAvatar(compressed);
      setPhotoStatus({
        type: 'success',
        message: 'Profile image updated! It now appears on your profile, navigation bar, and Digital ID Card.',
      });
    } catch (err) {
      setPhotoStatus({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to update profile image.',
      });
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    setSavingPhoto(true);
    setPhotoStatus({ type: '', message: '' });
    try {
      await updateAvatar('');
      setPhotoStatus({ type: 'success', message: 'Profile image removed.' });
    } catch (err) {
      setPhotoStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to remove profile image.',
      });
    } finally {
      setSavingPhoto(false);
    }
  };

  const infoTiles = [
    { icon: ShieldCheck, label: `${roleLabel} ID`, value: user?.memberId || '—' },
    { icon: CreditCard, label: 'Account Status', value: membership?.status || 'Active' },
    { icon: User, label: 'Category', value: membership?.membershipType || roleLabel },
    { icon: Mail, label: 'Email Address', value: user?.email || '—' },
    { icon: Phone, label: 'Phone Number', value: user?.phone || '—' },
    { icon: Heart, label: 'Blood Group', value: user?.bloodGroup || '—' },
    { icon: Briefcase, label: 'Occupation / Wing', value: user?.occupation || '—' },
    {
      icon: MapPin,
      label: 'Address',
      value: user?.address?.street
        ? `${user.address.street}, ${user.address.city || 'Rajahmundry'}`
        : user?.address?.city || 'Rajahmundry',
    },
    {
      icon: Calendar,
      label: 'Valid Until',
      value: membership?.validTo
        ? new Date(membership.validTo).toLocaleDateString('en-IN')
        : 'Active',
    },
  ];

  return (
    <div className="ref-members-page">
      <div className="ref-header-section">
        <div className="ref-header-left">
          <div className="ref-header-icon-box">
            <User size={24} className="text-emerald-700" />
          </div>
          <div>
            <h1 className="ref-page-title">My {roleLabel} Profile</h1>
            <p className="ref-page-subtitle">
              Read-only overview of your registered identity, contact, and membership details.
            </p>
          </div>
        </div>

        <Link to="/member/card" className="ref-btn-enroll" style={{ textDecoration: 'none' }}>
          <CreditCard size={15} />
          <span>View Digital ID Card</span>
        </Link>
      </div>

      {photoStatus.message && (
        <div
          className={`ref-alert-banner ${photoStatus.type === 'error' ? 'ref-alert-error' : ''}`}
          style={{ marginBottom: '1rem' }}
        >
          <div className="ref-alert-left">
            <span>{photoStatus.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setPhotoStatus({ type: '', message: '' })}
            className="ref-alert-dismiss"
          >
            Dismiss &times;
          </button>
        </div>
      )}

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
            gap: '1rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid #f1f5f9',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <UserAvatar
              src={user?.avatar}
              name={user?.name}
              fallback={roleLabel}
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '18px',
                background: '#064e3b',
                color: '#ffffff',
                fontSize: '1.65rem',
                fontWeight: 800,
                flexShrink: 0,
                border: '2px solid #a7f3d0',
                boxShadow: '0 6px 16px rgba(6, 78, 59, 0.16)',
              }}
            />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                {user?.name || roleLabel}
              </h2>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem', color: '#059669', fontWeight: 600 }}>
                {user?.designation || roleLabel} • Godhavari Nadhi Paryavarana Parishubratha
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.55rem', flexWrap: 'wrap' }}>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#ecfdf5',
                    color: '#065f46',
                    border: '1px solid #a7f3d0',
                    borderRadius: '8px',
                    padding: '0.32rem 0.72rem',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: savingPhoto ? 'wait' : 'pointer',
                  }}
                >
                  <Camera size={13} />
                  <span>
                    {savingPhoto
                      ? 'Uploading…'
                      : hasCustomPortrait(user?.avatar)
                      ? 'Change Profile Photo'
                      : 'Upload Profile Photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={savingPhoto}
                    onChange={handlePhotoSelect}
                    style={{ display: 'none' }}
                  />
                </label>

                {hasCustomPortrait(user?.avatar) && (
                  <button
                    type="button"
                    disabled={savingPhoto}
                    onClick={handleRemovePhoto}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: '#fee2e2',
                      color: '#991b1b',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.32rem 0.65rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={12} />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#f8fafc',
                color: '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: '9999px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              <Eye size={13} />
              <span>Read-Only Profile</span>
            </span>
            <Link
              to="/member/card"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#008C4A',
                color: '#ffffff',
                borderRadius: '10px',
                padding: '0.5rem 1rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <CreditCard size={14} />
              <span>View Digital ID Card</span>
            </Link>
          </div>
        </div>

        <div className="ref-details-grid" style={{ marginBottom: '1rem' }}>
          {infoTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <div key={tile.label} className="ref-detail-item">
                <span className="ref-detail-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Icon size={12} />
                  {tile.label}
                </span>
                <span className="ref-detail-value">{tile.value}</span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            fontSize: '0.82rem',
            color: '#475569',
          }}
        >
          This portal is in <strong>read-only mode</strong>. Only your portrait photo for your ID card and navbar badge can be updated directly; to request changes to your membership details, please contact the NGO secretariat.
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
