import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, AlertCircle, CheckCircle, Shield } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    membershipType: 'Volunteer Member',
    bloodGroup: 'B+',
    street: '',
    city: 'Rajahmundry',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      await registerMember({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        membershipType: formData.membershipType,
        bloodGroup: formData.bloodGroup,
        address: { street: formData.street, city: formData.city },
      });
      navigate('/member');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-fullscreen-page">
      <div className="auth-central-card reg-card-wide">
        <div className="auth-logo-header">
          <div className="auth-logo-circle">
            <Droplet size={28} className="text-primary" />
          </div>
          <h2>Join as a Member / Volunteer</h2>
          <p className="auth-brand-sub">Godhavari Nadhi Paryavarana Parishubratha</p>
        </div>

        {error && (
          <div className="alert-banner alert-danger mb-3">
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
                placeholder="Sri / Smt. Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group flex-1">
              <label>Phone Number *</label>
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
              <label>Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="O+">O+</option>
                <option value="AB+">AB+</option>
                <option value="A-">A-</option>
                <option value="B-">B-</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>City / Location</label>
              <input
                type="text"
                placeholder="Rajahmundry / Kovvur / Godavari Belt"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
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

          <button type="submit" disabled={submitting} className="btn btn-primary btn-block mt-3">
            {submitting ? 'Creating Membership Profile...' : 'Complete Registration & Generate ID'}
          </button>
        </form>

        <div className="auth-bottom-links">
          <p>
            Already an active member? <Link to="/member/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
