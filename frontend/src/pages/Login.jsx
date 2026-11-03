import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Shield,
} from 'lucide-react';
import Logo from '../components/Logo';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const { memberLogin, adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    try {
      // Intelligent Role Authentication:
      // If administrator email is used, authenticate via adminLogin
      if (cleanIdentifier.toLowerCase() === 'admin@gmail.com') {
        await adminLogin(cleanIdentifier, cleanPassword);
        navigate('/admin', { replace: true });
        return;
      }

      // Try member authentication first
      try {
        await memberLogin(cleanIdentifier, cleanPassword);
        navigate('/member', { replace: true });
        return;
      } catch (memberErr) {
        // If member login failed, attempt admin authentication as fallback
        try {
          await adminLogin(cleanIdentifier, cleanPassword);
          navigate('/admin', { replace: true });
          return;
        } catch (adminErr) {
          throw memberErr; // propagate member error
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Invalid credentials. Please verify your Mobile Number / Email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpRequest = (e) => {
    e.preventDefault();
    if (!identifier) {
      setError('Please enter your registered mobile number or email.');
      return;
    }
    setError('');
    setOtpSent(true);
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (otpCode === '1234' || otpCode.length >= 4) {
      // Mock OTP validation - log in as default member
      try {
        setLoading(true);
        await memberLogin('lakshmi@example.com', 'password123');
        navigate('/member', { replace: true });
      } catch (err) {
        setError('Failed to verify OTP session.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Invalid OTP code. For demo, use 1234.');
    }
  };

  const quickFillAdmin = () => {
    setIdentifier('admin@gmail.com');
    setPassword('admin123');
    setError('');
    setOtpMode(false);
  };

  const quickFillMember = () => {
    setIdentifier('lakshmi@example.com');
    setPassword('password123');
    setError('');
    setOtpMode(false);
  };

  return (
    <div className="eco-split-login-page">
      {/* LEFT SIDE: Scenic River & Initiative Branding */}
      <div className="eco-login-visual-panel">
        <div className="eco-visual-overlay"></div>

        {/* Top Organization Header */}
        <div className="eco-visual-header">
          <Link to="/" title="Return to Home">
            <Logo variant="light" size={44} />
          </Link>
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
            A People's Initiative for a Clean, Green and Healthy Godhavari
          </p>
        </div>

        {/* Bottom subtle copyright / location */}
        <div className="eco-visual-footer">
          <span>Rajahmundry, Andhra Pradesh • Ecological Conservation</span>
        </div>
      </div>

      {/* RIGHT SIDE: Centered Clean White Authentication Card */}
      <div className="eco-login-form-panel">
        {/* Subtle Decorative Wave at bottom right */}
        <div className="eco-bottom-wave-bg"></div>

        <div className="eco-login-card">
          {/* Card Organization Brand Lockup */}
          <div className="eco-card-logo-center">
            <Link to="/">
              <Logo variant="dark" size={38} />
            </Link>
          </div>

          <div className="eco-card-text-header">
            <h2 className="eco-card-title">Login to Your Account</h2>
            <p className="eco-card-subtitle">
              {otpMode
                ? 'Enter your mobile number to receive a one-time passcode'
                : 'Access your membership, events and updates'}
            </p>
          </div>

          {error && (
            <div className="eco-alert-banner alert-danger">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!otpMode ? (
            /* Standard Password Form */
            <form onSubmit={handleSubmit} className="eco-form-body">
              <div className="eco-form-field">
                <div className="eco-input-wrapper">
                  <User size={18} className="eco-field-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Mobile Number or Email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="eco-input-clean"
                  />
                </div>
              </div>

              <div className="eco-form-field">
                <div className="eco-input-wrapper">
                  <Lock size={18} className="eco-field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="eco-input-clean pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="eco-toggle-eye-btn"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="eco-forgot-wrap">
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        'For administrator access, use: admin@gmail.com / admin123.\nFor member access, use: lakshmi@example.com / password123.'
                      )
                    }
                    className="eco-forgot-btn"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-eco-main-submit"
              >
                {loading ? 'Logging In...' : 'Log In'}
              </button>
            </form>
          ) : (
            /* OTP Form Mode */
            <form
              onSubmit={otpSent ? handleOtpVerify : handleOtpRequest}
              className="eco-form-body"
            >
              <div className="eco-form-field">
                <div className="eco-input-wrapper">
                  <Smartphone size={18} className="eco-field-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Registered Mobile Number"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="eco-input-clean"
                    disabled={otpSent}
                  />
                </div>
              </div>

              {otpSent && (
                <div className="eco-form-field">
                  <div className="eco-input-wrapper">
                    <Lock size={18} className="eco-field-icon" />
                    <input
                      type="text"
                      required
                      placeholder="Enter 4-Digit OTP (Demo: 1234)"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="eco-input-clean"
                      maxLength={6}
                    />
                  </div>
                  <small className="text-xs text-muted mt-1 block">
                    Demo OTP code is <strong>1234</strong>
                  </small>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-eco-main-submit"
              >
                {loading
                  ? 'Verifying...'
                  : otpSent
                  ? 'Verify OTP & Continue'
                  : 'Send One-Time Password'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="eco-or-divider">
            <span className="eco-or-line"></span>
            <span className="eco-or-text">or</span>
            <span className="eco-or-line"></span>
          </div>

          {/* Toggle between Password and OTP */}
          <button
            type="button"
            onClick={() => {
              setOtpMode(!otpMode);
              setError('');
            }}
            className="btn-eco-otp-toggle"
          >
            <Smartphone size={16} />
            <span>{otpMode ? 'Log In with Password Instead' : 'Login with OTP'}</span>
          </button>

          {/* Quick-fill helper for convenience */}
          <div className="eco-demo-quick-bar">
            <span className="eco-demo-label">Quick Fill:</span>
            <div className="flex gap-2 justify-center flex-wrap">
              <button
                type="button"
                onClick={quickFillMember}
                className="btn-eco-quick-pill"
              >
                Member: lakshmi@example.com
              </button>
              <button
                type="button"
                onClick={quickFillAdmin}
                className="btn-eco-quick-pill admin-badge"
              >
                Admin: admin@gmail.com
              </button>
            </div>
          </div>

          <div className="eco-card-bottom-register">
            <span>New member or volunteer?</span>{' '}
            <Link to="/register" className="eco-register-link">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
