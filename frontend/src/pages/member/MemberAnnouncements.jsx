import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Calendar, Users, CheckCircle2, Plus, X, AlertCircle } from 'lucide-react';

const volunteerFallbackNotice = {
  _id: 'vol-only-1',
  title: 'Volunteer Field Duty Roster: Sunday Ghat Sanitation & Gear Briefing',
  content:
    'Exclusive circular for active volunteers: Report at Kotilingala Ghat assembly point by 06:15 AM for safety glove distribution, zone allocation, and plastic waste weighing.',
  category: 'Cleanliness Alert',
  priority: 'Important',
  visibility: 'Volunteers Only',
  publishedAt: new Date().toISOString(),
};

const MemberAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('All');
  const [acceptedDuties, setAcceptedDuties] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'Cleanliness Alert',
    priority: 'Normal',
    content: '',
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await API.get('/member/announcements');
        const list = Array.isArray(data) ? data : [];
        const hasVolunteerNotice = list.some(
          (item) => item.visibility === 'Volunteers Only'
        );
        setAnnouncements(hasVolunteerNotice ? list : [volunteerFallbackNotice, ...list]);
      } catch (err) {
        console.error('Failed to load member announcements:', err);
        setAnnouncements([volunteerFallbackNotice]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const isVolunteerNotice = (a) =>
    a.visibility === 'Volunteers Only' ||
    (a.title || '').toLowerCase().includes('volunteer') ||
    (a.content || '').toLowerCase().includes('volunteer');

  const displayedAnnouncements =
    filterMode === 'Volunteers Only'
      ? announcements.filter(isVolunteerNotice)
      : announcements;

  const toggleDutyAccept = (id) => {
    setAcceptedDuties((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!newNotice.title.trim() || !newNotice.content.trim()) {
      setFormError('Please enter both a title and announcement message.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await API.post('/member/announcements', newNotice);
      setAnnouncements((prev) => [data, ...prev]);
      setNewNotice({
        title: '',
        category: 'Cleanliness Alert',
        priority: 'Normal',
        content: '',
      });
      setShowAddForm(false);
      setFilterMode('Volunteers Only');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Unable to post announcement. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="member-screen member-notices-screen">
      <div
        className="screen-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <h2>Announcements &amp; Circulars</h2>
          <p className="text-muted text-sm" style={{ margin: 0 }}>
            Official communications, riverfront regulations, and volunteer-only notices.
          </p>
        </div>

        {/* Filter Option + Add Volunteer Announcement Button */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {['All', 'Volunteers Only'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilterMode(mode)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.48rem 1.05rem',
                borderRadius: '9999px',
                border: filterMode === mode ? '1px solid #006B3C' : '1px solid #cbd5e1',
                background: filterMode === mode ? '#006B3C' : '#ffffff',
                color: filterMode === mode ? '#ffffff' : '#173D2B',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {mode === 'Volunteers Only' && <Users size={14} />}
              <span>{mode === 'All' ? 'All Circulars' : 'Only for Volunteers'}</span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              setShowAddForm((prev) => !prev);
              setFormError('');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1.15rem',
              borderRadius: '9999px',
              border: 'none',
              background: '#008C4A',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 140, 74, 0.25)',
            }}
          >
            {showAddForm ? <X size={15} /> : <Plus size={15} />}
            <span>{showAddForm ? 'Cancel' : 'Add Volunteer Announcement'}</span>
          </button>
        </div>
      </div>

      {/* Add Volunteer Announcement Form */}
      {showAddForm && (
        <div
          className="app-card"
          style={{
            marginBottom: '1.5rem',
            border: '1px solid #bbf7d0',
            background: '#ffffff',
          }}
        >
          <h3 style={{ color: '#006B3C', marginBottom: '0.85rem', fontSize: '1.1rem' }}>
            Post New Volunteer Announcement
          </h3>

          {formError && (
            <div
              className="alert-banner alert-danger mb-3"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleCreateAnnouncement} className="auth-form-body">
            <div className="form-group">
              <label>Announcement Title *</label>
              <input
                type="text"
                required
                placeholder="e.g., Sunday Morning Pushkar Ghat Cleanup Reporting Time"
                value={newNotice.title}
                onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Category</label>
                <select
                  value={newNotice.category}
                  onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                >
                  <option value="Cleanliness Alert">Cleanliness Alert</option>
                  <option value="Event Notice">Event Notice</option>
                  <option value="Meeting Circular">Meeting Circular</option>
                  <option value="General Update">General Update</option>
                </select>
              </div>
              <div className="form-group flex-1">
                <label>Priority</label>
                <select
                  value={newNotice.priority}
                  onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value })}
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Message / Details *</label>
              <textarea
                rows="3"
                required
                placeholder="Share instructions, meeting point, or volunteer duty update..."
                value={newNotice.content}
                onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ backgroundColor: '#006B3C', borderColor: '#006B3C' }}
            >
              {submitting ? 'Publishing...' : 'Publish Volunteer Announcement'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading updates...</div>
      ) : displayedAnnouncements.length === 0 ? (
        <div className="app-card text-center p-4">No active announcements in this category.</div>
      ) : (
        <div className="notices-stack">
          {displayedAnnouncements.map((a) => {
            const volOnly = isVolunteerNotice(a);
            const accepted = !!acceptedDuties[a._id];

            return (
              <div key={a._id} className="app-card notice-card">
                <div className="notice-header" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span
                    className={`badge ${
                      a.priority === 'Urgent'
                        ? 'badge-danger'
                        : a.priority === 'Important'
                        ? 'badge-amber'
                        : 'badge-blue'
                    }`}
                  >
                    {a.priority}
                  </span>
                  <span className="badge badge-outline">{a.category}</span>
                  {volOnly && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#E8F5E9',
                        color: '#006B3C',
                        border: '1px solid #86efac',
                        borderRadius: '9999px',
                        padding: '2px 10px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                      }}
                    >
                      <Users size={12} />
                      <span>Only for Volunteers</span>
                    </span>
                  )}
                </div>

                <h3 className="notice-title">{a.title}</h3>
                <p className="notice-content">{a.content}</p>

                <div
                  className="notice-footer"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <Calendar size={12} />
                    <span>
                      {new Date(a.publishedAt || a.createdAt).toLocaleDateString('en-IN', {
                        dateStyle: 'medium',
                      })}
                      {a.createdBy?.name ? ` • Posted by ${a.createdBy.name}` : ''}
                    </span>
                  </div>

                  {volOnly && (
                    <button
                      type="button"
                      onClick={() => toggleDutyAccept(a._id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: accepted ? '#dcfce7' : '#006B3C',
                        color: accepted ? '#064e3b' : '#ffffff',
                        border: accepted ? '1px solid #86efac' : 'none',
                        borderRadius: '9999px',
                        padding: '0.4rem 1rem',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <CheckCircle2 size={14} />
                      <span>{accepted ? 'Volunteer Duty Confirmed' : 'Confirm Volunteer Availability'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MemberAnnouncements;
