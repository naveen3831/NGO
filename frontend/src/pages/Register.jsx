import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroBanner from '../components/HeroBanner';
import heroPlantImg from '../assets/hero-plant.jpg';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    membershipType: 'Volunteer Member',
    bloodGroup: 'B+',
    gender: 'Prefer not to say',
    dateOfBirth: '',
    occupation: '',
    street: '',
    city: 'Rajahmundry',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const { registerMember } = useAuth();
  const navigate = useNavigate();

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
      const data = await registerMember({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        membershipType: formData.membershipType,
        bloodGroup: formData.bloodGroup,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        occupation: formData.occupation,
        address: { street: formData.street, city: formData.city },
      });
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
                Your membership application has been saved and is currently <strong>Pending</strong> administrator review. You will receive a notification once it is approved.
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
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>UNIQUE MEMBERSHIP ID</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#006B3C' }}>
                    {registeredUser.memberId}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>MEMBERSHIP STATUS</div>
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
                <button
                  type="button"
                  onClick={() => navigate('/member/profile')}
                  className="btn-hero-join-mission"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  <span>Go to Member Dashboard</span>
                  <ArrowRight size={15} />
                </button>
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
      <HeroBanner title="Join Us" subtitle="Be a Part of Our Mission" />

      <section className="section-padding" style={{ paddingTop: '1.5rem' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left Visual Showcase matching Join Us Reference */}
            <div style={{ textAlign: 'center', padding: '1rem' }}>
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
                  alt="Together we can make a difference"
                  style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <h2 style={{ color: '#064e3b', fontSize: '1.55rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Together we can make a difference
              </h2>
              <p style={{ color: '#475569', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto' }}>
                Become an active volunteer or member of Godhavari Nadhi Paryavarana Parishubratha and receive your digital Member ID for ghat cleanups and plantation drives.
              </p>
            </div>

            {/* Right Membership Registration Form */}
            <div
              style={{
                background: '#eaf8ee',
                border: '1px solid #d1fae5',
                borderRadius: '20px',
                padding: '2rem',
              }}
            >
              <h3 style={{ color: '#064e3b', fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                Join Our Mission
              </h3>

              {error && (
                <div className="alert-banner alert-danger mb-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form-body">
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
                      <option value="Volunteer Member">Active Volunteer (Free)</option>
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
                  <span>{submitting ? 'Submitting Registration...' : 'Submit Registration'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="auth-bottom-links" style={{ marginTop: '1rem', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  Already an active member? <Link to="/member/login">Sign in here</Link>
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
