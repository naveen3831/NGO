import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Droplet,
  Shield,
  User,
  Lock,
  Mail,
  Smartphone,
  AlertCircle,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const Login = ({ initialRole }) => {
  const [searchParams] = useSearchParams();
  const queryRole = searchParams.get('role');

  // Active Role Tab: 'member' or 'admin'
  const [activeRole, setActiveRole] = useState(
    initialRole || queryRole === 'admin' ? 'admin' : 'member'
  );

  // Form Fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { memberLogin, adminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sync role if query parameter changes
  useEffect(() => {
    if (queryRole === 'admin') {
      setActiveRole('admin');
    } else if (queryRole === 'member') {
      setActiveRole('member');
    }
  }, [queryRole]);

  // Clear fields and error when switching roles
  const handleRoleChange = (role) => {
    setActiveRole(role);
    setError('');
    setIdentifier('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (activeRole === 'admin') {
        await adminLogin(identifier, password);
        navigate('/admin');
      } else {
        await memberLogin(identifier, password);
        navigate('/member');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (activeRole === 'admin'
            ? 'Invalid administrator credentials. Please check your email and password.'
            : 'Invalid credentials. Please verify your Member ID, email, or phone number.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Quick-fill credentials for easy testing
  const handleQuickFill = () => {
    if (activeRole === 'admin') {
      setIdentifier('admin@gmail.com');
      setPassword('admin123');
    } else {
      setIdentifier('lakshmi@example.com');
      setPassword('password123');
    }
  };

  return (
    <div className="auth-fullscreen-page">
      <div className="auth-central-card role-login-card">
        {/* Header Lockup */}
        <div className="auth-logo-header">
          <div
            className={`auth-logo-circle ${
              activeRole === 'admin' ? 'bg-amber-tint' : 'bg-blue-tint'
            }`}
          >
            {activeRole === 'admin' ? (
              <Shield size={28} className="text-amber" />
            ) : (
              <Droplet size={28} className="text-primary" />
            )}
          </div>
          <h2>Portal Authentication</h2>
          <p className="auth-brand-sub">Godhavari Nadhi Paryavarana Parishubratha</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="role-selector-tabs">
          <button
            type="button"
            className={`role-tab-btn ${activeRole === 'member' ? 'active member-tab' : ''}`}
            onClick={() => handleRoleChange('member')}
          >
            <User size={16} />
            <span>Member / Volunteer</span>
          </button>
          <button
            type="button"
            className={`role-tab-btn ${activeRole === 'admin' ? 'active admin-tab' : ''}`}
            onClick={() => handleRoleChange('admin')}
          >
            <Shield size={16} />
            <span>Administrator</span>
          </button>
        </div>

        {/* Role Brief Description */}
        <div className="role-badge-explainer">
          {activeRole === 'admin' ? (
            <p>
              🛡️ <strong>Administrator Portal:</strong> Full control over member registrations,
              cleanliness drives, announcements, and member notifications.
            </p>
          ) : (
            <p>
              👤 <strong>Member Mobile Portal:</strong> Access your digital membership identity card,
              participate in cleanup drives, and view circulars.
            </p>
          )}
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="alert-banner alert-danger mb-3">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form-body">
          <div className="form-group">
            <label>
              {activeRole === 'admin'
                ? 'Administrator Email Address *'
                : 'Member ID / Email / Phone Number *'}
            </label>
            <div className="input-with-icon">
              {activeRole === 'admin' ? (
                <Mail size={16} className="input-field-icon" />
              ) : (
                <Smartphone size={16} className="input-field-icon" />
              )}
              <input
                type={activeRole === 'admin' ? 'email' : 'text'}
                required
                placeholder={
                  activeRole === 'admin'
                    ? 'admin@gmail.com'
                    : 'e.g. GNPP-2026-1002 or your email'
                }
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password *</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-field-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`btn btn-block ${
              activeRole === 'admin' ? 'btn-primary admin-submit-btn' : 'btn-primary'
            }`}
          >
            {submitting
              ? 'Verifying Credentials...'
              : activeRole === 'admin'
              ? 'Sign In as Administrator'
              : 'Sign In as Member / Volunteer'}
          </button>
        </form>

        {/* Quick Demo Credentials Pill */}
        <div className="demo-credentials-box">
          <span className="demo-title">
            Test {activeRole === 'admin' ? 'Admin' : 'Member'} Credentials:
          </span>
          <button
            type="button"
            onClick={handleQuickFill}
            className={`btn-demo-fill ${activeRole === 'admin' ? 'admin-fill' : ''}`}
          >
            {activeRole === 'admin'
              ? 'Quick Fill: admin@gmail.com / admin123'
              : 'Quick Fill: lakshmi@example.com (Life Member)'}
          </button>
        </div>

        {/* Bottom Context Links */}
        <div className="auth-bottom-links">
          {activeRole === 'member' ? (
            <p>
              New volunteer or citizen? <Link to="/register">Register for membership</Link>
            </p>
          ) : (
            <p className="text-muted text-xs">
              Restricted area for authorized NGO coordinating officials only.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
