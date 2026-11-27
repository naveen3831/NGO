import React, { useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { getInitials, hasCustomPortrait } from './OfficialIdCard';
import { compressPortraitImage, uploadImageToCloud } from '../utils/imageUtils';

/**
 * Shared profile avatar renderer displaying a custom portrait photo when set
 * and safely falling back to initials (or a provided fallback node) if absent or broken.
 */
const UserAvatar = ({
  src,
  name,
  fallback = 'M',
  className = '',
  style = {},
  fallbackContent = null,
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  const showImg = hasCustomPortrait(src) && !imgError;

  return (
    <div
      className={className}
      style={{
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {showImg ? (
        <img
          src={src}
          alt={name || 'Profile'}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        fallbackContent || getInitials(name, fallback)
      )}
    </div>
  );
};

/**
 * Reusable portrait uploader control for registration, admin member forms, and profile drawers.
 */
export const PortraitUploadField = ({
  value,
  name,
  fallback = 'M',
  label = 'ID Card Portrait Photo (Optional)',
  hint = '',
  onChange,
  onError,
  style = {},
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedCloud, setUploadedCloud] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.7rem 0.9rem',
        background: '#f8fafc',
        border: `1px dashed ${uploadError ? '#fca5a5' : '#cbd5e1'}`,
        borderRadius: '10px',
        ...style,
      }}
    >
      <UserAvatar
        src={value}
        name={name}
        fallback={fallback}
        fallbackContent={<Camera size={20} color="#64748b" />}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: '#e2e8f0',
          border: '2px solid #16a34a',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: hint ? '2px' : '0.28rem' }}>
          {label}
        </div>
        {hint && (
          <div style={{ fontSize: '0.73rem', color: '#64748b', marginBottom: '0.35rem' }}>
            {hint}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0',
              borderRadius: '7px',
              padding: '0.25rem 0.65rem',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: uploading ? 'wait' : 'pointer',
              opacity: uploading ? 0.7 : 1,
            }}
          >
            <Camera size={12} />
            <span>
              {uploading
                ? 'Uploading to Cloudinary...'
                : hasCustomPortrait(value)
                ? 'Change Photo'
                : 'Upload Photo'}
            </span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (!file) return;
                setUploading(true);
                setUploadError('');
                setUploadedCloud(false);
                try {
                  const compressed = await compressPortraitImage(file);
                  const hasToken = Boolean(localStorage.getItem('token'));
                  if (hasToken) {
                    const uploaded = await uploadImageToCloud(
                      compressed,
                      'avatars',
                      '/auth/upload-image'
                    );
                    onChange(uploaded.url);
                    setUploadedCloud(true);
                  } else {
                    onChange(compressed);
                  }
                } catch (err) {
                  const msg =
                    err.response?.data?.message || err.message || 'Failed to upload image.';
                  setUploadError(msg);
                  onError?.(msg);
                } finally {
                  setUploading(false);
                }
              }}
            />
          </label>
          {hasCustomPortrait(value) && !uploading && (
            <button
              type="button"
              onClick={() => {
                setUploadError('');
                setUploadedCloud(false);
                onChange('');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                background: '#fee2e2',
                color: '#991b1b',
                border: 'none',
                borderRadius: '7px',
                padding: '0.25rem 0.55rem',
                fontSize: '0.73rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <X size={12} /> Remove
            </button>
          )}
          {uploadedCloud && !uploadError && (
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>
              Saved to Cloudinary
            </span>
          )}
        </div>
        {uploadError && (
          <div style={{ marginTop: '0.35rem', fontSize: '0.73rem', fontWeight: 600, color: '#dc2626' }}>
            Upload failed: {uploadError}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAvatar;
