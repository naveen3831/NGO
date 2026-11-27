import React, { useEffect, useState } from 'react';
import { Ban, Mail, Phone, ShieldAlert, LogOut, ArrowLeft } from 'lucide-react';
import API from '../services/api';

const AccountSuspendedScreen = ({
  reason = '',
  mode = 'session', // 'session' | 'login'
  onLogout,
  onBackToLogin,
}) => {
  const [adminContact, setAdminContact] = useState({
    email: 'admin@godhavari.org',
    phone: '',
    orgName: 'Godhavari Nadhi Paryavarana Parishubratha',
  });

  useEffect(() => {
    API.get('/public/content')
      .then((res) => {
        if (res.data) {
          setAdminContact((prev) => ({
            email: res.data.contactEmail?.trim() || prev.email,
            phone: res.data.contactPhone?.trim() || prev.phone,
            orgName: res.data.orgName?.trim() || prev.orgName,
          }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        role="alert"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#ffffff',
          border: '1px solid #fecaca',
          borderRadius: '20px',
          padding: '2.25rem 2rem',
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#fef2f2',
            border: '2px solid #fecaca',
            color: '#dc2626',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <Ban size={34} strokeWidth={2.2} />
        </div>

        <h1
          style={{
            margin: '0 0 0.65rem',
            fontSize: '1.6rem',
            fontWeight: 800,
            color: '#991b1b',
            letterSpacing: '-0.02em',
          }}
        >
          Account Suspended
        </h1>

        <p
          style={{
            margin: '0 auto 1.35rem',
            fontSize: '0.96rem',
            lineHeight: 1.6,
            color: '#475569',
            maxWidth: '390px',
          }}
        >
          Your account has been suspended by the administrator. Access to the portal is disabled. Please contact the admin for assistance.
        </p>

        {reason && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              marginBottom: '1.35rem',
              fontSize: '0.84rem',
              color: '#991b1b',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              textAlign: 'left',
            }}
          >
            <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Reason:</strong> {reason}
            </span>
          </div>
        )}

        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1rem 1.15rem',
            marginBottom: '1.6rem',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#64748b',
              marginBottom: '0.5rem',
            }}
          >
            Contact Administrator • {adminContact.orgName}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <a
              href={`mailto:${adminContact.email}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#065f46',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              <Mail size={15} />
              <span>{adminContact.email}</span>
            </a>
            {adminContact.phone && (
              <a
                href={`tel:${adminContact.phone}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#334155',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                }}
              >
                <Phone size={15} />
                <span>{adminContact.phone}</span>
              </a>
            )}
          </div>
        </div>

        {mode === 'login' ? (
          <button
            type="button"
            onClick={onBackToLogin}
            style={{
              width: '100%',
              padding: '0.78rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#0f172a',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Sign In</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '0.78rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              background: '#dc2626',
              color: '#ffffff',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountSuspendedScreen;
