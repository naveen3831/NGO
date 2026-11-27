import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Video,
  MapPin,
  X,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Users,
  ShieldCheck,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';

const AdminMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  const [formData, setFormData] = useState({
    title: '',
    meetingType: 'Executive Committee',
    agenda: '',
    date: '',
    time: '05:30 PM - 07:00 PM',
    location: 'NGO Central Secretariat, Bund Road, Rajahmundry',
    isVirtual: false,
    meetingLink: '',
    targetAudience: 'All Members',
  });

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/meetings');
      setMeetings(data || []);
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to load meetings from database.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/admin/meetings', formData);
      setFeedback({ type: 'success', text: `Meeting "${formData.title}" scheduled successfully!` });
      setShowAddModal(false);
      setFormData({
        title: '',
        meetingType: 'Executive Committee',
        agenda: '',
        date: '',
        time: '05:30 PM - 07:00 PM',
        location: 'NGO Central Secretariat, Bund Road, Rajahmundry',
        isVirtual: false,
        meetingLink: '',
        targetAudience: 'All Members',
      });
      fetchMeetings();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Error scheduling meeting',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await API.delete(`/admin/meetings/${deleteTarget.id}`);
      setFeedback({ type: 'success', text: `Meeting "${deleteTarget.title}" removed successfully.` });
      setDeleteTarget(null);
      fetchMeetings();
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to remove meeting from database.' });
      setDeleteTarget(null);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch =
      !search ||
      m.title?.toLowerCase().includes(search.toLowerCase()) ||
      m.agenda?.toLowerCase().includes(search.toLowerCase()) ||
      m.location?.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === 'All' || m.meetingType === filterType;

    return matchesSearch && matchesType;
  });

  const resetFilters = () => {
    setSearch('');
    setFilterType('All');
  };

  const hasActiveFilters = search !== '' || filterType !== 'All';

  // Dynamic counts
  const totalCount = meetings.length;
  const execCount = meetings.filter((m) => m.meetingType === 'Executive Committee').length;
  const generalCount = meetings.filter(
    (m) => m.meetingType === 'General Body' || m.meetingType === 'Annual General Meeting'
  ).length;
  const virtualCount = meetings.filter((m) => m.isVirtual).length;

  if (deleteTarget) {
    return (
      <div className="ref-members-page">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="ref-btn-enroll"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              padding: '0.55rem 1.15rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Meetings</span>
          </button>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Meetings &bull; Confirm Removal
          </span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #fecaca', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '1.4rem 1.75rem', borderBottom: '1px solid #fee2e2', background: '#fef2f2', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={22} className="text-red-600" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#991b1b' }}>
              Remove Scheduled Meeting
            </h3>
          </div>
          <div style={{ padding: '1.75rem' }}>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>
              Are you sure you want to permanently remove the meeting <strong className="text-slate-900">{deleteTarget.title}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="ref-modal-btn-cancel"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="ref-btn-delete-confirm"
                disabled={submitting}
              >
                {submitting ? 'Removing...' : 'Delete Meeting'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showAddModal) {
    return (
      <div className="ref-members-page">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="ref-btn-enroll"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              padding: '0.55rem 1.15rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Meetings</span>
          </button>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Meetings &bull; Schedule New Session
          </span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
              Schedule New Meeting
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: '#64748b' }}>
              Plan executive discussions, volunteer briefings, and general body sessions.
            </p>
          </div>

          <form onSubmit={handleCreateMeeting}>
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div className="eco-form-field">
                <label className="eco-field-label">Meeting Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Executive Committee Meeting"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="eco-field-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="eco-form-field">
                  <label className="eco-field-label">Meeting Category</label>
                  <select
                    value={formData.meetingType}
                    onChange={(e) => setFormData({ ...formData, meetingType: e.target.value })}
                    className="eco-field-select"
                  >
                    <option value="Executive Committee">Executive Committee</option>
                    <option value="General Body">General Body</option>
                    <option value="Volunteer Briefing">Volunteer Briefing</option>
                    <option value="Annual General Meeting">Annual General Meeting</option>
                  </select>
                </div>

                <div className="eco-form-field">
                  <label className="eco-field-label">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="eco-field-select"
                  >
                    <option value="All Members">All Members</option>
                    <option value="Executive Committee Only">Executive Committee Only</option>
                    <option value="Volunteers Only">Volunteers Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="eco-form-field">
                  <label className="eco-field-label">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="eco-field-input"
                  />
                </div>

                <div className="eco-form-field">
                  <label className="eco-field-label">Timing *</label>
                  <input
                    type="text"
                    required
                    placeholder="05:30 PM - 07:00 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="eco-field-input"
                  />
                </div>
              </div>

              <div className="eco-form-field">
                <label className="eco-field-label">Venue / Physical Location *</label>
                <input
                  type="text"
                  required
                  placeholder="NGO Central Secretariat, Bund Road, Rajahmundry"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="eco-field-input"
                />
              </div>

              <div className="eco-modal-card-box">
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.isVirtual}
                    onChange={(e) => setFormData({ ...formData, isVirtual: e.target.checked })}
                    className="accent-[#063b2c] w-4 h-4 rounded"
                  />
                  <span>Online / Virtual Video Conference Session</span>
                </label>

                {formData.isVirtual && (
                  <div className="mt-2">
                    <label className="eco-field-label">Virtual Meeting Link</label>
                    <input
                      type="url"
                      placeholder="https://meet.google.com/xyz or Zoom link"
                      value={formData.meetingLink}
                      onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                      className="eco-field-input"
                    />
                  </div>
                )}
              </div>

              <div className="eco-form-field">
                <label className="eco-field-label">Key Agenda Points *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="1. Action item review  2. Waste management budget  3. Upcoming river cleaning drive..."
                  value={formData.agenda}
                  onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                  className="eco-field-textarea"
                ></textarea>
              </div>
            </div>

            <div style={{ padding: '1.15rem 1.75rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="eco-cms-btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="eco-cms-btn-primary"
              >
                {submitting ? 'Scheduling...' : 'Save & Schedule'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="eco-cms-page">
      {/* 1. Sub-navigation tabs (Drives & Events vs Member Meetings) */}
      <div className="eco-subnav-tabs">
        <Link to="/admin/events" className="eco-subnav-tab">
          <Calendar size={15} />
          <span>Drives & Events</span>
        </Link>
        <Link to="/admin/meetings" className="eco-subnav-tab active">
          <Clock size={15} />
          <span>Meetings</span>
        </Link>
      </div>

      {/* 2. Top Header Row */}
      <div className="eco-cms-header-row">
        <div className="eco-cms-header-info">
          <div className="eco-cms-badge-row">
            <span className="eco-cms-live-badge">
              <span className="live-dot-pulse"></span>
              Governance & Council Sessions &bull; MongoDB Live
            </span>
          </div>
          <h1 className="eco-cms-main-title">Meetings & Sessions Management</h1>
          <p className="eco-cms-sub-title">
            Schedule executive committee meetings, volunteer briefings, and general body sessions for the NGO.
          </p>
        </div>

        <div className="eco-cms-header-actions">
          <button
            onClick={fetchMeetings}
            className="eco-cms-btn-secondary"
            disabled={loading}
            title="Reload scheduled meetings"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="eco-cms-btn-primary"
          >
            <Plus size={16} />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* 3. Feedback Banner */}
      {feedback.text && (
        <div
          className={`eco-cms-alert-banner ${
            feedback.type === 'error' ? 'alert-danger' : 'alert-success'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'error' ? (
              <AlertTriangle size={18} className="text-red-600 flex-shrink-0" />
            ) : (
              <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback({ type: '', text: '' })}
            className="text-xs opacity-70 hover:opacity-100 font-semibold cursor-pointer border-none bg-transparent"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4. Four Pastel Metric KPI Cards */}
      <section className="eco-kpi-4-strip">
        <div className="eco-stat-card eco-stat-blue">
          <div className="eco-stat-icon-bubble bg-blue-bubble">
            <Clock size={20} className="text-blue-icon" />
          </div>
          <div className="eco-stat-details">
            <span className="eco-stat-label">Total Meetings</span>
            <div className="eco-stat-number">{totalCount}</div>
            <span className="eco-stat-trend text-blue-icon">Scheduled Sessions</span>
          </div>
        </div>

        <div className="eco-stat-card eco-stat-green">
          <div className="eco-stat-icon-bubble bg-green-bubble">
            <ShieldCheck size={20} className="text-green-icon" />
          </div>
          <div className="eco-stat-details">
            <span className="eco-stat-label">Executive Committee</span>
            <div className="eco-stat-number">{execCount}</div>
            <span className="eco-stat-trend text-trend-green">Governance</span>
          </div>
        </div>

        <div className="eco-stat-card eco-stat-orange">
          <div className="eco-stat-icon-bubble bg-orange-bubble">
            <Users size={20} className="text-orange-icon" />
          </div>
          <div className="eco-stat-details">
            <span className="eco-stat-label">General Body</span>
            <div className="eco-stat-number">{generalCount}</div>
            <span className="eco-stat-trend text-orange-icon">All Members</span>
          </div>
        </div>

        <div className="eco-stat-card eco-stat-purple">
          <div className="eco-stat-icon-bubble bg-purple-bubble">
            <Video size={20} className="text-purple-icon" />
          </div>
          <div className="eco-stat-details">
            <span className="eco-stat-label">Virtual Sessions</span>
            <div className="eco-stat-number">{virtualCount}</div>
            <span className="eco-stat-trend text-purple-icon">Online Meets</span>
          </div>
        </div>
      </section>

      {/* 5. Filter & Search Bar */}
      <section className="eco-events-filter-bar">
        <div className="eco-filter-left">
          <div className="eco-search-bar">
            <Search size={16} className="eco-search-icon" />
            <input
              type="text"
              placeholder="Search by meeting title, agenda, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="eco-search-input"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="eco-search-clear-btn"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="eco-filter-right">
          <div className="eco-filter-group">
            <label className="eco-filter-label">
              <Filter size={12} className="inline mr-1" /> Category:
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="eco-filter-select"
            >
              <option value="All">All Categories</option>
              <option value="Executive Committee">Executive Committee</option>
              <option value="General Body">General Body</option>
              <option value="Volunteer Briefing">Volunteer Briefing</option>
              <option value="Annual General Meeting">Annual General Meeting</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="eco-reset-filters-btn"
              title="Reset all filters"
            >
              <X size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </section>

      {/* 6. Meetings Card Grid */}
      {loading ? (
        <div className="eco-table-card p-12 text-center text-muted">
          <RefreshCw size={28} className="animate-spin inline mb-3 text-emerald-700" />
          <p className="font-semibold text-slate-700">Loading scheduled meetings...</p>
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="eco-table-card p-12 text-center text-muted">
          <Clock size={36} className="mx-auto mb-3 opacity-40 text-slate-500" />
          <p className="font-semibold text-base text-slate-700 mb-1">
            No meetings found matching your criteria.
          </p>
          <span className="text-sm text-slate-500">
            Schedule a new meeting or reset your filters.
          </span>
          <div className="mt-4 flex justify-center gap-2">
            {hasActiveFilters && (
              <button onClick={resetFilters} className="eco-reset-filters-btn">
                Reset Filters
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="eco-cms-btn-primary"
            >
              <Plus size={15} /> Schedule Meeting
            </button>
          </div>
        </div>
      ) : (
        <div className="eco-events-grid">
          {filteredMeetings.map((m) => {
            const meetingDate = new Date(m.date);
            const isUpcoming = meetingDate >= new Date();

            return (
              <div key={m._id} className="eco-event-card">
                <div>
                  <div className="eco-event-card-header">
                    <span className="eco-tier-pill eco-tier-patron">
                      {m.meetingType}
                    </span>
                    <span className="eco-id-tag">
                      {m.targetAudience}
                    </span>
                  </div>

                  <h3 className="eco-event-title">{m.title}</h3>
                  <p className="eco-event-desc">
                    <strong>Agenda:</strong> {m.agenda}
                  </p>

                  <div className="eco-event-meta-box">
                    <div className="eco-meta-row">
                      <Calendar size={14} className="eco-meta-icon text-emerald-700" />
                      <span>
                        {meetingDate.toLocaleDateString('en-IN', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="eco-meta-row">
                      <Clock size={14} className="eco-meta-icon text-amber-600" />
                      <span>{m.time}</span>
                    </div>

                    <div className="eco-meta-row">
                      {m.isVirtual ? (
                        <Video size={14} className="eco-meta-icon text-purple-600" />
                      ) : (
                        <MapPin size={14} className="eco-meta-icon text-blue-600" />
                      )}
                      <span>{m.location}</span>
                    </div>

                    {m.meetingLink && (
                      <div className="eco-meta-row">
                        <ExternalLink size={14} className="eco-meta-icon text-blue-600" />
                        <a
                          href={m.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-700 font-semibold underline text-xs"
                        >
                          Join Virtual Meeting
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="eco-event-card-footer">
                  <span
                    className={`eco-status-pill ${
                      isUpcoming ? 'status-active' : 'status-suspended'
                    }`}
                  >
                    <span className="status-dot-indicator"></span>
                    {isUpcoming ? 'Scheduled' : 'Concluded'}
                  </span>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: m._id, title: m.title })}
                    className="eco-btn-delete-card"
                    title="Delete this meeting"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default AdminMeetings;
