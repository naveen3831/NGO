import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Droplet, ShieldCheck, QrCode, Download, Printer, ArrowLeft } from 'lucide-react';

const MemberCard = () => {
  const { user, membership } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="member-screen member-card-screen">
      <div style={{ marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => navigate('/member/profile')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: '#ffffff',
            color: '#006B3C',
            border: '1px solid #bbf7d0',
            borderRadius: '9999px',
            padding: '0.45rem 1.05rem',
            fontSize: '0.86rem',
            fontWeight: 650,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 107, 60, 0.06)',
          }}
        >
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>
      </div>
      <div className="screen-header text-center">
        <h2>Digital Membership Identity Card</h2>
        <p className="text-muted text-sm">
          Official member identification card authorized by Godhavari Nadhi Paryavarana Parishubratha.
        </p>
      </div>

      {/* The Physical Card Replica */}
      <div className="membership-id-card-frame" ref={cardRef}>
        {/* Card Header */}
        <div className="card-top-strip">
          <div className="card-logo-group">
            <Droplet size={22} className="card-water-icon" />
            <div>
              <h3>Godhavari Nadhi</h3>
              <p>Paryavarana Parishubratha</p>
            </div>
          </div>
          <div className="card-reg-number">
            <span>REGD. NGO • AP</span>
          </div>
        </div>

        {/* Card Center Body */}
        <div className="card-inner-body">
          <div className="card-photo-box">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user?.name || 'Member'}
              className="card-photo"
            />
            <div className="verified-seal">
              <ShieldCheck size={14} /> VERIFIED
            </div>
          </div>

          <div className="card-details-grid">
            <div className="card-field full-width">
              <span className="field-label">FULL NAME</span>
              <span className="field-value font-bold">{user?.name}</span>
            </div>

            <div className="card-field">
              <span className="field-label">MEMBER ID</span>
              <span className="field-value font-mono font-bold text-primary">
                {user?.memberId || 'GNPP-2026-1002'}
              </span>
            </div>

            <div className="card-field">
              <span className="field-label">MEMBERSHIP CATEGORY</span>
              <span className="field-value font-semibold">
                {membership?.membershipType || 'Life Member'}
              </span>
            </div>

            <div className="card-field">
              <span className="field-label">DESIGNATION</span>
              <span className="field-value">{user?.designation || 'Volunteer Member'}</span>
            </div>

            <div className="card-field">
              <span className="field-label">BLOOD GROUP</span>
              <span className="field-value font-bold text-danger">
                {user?.bloodGroup || 'B+'}
              </span>
            </div>

            <div className="card-field">
              <span className="field-label">VALIDITY</span>
              <span className="field-value">
                {membership?.validTo
                  ? new Date(membership.validTo).getFullYear()
                  : '2027'} (ACTIVE)
              </span>
            </div>

            <div className="card-field">
              <span className="field-label">HEADQUARTERS</span>
              <span className="field-value">Rajahmundry, AP</span>
            </div>
          </div>
        </div>

        {/* Card Footer Bar */}
        <div className="card-bottom-bar">
          <div className="qr-box">
            <QrCode size={40} className="qr-code-icon" />
          </div>
          <div className="card-auth-signatures">
            <div className="sig-block">
              <span className="sig-line">Dr. K.V. Subba Rao</span>
              <span className="sig-title">President & Chief Coordinator</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card-actions-wrapper">
        <button onClick={handlePrint} className="btn btn-primary btn-block">
          <Printer size={16} /> Print / Save ID Card
        </button>
      </div>
    </div>
  );
};

export default MemberCard;

