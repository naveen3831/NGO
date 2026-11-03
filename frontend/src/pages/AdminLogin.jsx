import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid administrator credentials');
    } finally {
      setSubmitting(false);
    }
  };

  const fillAdmin = () => {
    setEmail('admin@gmail.com');
    setPassword('admin123');
  };

  return (
    <div className="auth-fullscreen-page admin-login-bg">
      <div className="auth-central-card admin-card-border">
        <div className="auth-logo-header">
          <div className="auth-logo-circle bg-amber-light">
            <Shield size={28} className="text-amber" />
          </div>
          <h2>Administrator Portal</h2>
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
            <label>Admin Email Address *</label>
            <input
              type="email"
              required
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {submitting ? 'Verifying Privilege...' : 'Sign In as Administrator'}
          </button>
        </form>

        {/* Demo Fast-Fill Pill */}
        <div className="demo-credentials-box">
          <span className="demo-title">Default Admin Credentials:</span>
          <button type="button" onClick={fillAdmin} className="btn-demo-fill admin-fill">
            Quick Fill: admin@gmail.com / admin123
          </button>
        </div>

        <div className="auth-bottom-links">
          <Link to="/" className="back-home-link">
            <ArrowLeft size={14} /> Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
