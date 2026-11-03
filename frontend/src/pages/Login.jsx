import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, Smartphone, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { memberLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await memberLogin(identifier, password);
      navigate('/member');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please verify your Member ID and password.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillSampleMember = () => {
    setIdentifier('lakshmi@example.com');
    setPassword('password123');
  };

  return (
    <div className="auth-fullscreen-page">
      <div className="auth-central-card">
        <div className="auth-logo-header">
          <div className="auth-logo-circle">
            <Droplet size={28} className="text-primary" />
          </div>
          <h2>Member Mobile Portal</h2>
          <p className="auth-brand-sub">Godhavari Nadhi Paryavarana Parishubratha</p>
        </div>

        {error && (
          <div className="alert-banner alert-danger mb-3">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-body">
          <div className="form-group">
            <label>Member ID / Email / Phone Number *</label>
            <input
              type="text"
              required
              placeholder="e.g. GNPP-2026-1002 or your email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary btn-block">
            {submitting ? 'Authenticating...' : 'Sign In to Member App'}
          </button>
        </form>

        {/* Demo Fast-Fill Pill */}
        <div className="demo-credentials-box">
          <span className="demo-title">Test Member Login:</span>
          <button type="button" onClick={fillSampleMember} className="btn-demo-fill">
            Quick Fill: lakshmi@example.com (Life Member)
          </button>
        </div>

        <div className="auth-bottom-links">
          <p>
            New volunteer or devotee? <Link to="/register">Register here</Link>
          </p>
          <div className="admin-redirect-divider">
            <Link to="/admin/login" className="admin-portal-link">
              Looking for Admin Portal? Click here <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
