import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { User, Phone, Mail, MapPin, Heart, LogOut, CheckCircle, CreditCard } from 'lucide-react';

const MemberProfile = () => {
  const { user, membership, logout, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || 'B+');
  const [city, setCity] = useState(user?.address?.city || 'Rajahmundry');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.patch('/member/profile', {
        name,
        phone,
        bloodGroup,
        address: { city },
      });
      await refreshProfile();
      setFeedback('Profile details successfully updated!');
      setEditing(false);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="member-screen member-profile-screen">
      <div className="profile-hero-card">
        <div className="profile-avatar-wrap">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
            alt={user?.name}
            className="profile-avatar"
          />
        </div>
        <h2 className="profile-name">{user?.name}</h2>
        <span className="profile-id-tag">{user?.memberId || 'GNPP-2026-MEMBER'}</span>
        <div className="profile-badge-row">
          <span className="badge badge-green">{membership?.membershipType || 'Active Member'}</span>
          <span className="badge badge-outline">{user?.designation || 'Volunteer'}</span>
        </div>
      </div>

      {feedback && <div className="alert-banner alert-success mb-3">{feedback}</div>}

      <div className="app-card profile-details-card">
        <div className="card-header-flex">
          <h3>Personal Details</h3>
          <button
            onClick={() => setEditing(!editing)}
            className="btn btn-xs btn-outline"
          >
            {editing ? 'Cancel' : 'Edit Info'}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
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
            <div className="form-group">
              <label>City / Ghat Region</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <button type="submit" disabled={saving} className="btn btn-primary btn-block">
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        ) : (
          <div className="profile-info-list">
            <div className="info-item">
              <Mail size={16} className="text-muted" />
              <div>
                <span className="info-label">Email</span>
                <span className="info-val">{user?.email}</span>
              </div>
            </div>
            <div className="info-item">
              <Phone size={16} className="text-muted" />
              <div>
                <span className="info-label">Phone</span>
                <span className="info-val">{user?.phone}</span>
              </div>
            </div>
            <div className="info-item">
              <Heart size={16} className="text-muted" />
              <div>
                <span className="info-label">Blood Group</span>
                <span className="info-val font-semibold">{user?.bloodGroup || 'B+'}</span>
              </div>
            </div>
            <div className="info-item">
              <MapPin size={16} className="text-muted" />
              <div>
                <span className="info-label">Location</span>
                <span className="info-val">{user?.address?.city || 'Rajahmundry'}, Andhra Pradesh</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="profile-actions-box mt-3">
        <button onClick={logout} className="btn btn-outline btn-block text-danger">
          <LogOut size={16} /> Sign Out of App
        </button>
      </div>
    </div>
  );
};

export default MemberProfile;

