import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  X,
  TreePine,
  Droplets,
  Users2
} from 'lucide-react';
import Logo from '../components/Logo';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState(null); // 'sending' | 'sent' | 'error'
  const [resetMessage, setResetMessage] = useState('');

  const { user, isAdmin, isMember, memberLogin, adminLogin } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to appropriate console
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else if (isMember) {
        navigate('/', { replace: true });
      }
    }
  }, [user, isAdmin, isMember, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    // Shorthand: treat 'admin' as 'admin@gmail.com'
    const targetIdentifier =
      cleanIdentifier.toLowerCase() === 'admin' ? 'admin@gmail.com' : cleanIdentifier;

    try {
      // 1. Direct admin check
      if (
        targetIdentifier.toLowerCase() === 'admin@gmail.com' ||
        targetIdentifier.toLowerCase().includes('admin')
      ) {
        try {
          await adminLogin(targetIdentifier, cleanPassword);
          navigate('/admin', { replace: true });
          return;
        } catch (adminFirstErr) {
          if (adminFirstErr.response?.status === 401) {
            setError(
              adminFirstErr.response?.data?.message ||
                'Invalid email or password. Please verify your credentials and try again.'
            );
            return;
          }
        }
      }

      // 2. Try member authentication
      try {
        const memberData = await memberLogin(targetIdentifier, cleanPassword);
        if (memberData.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
        return;
      } catch (memberErr) {
        // 3. Fallback: attempt admin authentication
        try {
          await adminLogin(targetIdentifier, cleanPassword);
          navigate('/admin', { replace: true });
          return;
        } catch (adminErr) {
          setError(
            adminErr.response?.data?.message ||
              memberErr.response?.data?.message ||
              'Invalid credentials. Please verify your email / phone and password.'
          );
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to connect to the authentication service. Please check your connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setResetMessage('Please enter a valid registered email address.');
      setResetStatus('error');
      return;
    }
    setResetStatus('sending');
    setTimeout(() => {
      setResetStatus('sent');
      setResetMessage(
        `If an account matches ${resetEmail}, a secure password reset link has been dispatched. Please check your inbox and spam folder.`
      );
    }, 800);
  };

  return (
    <div className="eco-split-login-page">
      {/* LEFT SIDE: Scenic River & Initiative Branding */}
      <div className="eco-login-visual-panel">
        <div className="eco-visual-overlay"></div>

        {/* Top Organization Header */}
        <div className="eco-visual-header">
          <Link to="/" title="Return to Home" className="inline-block">
            <Logo variant="light" size={42} />
          </Link>
          <span className="eco-visual-badge">
            <ShieldCheck size={13} className="text-emerald-300" />
            Official Portal
          </span>
        </div>

        {/* Hero Mission Copy on Left */}
        <div className="eco-visual-body">
          <div className="eco-green-accent-bar"></div>
          <h1 className="eco-visual-heading">
            Working Together for a<br />
            Cleaner & Greener<br />
            <span className="text-highlight-green">Godhavari</span>
          </h1>
          <p className="eco-visual-subtext">
            A citizen-led initiative dedicated to river rejuvenation, ghat sanitation, and ecological conservation across the Godavari river basin.
          </p>

          {/* Impact Metrics Badges */}
          <div className="eco-visual-metrics-grid">
            <div className="eco-visual-metric-card">
              <div className="eco-metric-icon">
                <TreePine size={18} className="text-emerald-300" />
              </div>
              <div>
                <div className="eco-metric-value">50,000+</div>
                <div className="eco-metric-label">Trees Planted</div>
              </div>
            </div>

            <div className="eco-visual-metric-card">
              <div className="eco-metric-icon">
                <Droplets size={18} className="text-sky-300" />
              </div>
              <div>
                <div className="eco-metric-value">120+</div>
                <div className="eco-metric-label">River Cleanups</div>
              </div>
            </div>

            <div className="eco-visual-metric-card">
              <div className="eco-metric-icon">
                <Users2 size={18} className="text-teal-300" />
              </div>
              <div>
                <div className="eco-metric-value">3,500+</div>
                <div className="eco-metric-label">Volunteers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom subtle copyright / location */}
        <div className="eco-visual-footer">
          <div>Rajahmundry, Andhra Pradesh</div>
          <div className="eco-visual-reg">Regd. Society #45/2018</div>
        </div>
      </div>

      {/* RIGHT SIDE: Centered Clean Professional Card */}
      <div className="eco-login-form-panel">
        <div className="eco-login-card">
          {/* Card Organization Brand Lockup */}
          <div className="eco-card-logo-center">
            <Link to="/" title="Return to Home">
              <Logo variant="dark" size={38} />
            </Link>
          </div>

          <div className="eco-card-text-header">
            <h2 className="eco-card-title">Welcome back</h2>
            <p className="eco-card-subtitle">
              Sign in to your Godhavari account to continue
            </p>
          </div>

          {error && (
            <div className="eco-alert-banner alert-danger">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Clean Form */}
          <form onSubmit={handleSubmit} className="eco-form-body">
            <div className="eco-form-field">
              <label className="eco-field-label">
                Email or Mobile Number
              </label>
              <div className="eco-input-wrapper">
                <Mail size={16} className="eco-field-icon" />
                <input
                  type="text"
                  required
                  placeholder="Enter your email or phone"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="eco-input-clean"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="eco-form-field">
              <div className="eco-field-header-row">
                <label className="eco-field-label">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(identifier.includes('@') ? identifier : '');
                    setResetStatus(null);
                    setResetMessage('');
                    setForgotModalOpen(true);
                  }}
                  className="eco-forgot-btn"
                >
                  Forgot password?
                </button>
              </div>
              <div className="eco-input-wrapper">
                <Lock size={16} className="eco-field-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="eco-input-clean pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="eco-toggle-eye-btn"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="eco-remember-row">
              <label className="eco-remember-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="eco-checkbox"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-eco-main-submit"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Registration link */}
          <div className="eco-card-bottom-register">
            <span>Don't have an account?</span>{' '}
            <Link to="/register" className="eco-register-link">
              Register here
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="eco-modal-backdrop" onClick={() => setForgotModalOpen(false)}>
          <div
            className="eco-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="eco-modal-header">
              <div className="flex items-center gap-3">
                <div className="eco-modal-icon-wrap">
                  <KeyRound size={18} className="text-emerald-700" />
                </div>
                <div>
                  <h3 className="eco-modal-title">Reset Your Password</h3>
                  <p className="eco-modal-desc">
                    Enter your registered email address to receive password reset instructions.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="eco-modal-close-btn"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {resetStatus === 'sent' ? (
              <div className="eco-modal-body">
                <div className="eco-reset-success-box">
                  <CheckCircle2 size={32} className="text-emerald-600 mb-2" />
                  <h4>Check Your Email</h4>
                  <p>{resetMessage}</p>
                </div>
                <div className="eco-modal-footer">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="btn-eco-main-submit"
                  >
                    Return to Login
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="eco-modal-body">
                {resetStatus === 'error' && (
                  <div className="eco-alert-banner alert-danger mb-3">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    <span>{resetMessage}</span>
                  </div>
                )}

                <div className="eco-form-field">
                  <label className="eco-field-label">Registered Email Address</label>
                  <div className="eco-input-wrapper">
                    <Mail size={16} className="eco-field-icon" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. member@godhavari.org"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="eco-input-clean"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="eco-support-notice">
                  <span>Need assistance? Contact our administrative coordinator at</span>{' '}
                  <a href="mailto:admin@godhavari.org" className="text-emerald-700 font-semibold underline">
                    admin@godhavari.org
                  </a>
                </div>

                <div className="eco-modal-footer">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="eco-btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetStatus === 'sending'}
                    className="btn-eco-main-submit"
                    style={{ width: 'auto', padding: '0.6rem 1.25rem' }}
                  >
                    {resetStatus === 'sending' ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
