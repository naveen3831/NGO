import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroBanner from '../components/HeroBanner';
import heroPlantImg from '../assets/hero-plant.jpg';
import { PortraitUploadField } from '../components/UserAvatar';
import { AlertCircle, ArrowRight, ArrowLeft, CheckCircle2, HeartHandshake, Award } from 'lucide-react';

const FORM_CONFIG = {
  volunteer: {
    bannerTitle: 'Volunteer Registration',
    bannerSubtitle: 'Join Our River Cleanup & Plantation Drives — Free Forever',
    showcaseTitle: 'Become a River Conservation Volunteer',
    showcaseDesc:
      'Join 3,500+ active volunteers in weekend ghat cleanups, tree plantations, and school eco-awareness campaigns along the Godavari.',
    formTitle: 'Register Free as Volunteer',
    submitLabel: 'Register Free as Volunteer',
    submittingLabel: 'Registering Volunteer...',
    idLabel: 'UNIQUE VOLUNTEER ID',
    statusLabel: 'VOLUNTEER STATUS',
    successMessage:
      'Your volunteer registration has been saved and is currently Pending coordinator review. You will receive a notification once it is approved.',
  },
  member: {
    bannerTitle: 'Join as a Member',
    bannerSubtitle: 'Become an Official Member of Godhavari Nadhi Paryavarana Parishubratha',
    showcaseTitle: 'Together we can make a difference',
    showcaseDesc:
      'Become an official member of Godhavari Nadhi Paryavarana Parishubratha and receive your digital Member ID for ghat cleanups, meetings, and plantation drives.',
    formTitle: 'Membership Application',
    submitLabel: 'Submit Membership Application',
    submittingLabel: 'Submitting Application...',
    idLabel: 'UNIQUE MEMBERSHIP ID',
    statusLabel: 'MEMBERSHIP STATUS',
    successMessage:
      'Your membership application has been saved and is currently Pending administrator review. You will receive a notification once it is approved.',
  },
};

const Register = ({ defaultType = 'member' }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { registerMember } = useAuth();

  const resolveMode = () => {
    const queryType = searchParams.get('type');
    if (queryType === 'volunteer' || queryType === 'member') {
      return queryType;
    }
    return defaultType;
  };

  const [mode, setMode] = useState(resolveMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    membershipType: 'Annual Member',
    bloodGroup: 'B+',
    gender: 'Prefer not to say',
    dateOfBirth: '',
    occupation: '',
    volunteerWing: 'Weekend Ghat Cleanups',
    availability: 'Weekends (Sat & Sun)',
    street: '',
    city: 'Rajahmundry',
    avatar: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  useEffect(() => {
    setMode(resolveMode());
    setError('');
  }, [defaultType, searchParams]);

  const config = FORM_CONFIG[mode] || FORM_CONFIG.member;
  const isVolunteer = mode === 'volunteer';

  const handleModeSwitch = (nextMode) => {
    if (nextMode === mode) return;
    setError('');
    navigate(nextMode === 'volunteer' ? '/register/volunteer' : '/register/member');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setSubmitting(true);
    try {
      const payload = isVolunteer
        ? {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            membershipType: 'Volunteer Member',
            bloodGroup: formData.bloodGroup,
            occupation: `${formData.volunteerWing} (${formData.availability})`,
            avatar: formData.avatar,
            address: { street: formData.street, city: formData.city },
          }
        : {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            membershipType: formData.membershipType,
            bloodGroup: formData.bloodGroup,
            gender: formData.gender,
            dateOfBirth: formData.dateOfBirth,
            occupation: formData.occupation,
            avatar: formData.avatar,
            address: { street: formData.street, city: formData.city },
          };

      const data = await registerMember(payload);
      setRegisteredUser(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (registeredUser) {
    return (
      <div className="clean-page-wrapper" style={{ background: '#ffffff', minHeight: '80vh' }}>
        <HeroBanner title="Registration Confirmed" subtitle="Welcome to Godhavari Nadhi Paryavarana Parishubratha" />
        <section className="section-padding" style={{ paddingTop: '2rem' }}>
          <div className="container" style={{ maxWidth: '640px' }}>
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #bbf7d0',
                borderRadius: '20px',
                padding: '2.25rem',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0, 107, 60, 0.08)',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#e8f5e9',
                  color: '#006B3C',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ color: '#064e3b', margin: '0 0 0.5rem', fontWeight: 800 }}>
                Thank You, {registeredUser.name}!
              </h2>
              <p style={{ color: '#475569', margin: '0 0 1.25rem', lineHeight: 1.6 }}>
                {config.successMessage} Once approved by the administrator, you will receive a confirmation email and can sign in to your dashboard.
              </p>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-around',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{config.idLabel}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#006B3C' }}>
                    {registeredUser.memberId}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{config.statusLabel}</div>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '2px',
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '2px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                    }}
                  >
                    {registeredUser.membership?.status || 'Pending'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                <Link
                  to="/login"
                  className="btn-hero-join-mission"
                  style={{ textDecoration: 'none' }}
                >
                  <span>Go to Login</span>
                  <ArrowRight size={15} />
                </Link>
                <Link
                  to="/"
                  className="btn-eco-login-outline"
                  style={{ textDecoration: 'none' }}
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="clean-page-wrapper" style={{ background: '#ffffff' }}>
      <HeroBanner title={config.bannerTitle} subtitle={config.bannerSubtitle} />

      <section className="section-padding" style={{ paddingTop: '1.5rem' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#f0fdf4',
              color: '#006B3C',
              border: '1px solid #bbf7d0',
              borderRadius: '9999px',
              padding: '0.4rem 0.95rem',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '1rem',
            }}
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>

          <div className="eco-register-grid">
            {/* Left Visual Showcase */}
            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <div
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(6, 78, 59, 0.12)',
                  marginBottom: '1.5rem',
                  border: '1px solid #d1fae5',
                }}
              >
                <img
                  src={heroPlantImg}
                  alt={config.showcaseTitle}
                  style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <h2 style={{ color: '#064e3b', fontSize: '1.55rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                {config.showcaseTitle}
              </h2>
              <p style={{ color: '#475569', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto' }}>
                {config.showcaseDesc}
              </p>
            </div>

            {/* Right Registration Card */}
            <div className="eco-register-card">
              {/* Mode Switcher */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  background: '#ffffff',
                  padding: '0.35rem',
                  borderRadius: '12px',
                  border: '1px solid #bbf7d0',
                  marginBottom: '1.25rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleModeSwitch('volunteer')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '9px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    background: isVolunteer ? '#008C4A' : 'transparent',
                    color: isVolunteer ? '#ffffff' : '#064e3b',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <HeartHandshake size={15} />
                  <span>Volunteer (Free)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('member')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '9px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    background: !isVolunteer ? '#008C4A' : 'transparent',
                    color: !isVolunteer ? '#ffffff' : '#064e3b',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Award size={15} />
                  <span>Join as Member</span>
                </button>
              </div>

              <h3 style={{ color: '#064e3b', fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                {config.formTitle}
              </h3>

              {error && (
                <div className="alert-banner alert-danger mb-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form-body">
                <PortraitUploadField
                  value={formData.avatar}
                  name={formData.name}
                  label="ID Card Portrait Photo (Optional)"
                  hint="Upload a clear headshot to print on your official digital ID card."
                  onChange={(avatar) => {
                    setFormData((prev) => ({ ...prev, avatar }));
                    setError('');
                  }}
                  onError={(message) => setError(message)}
                  style={{ marginBottom: '0.95rem' }}
                />

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label>Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98480 12345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {isVolunteer ? (
                  <>
                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label>Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group flex-1">
                        <label>City / Area *</label>
                        <input
                          type="text"
                          required
                          placeholder="Rajahmundry"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label>Preferred Volunteer Wing *</label>
                        <select
                          value={formData.volunteerWing}
                          onChange={(e) => setFormData({ ...formData, volunteerWing: e.target.value })}
                        >
                          <option value="Weekend Ghat Cleanups">Weekend Ghat Cleanups</option>
                          <option value="Tree Plantation Drives">Tree Plantation Drives</option>
                          <option value="School & Community Awareness">School &amp; Community Awareness</option>
                          <option value="Water Quality & Survey">Water Quality &amp; Survey</option>
                        </select>
                      </div>
                      <div className="form-group flex-1">
                        <label>Availability *</label>
                        <select
                          value={formData.availability}
                          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                        >
                          <option value="Weekends (Sat & Sun)">Weekends (Sat &amp; Sun)</option>
                          <option value="Weekdays">Weekdays</option>
                          <option value="Special Drives Only">Special Drives Only</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label>Blood Group</label>
                        <select
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        >
                          <option value="O+">O+</option>
                          <option value="A+">A+</option>
                          <option value="B+">B+</option>
                          <option value="AB+">AB+</option>
                          <option value="O-">O-</option>
                          <option value="A-">A-</option>
                          <option value="B-">B-</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                      <div className="form-group flex-1">
                        <label>Street / Locality</label>
                        <input
                          type="text"
                          placeholder="Colony / Ghat Area"
                          value={formData.street}
                          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label>Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group flex-1">
                        <label>Membership Category *</label>
                        <select
                          value={formData.membershipType}
                          onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
                        >
                          <option value="Annual Member">Annual Member (₹500 / year)</option>
                          <option value="Life Member">Life Member (₹5,000)</option>
                          <option value="Student Member">Student Member (Free)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label>Gender</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      <div className="form-group flex-1">
                        <label>Date of Birth</label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label>Occupation</label>
                        <input
                          type="text"
                          placeholder="Student / Engineer / Educator"
                          value={formData.occupation}
                          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                        />
                      </div>
                      <div className="form-group flex-1">
                        <label>City / Location</label>
                        <input
                          type="text"
                          placeholder="Rajahmundry"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        placeholder="Street / Colony / Landmark"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Create Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label>Confirm Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-hero-join-mission"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem', border: 'none', cursor: 'pointer' }}
                >
                  <span>{submitting ? config.submittingLabel : config.submitLabel}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="auth-bottom-links" style={{ marginTop: '1rem', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  Already registered? <Link to="/member/login">Sign in here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
