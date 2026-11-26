import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { recordAdminAction } from '../../services/auditService';
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
  Eye,
  Edit2,
  Droplet,
  Megaphone,
  Award,
  ChevronRight,
  ShieldCheck,
  Save,
  Globe,
  Lock,
  ArrowLeft,
} from 'lucide-react';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals for CRUD operations
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);

  // Form State: Add Event
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'Cleanliness Drive',
    date: '',
    time: '06:30 AM - 10:00 AM',
    venue: 'Kotilingala Ghat, Riverbank Reach',
    riverGhat: 'Kotilingala Ghat',
    city: 'Rajahmundry',
    isPublic: true,
    isMemberOnly: false,
    targetVolunteers: 100,
  });

  // Form State: Edit Event
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    eventType: 'Cleanliness Drive',
    date: '',
    time: '',
    venue: '',
    riverGhat: '',
    city: 'Rajahmundry',
    isPublic: true,
    isMemberOnly: false,
    targetVolunteers: 100,
    enrolledVolunteersCount: 0,
    status: 'Upcoming',
  });

  // Fetch all events from API
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/events');
      setEvents(data || []);
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to load events from database.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Helper: Format date for input[type="date"]
  const formatDateForInput = (dateVal) => {
    if (!dateVal) return '';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Helper: Category badge CSS class
  const getCategoryBadgeClass = (type) => {
    switch (type) {
      case 'Cleanliness Drive':
        return 'ref-tier-volunteer';
      case 'Awareness Program':
        return 'ref-tier-life';
      case 'Workshop':
        return 'ref-tier-annual';
      case 'Tree Plantation':
        return 'ref-tier-volunteer';
      case 'Riverfront Rally':
        return 'ref-tier-patron';
      default:
        return 'ref-tier-volunteer';
    }
  };

  // Helper: Category Icon
  const getCategoryIcon = (type) => {
    switch (type) {
      case 'Cleanliness Drive':
        return <Droplet size={13} />;
      case 'Awareness Program':
        return <Users size={13} />;
      case 'Workshop':
        return <Award size={13} />;
      case 'Tree Plantation':
        return <Droplet size={13} />;
      case 'Riverfront Rally':
        return <Megaphone size={13} />;
      default:
        return <Calendar size={13} />;
    }
  };

  // ---------------------------------------------------------------------------
  // CRUD 1: CREATE
  // ---------------------------------------------------------------------------
  const openAddModal = () => {
    setFormData({
      title: '',
      description: '',
      eventType: 'Cleanliness Drive',
      date: new Date().toISOString().split('T')[0],
      time: '06:30 AM - 10:00 AM',
      venue: 'Kotilingala Ghat, Riverbank Reach',
      riverGhat: 'Kotilingala Ghat',
      city: 'Rajahmundry',
      isPublic: true,
      isMemberOnly: false,
      targetVolunteers: 100,
    });
    setShowAddModal(true);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      await API.post('/admin/events', {
        title: formData.title.trim(),
        description: formData.description.trim(),
        eventType: formData.eventType,
        date: new Date(formData.date),
        time: formData.time.trim(),
        location: {
          venue: formData.venue.trim(),
          riverGhat: formData.riverGhat.trim(),
          city: formData.city.trim() || 'Rajahmundry',
        },
        isPublic: formData.isPublic,
        isMemberOnly: formData.isMemberOnly,
        targetVolunteers: Number(formData.targetVolunteers) || 50,
      });

      setFeedback({
        type: 'success',
        text: `Event "${formData.title}" scheduled successfully!`
      });
      setShowAddModal(false);
      recordAdminAction({
        action: `Scheduled new drive/event "${formData.title}" at ${formData.venue || 'Ghat'}`,
        category: 'Events',
      });
      fetchEvents();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to create event'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // CRUD 2: READ (View Details)
  // ---------------------------------------------------------------------------
  const openViewModal = (evt) => {
    setViewingEvent(evt);
  };

  // ---------------------------------------------------------------------------
  // CRUD 3: UPDATE (Edit Event)
  // ---------------------------------------------------------------------------
  const openEditModal = (evt) => {
    setEditingEvent(evt);
    setEditFormData({
      title: evt.title || '',
      description: evt.description || '',
      eventType: evt.eventType || 'Cleanliness Drive',
      date: formatDateForInput(evt.date),
      time: evt.time || '06:30 AM - 10:00 AM',
      venue: evt.location?.venue || '',
      riverGhat: evt.location?.riverGhat || '',
      city: evt.location?.city || 'Rajahmundry',
      isPublic: evt.isPublic !== undefined ? evt.isPublic : true,
      isMemberOnly: evt.isMemberOnly !== undefined ? evt.isMemberOnly : false,
      targetVolunteers: evt.targetVolunteers || 100,
      enrolledVolunteersCount: evt.enrolledVolunteersCount || 0,
      status: evt.status || (new Date(evt.date) >= new Date() ? 'Upcoming' : 'Completed'),
    });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    setSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      const payload = {
        title: editFormData.title.trim(),
        description: editFormData.description.trim(),
        eventType: editFormData.eventType,
        date: new Date(editFormData.date),
        time: editFormData.time.trim(),
        location: {
          venue: editFormData.venue.trim(),
          riverGhat: editFormData.riverGhat.trim(),
          city: editFormData.city.trim() || 'Rajahmundry',
        },
        status: editFormData.status,
        isPublic: editFormData.isPublic,
        isMemberOnly: editFormData.isMemberOnly,
        targetVolunteers: Number(editFormData.targetVolunteers) || 50,
        enrolledVolunteersCount: Number(editFormData.enrolledVolunteersCount) || 0,
      };

      await API.patch(`/admin/events/${editingEvent._id}`, payload);
      setFeedback({
        type: 'success',
        text: `Event "${editFormData.title}" updated successfully!`
      });
      setEditingEvent(null);
      recordAdminAction({
        action: `Updated event schedule and location for "${editFormData.title}"`,
        category: 'Events',
      });
      fetchEvents();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update event'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // CRUD 4: DELETE (Confirmation Modal)
  // ---------------------------------------------------------------------------
  const openDeleteModal = (evt) => {
    setDeletingEvent(evt);
  };

  const handleConfirmDelete = async () => {
    if (!deletingEvent) return;
    setSubmitting(true);
    try {
      await API.delete(`/admin/events/${deletingEvent._id}`);
      setFeedback({
        type: 'success',
        text: `Event "${deletingEvent.title}" removed successfully.`
      });
      recordAdminAction({
        action: `Removed event record "${deletingEvent.title}"`,
        category: 'Events',
        severity: 'warning',
      });
      setDeletingEvent(null);
      fetchEvents();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete event'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Filter & Search Logic
  // ---------------------------------------------------------------------------
  const filteredEvents = events.filter((evt) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = (evt.title || '').toLowerCase().includes(q);
      const matchVenue = (evt.location?.venue || '').toLowerCase().includes(q);
      const matchGhat = (evt.location?.riverGhat || '').toLowerCase().includes(q);
      const matchDesc = (evt.description || '').toLowerCase().includes(q);
      if (!matchTitle && !matchVenue && !matchGhat && !matchDesc) return false;
    }
    if (filterType !== 'All') {
      if (evt.eventType !== filterType) return false;
    }
    if (filterStatus !== 'All') {
      const isUp = new Date(evt.date) >= new Date();
      if (filterStatus === 'Upcoming' && !isUp) return false;
      if (filterStatus === 'Past' && isUp) return false;
    }
    return true;
  });

  // Dynamic Metrics
  const totalEvents = events.length;
  const cleanlinessCount = events.filter((e) => e.eventType === 'Cleanliness Drive').length;
  const awarenessCount = events.filter(
    (e) => e.eventType === 'Awareness Program' || e.eventType === 'Workshop' || e.eventType === 'Riverfront Rally'
  ).length;
  const totalTargetVolunteers = events.reduce((acc, cur) => acc + (cur.targetVolunteers || 0), 0);

  // =========================================================================
  // FULL PAGE VIEW 1: COMPLETE EDIT EVENT (WITH SIDEBAR VISIBLE)
  // =========================================================================
  if (editingEvent) {
    return (
      <div className="ref-events-page">
        {/* Top Back Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setEditingEvent(null)}
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
            <span>Return to Drives & Events</span>
          </button>

          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Drives & Events Directory &bull; Edit Campaign Details
          </span>
        </div>

        {/* Full-Width Form Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              padding: '1.5rem 1.75rem',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Edit Event / Drive Details
                </h3>
                <span className={`ref-tier-badge ${getCategoryBadgeClass(editFormData.eventType)}`}>
                  {editFormData.eventType}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                Update scheduled timings, ghat location, volunteer thresholds, and campaign agenda.
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateEvent}>
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="ref-form-field">
                <label className="ref-form-label">Event Title *</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="ref-form-input"
                />
              </div>

              <div className="ref-form-grid-2">
                <div className="ref-form-field">
                  <label className="ref-form-label">Event Category *</label>
                  <select
                    value={editFormData.eventType}
                    onChange={(e) => setEditFormData({ ...editFormData, eventType: e.target.value })}
                    className="ref-form-select"
                  >
                    <option value="Cleanliness Drive">Cleanliness Drive</option>
                    <option value="Awareness Program">Awareness Program</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Tree Plantation">Tree Plantation</option>
                    <option value="Riverfront Rally">Riverfront Rally</option>
                  </select>
                </div>

                <div className="ref-form-field">
                  <label className="ref-form-label">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="ref-form-select"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="ref-form-grid-2">
                <div className="ref-form-field">
                  <label className="ref-form-label">Date *</label>
                  <input
                    type="date"
                    required
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    className="ref-form-input"
                  />
                </div>

                <div className="ref-form-field">
                  <label className="ref-form-label">Time Window *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.time}
                    onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                    className="ref-form-input"
                  />
                </div>
              </div>

              <div className="ref-form-grid-2">
                <div className="ref-form-field">
                  <label className="ref-form-label">Venue / Meeting Point</label>
                  <input
                    type="text"
                    value={editFormData.venue}
                    onChange={(e) => setEditFormData({ ...editFormData, venue: e.target.value })}
                    className="ref-form-input"
                  />
                </div>

                <div className="ref-form-field">
                  <label className="ref-form-label">Ghat Location</label>
                  <input
                    type="text"
                    value={editFormData.riverGhat}
                    onChange={(e) => setEditFormData({ ...editFormData, riverGhat: e.target.value })}
                    className="ref-form-input"
                  />
                </div>
              </div>

              <div className="ref-form-grid-2">
                <div className="ref-form-field">
                  <label className="ref-form-label">Target Volunteers</label>
                  <input
                    type="number"
                    min="1"
                    value={editFormData.targetVolunteers}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, targetVolunteers: e.target.value })
                    }
                    className="ref-form-input"
                  />
                </div>

                <div className="ref-form-field">
                  <label className="ref-form-label">Enrolled Volunteers</label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.enrolledVolunteersCount}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, enrolledVolunteersCount: e.target.value })
                    }
                    className="ref-form-input"
                  />
                </div>
              </div>

              <div className="ref-form-field">
                <label className="ref-form-label">Campaign Description *</label>
                <textarea
                  rows={4}
                  required
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="ref-form-textarea"
                />
              </div>
            </div>

            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderTop: '1px solid #f1f5f9',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem',
              }}
            >
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="eco-cms-btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="ref-btn-enroll"
                style={{ padding: '0.6rem 1.4rem' }}
              >
                {submitting ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // FULL PAGE VIEW 2: COMPLETE EVENT DOSSIER (WITH SIDEBAR VISIBLE)
  // =========================================================================
  if (viewingEvent) {
    return (
      <div className="ref-events-page">
        {/* Top Back Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setViewingEvent(null)}
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
            <span>Return to Drives & Events</span>
          </button>

          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Drives & Events Directory &bull; Event Overview & Schedule
          </span>
        </div>

        {/* Full-Width Dossier Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {/* Header Strip */}
          <div
            style={{
              padding: '1.5rem 1.75rem',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
                <span className={`ref-tier-badge ${getCategoryBadgeClass(viewingEvent.eventType)}`}>
                  {getCategoryIcon(viewingEvent.eventType)}
                  <span>{viewingEvent.eventType}</span>
                </span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold border border-slate-200">
                  {new Date(viewingEvent.date) >= new Date() ? 'Upcoming Event' : 'Past Event'}
                </span>
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                {viewingEvent.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.84rem', color: '#64748b' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} className="text-emerald-600" />
                  {viewingEvent.location?.venue || 'Kotilingala Ghat'}
                </span>
                <span>&bull;</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} className="text-blue-600" />
                  {viewingEvent.time}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => {
                  const target = viewingEvent;
                  setViewingEvent(null);
                  openEditModal(target);
                }}
                className="ref-btn-enroll"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.15rem',
                  fontSize: '0.84rem',
                }}
              >
                <Edit2 size={15} />
                <span>Edit Event Details</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = viewingEvent;
                  setViewingEvent(null);
                  openDeleteModal(target);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '9px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#dc2626',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={15} />
                <span>Delete Event</span>
              </button>
            </div>
          </div>

          {/* Details Body */}
          <div style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* 4-Grid Stats Card */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Date of Event</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem', display: 'block' }}>
                  {new Date(viewingEvent.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Time Window</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem', display: 'block' }}>
                  {viewingEvent.time || '06:30 AM - 10:00 AM'}
                </span>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', display: 'block' }}>River Ghat</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem', display: 'block' }}>
                  {viewingEvent.location?.riverGhat || 'Kotilingala Ghat'}
                </span>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Volunteer Mobilization</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#059669', marginTop: '0.2rem', display: 'block' }}>
                  {viewingEvent.enrolledVolunteersCount || 0} Enrolled / {viewingEvent.targetVolunteers || 100} Target
                </span>
              </div>
            </div>

            {/* Campaign Description Box */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.65rem' }}>
                Full Campaign Agenda & Field Guidelines
              </h4>
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  fontSize: '0.96rem',
                  lineHeight: 1.7,
                  color: '#1e293b',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {viewingEvent.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // FULL PAGE VIEW 3: COMPLETE DELETE CONFIRMATION (WITH SIDEBAR VISIBLE)
  // =========================================================================
  if (deletingEvent) {
    return (
      <div className="ref-events-page">
        {/* Top Back Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setDeletingEvent(null)}
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
            <span>Return to Drives & Events</span>
          </button>

          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Drives & Events Directory &bull; Permanent Removal Confirmation
          </span>
        </div>

        {/* Full-Width Danger Removal Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #fee2e2',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.05)',
          }}
        >
          {/* Header Strip */}
          <div
            style={{
              padding: '1.5rem 1.75rem',
              borderBottom: '1px solid #fee2e2',
              backgroundColor: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#991b1b', margin: 0 }}>
                Delete Event Record
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#b91c1c', margin: '0.2rem 0 0 0' }}>
                Please review this scheduled event carefully before confirming permanent removal.
              </p>
            </div>
          </div>

          {/* Details Body */}
          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                <span className={`ref-tier-badge ${getCategoryBadgeClass(deletingEvent.eventType)}`}>
                  {getCategoryIcon(deletingEvent.eventType)}
                  <span>{deletingEvent.eventType}</span>
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {new Date(deletingEvent.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                {deletingEvent.title}
              </h4>

              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                {deletingEvent.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.78rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                <span>Venue: {deletingEvent.location?.venue || 'Kotilingala Ghat'}</span>
                <span>&bull;</span>
                <span>Time: {deletingEvent.time}</span>
                <span>&bull;</span>
                <span>Volunteers: {deletingEvent.enrolledVolunteersCount || 0} / {deletingEvent.targetVolunteers || 100}</span>
              </div>
            </div>

            {/* Red Warning Box */}
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div style={{ fontSize: '0.85rem', color: '#991b1b', lineHeight: 1.5 }}>
                <strong>Permanent Removal Warning:</strong> This will permanently delete the event record, volunteer enrolment lists, and attendance rosters from MongoDB Atlas.
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div
            style={{
              padding: '1.25rem 1.75rem',
              borderTop: '1px solid #f1f5f9',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
            }}
          >
            <button
              type="button"
              onClick={() => setDeletingEvent(null)}
              className="eco-cms-btn-secondary"
              disabled={submitting}
              style={{ padding: '0.6rem 1.25rem' }}
            >
              Cancel & Keep Event
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={submitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.6rem 1.4rem',
                borderRadius: '9px',
                backgroundColor: '#dc2626',
                border: '1px solid #dc2626',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(220, 38, 38, 0.3)',
              }}
            >
              <Trash2 size={16} />
              <span>{submitting ? 'Removing...' : 'Delete Event Record'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // FULL PAGE VIEW 4: COMPLETE SCHEDULE EVENT (WITH SIDEBAR VISIBLE)
  // =========================================================================
  if (showAddModal) {
    return (
      <div className="ref-events-page">
        {/* Top Back Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
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
            <span>Return to Drives & Events</span>
          </button>

          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Drives & Events Directory &bull; Schedule New Campaign
          </span>
        </div>

        {/* Full-Width Form Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              padding: '1.5rem 1.75rem',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Schedule New Drive / Event
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
              Create a riverfront cleanup drive, awareness rally, or educational workshop for volunteers.
            </p>
          </div>

          <form onSubmit={handleCreateEvent}>
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="ref-form-field">
                <label className="ref-form-label">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maha Godavari Ghat Cleanliness Drive - Phase IV"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="ref-form-input"
                />
              </div>

              <div className="ref-form-grid-2">
                <div className="ref-form-field">
                  <label className="ref-form-label">Event Category *</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="ref-form-select"
                  >
                    <option value="Cleanliness Drive">Cleanliness Drive</option>
                    <option value="Awareness Program">Awareness Program</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Tree Plantation">Tree Plantation</option>
                    <option value="Riverfront Rally">Riverfront Rally</option>
                  </select>
                </div>

                <div className="ref-form-field">
                  <label className="ref-form-label">Target Volunteers</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.targetVolunteers}
                    onChange={(e) => setFormData({ ...formData, targetVolunteers: e.target.value })}
                    className="ref-form-input"
                  />
                </div>
              </div>

              <div className="ref-form-grid-2">
                <div className="ref-form-field">
                  <label className="ref-form-label">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="ref-form-input"
                  />
                </div>

                <div className="ref-form-field">
                  <label className="ref-form-label">Time Window *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 06:30 AM - 10:00 AM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="ref-form-input"
                  />
                </div>
              </div>

              <div className="ref-form-grid-2">
                <div className="ref-form-field">
                  <label className="ref-form-label">Venue / Meeting Point</label>
                  <input
                    type="text"
                    placeholder="e.g. Kotilingala Ghat, Riverbank Reach"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="ref-form-input"
                  />
                </div>

                <div className="ref-form-field">
                  <label className="ref-form-label">Ghat Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Kotilingala Ghat"
                    value={formData.riverGhat}
                    onChange={(e) => setFormData({ ...formData, riverGhat: e.target.value })}
                    className="ref-form-input"
                  />
                </div>
              </div>

              <div className="ref-form-field">
                <label className="ref-form-label">Campaign Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Outline key cleanup zones, volunteer assembly instructions, safety protocols..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="ref-form-textarea"
                />
              </div>
            </div>

            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderTop: '1px solid #f1f5f9',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem',
              }}
            >
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
                className="ref-btn-enroll"
                style={{ padding: '0.6rem 1.4rem' }}
              >
                {submitting ? 'Scheduling...' : 'Schedule Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="ref-events-page">
      {/* 1. Header Row */}
      <div className="ref-header-row">
        <div className="ref-header-left">
          <div className="ref-header-icon-box">
            <Calendar size={22} />
          </div>
          <div className="ref-header-text">
            <h2>Cleanliness Drives & Activities</h2>
            <p>Schedule, manage, and coordinate community riverfront cleanliness drives and awareness events.</p>
          </div>
        </div>

        <div className="ref-header-actions">
          {/* Subnav switcher matching second image */}
          <div className="eco-subnav-tabs">
            <Link
              to="/admin/events"
              className="eco-subnav-tab active"
              title="Active: Riverfront Drives & Events"
            >
              <Calendar size={15} />
              <span>Drives & Events</span>
            </Link>
            <Link
              to="/admin/meetings"
              className="eco-subnav-tab"
              title="Switch to Meetings & Sessions"
            >
              <Clock size={15} className="text-emerald-700" />
              <span>Meetings</span>
            </Link>
          </div>

          <button
            onClick={openAddModal}
            className="ref-btn-enroll"
            title="Schedule a new drive or event"
          >
            <Plus size={14} />
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      {/* 2. Alert Feedback Banner */}
      {feedback.text && (
        <div className="ref-alert-banner">
          <div className="ref-alert-left">
            {feedback.type === 'error' ? (
              <AlertTriangle size={18} className="text-red-600 flex-shrink-0" />
            ) : (
              <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback({ type: '', text: '' })}
            className="ref-alert-dismiss"
            title="Dismiss notification"
          >
            Dismiss &times;
          </button>
        </div>
      )}

      {/* 3. 4-Card KPI Stat Strip */}
      <div className="ref-kpi-grid">
        <div className="ref-kpi-card">
          <div className="ref-kpi-icon-bubble ref-bubble-blue">
            <Calendar size={20} />
          </div>
          <div className="ref-kpi-details">
            <span className="ref-kpi-label">Total Events</span>
            <span className="ref-kpi-value">{totalEvents}</span>
            <span className="ref-kpi-sub text-blue-600">All Scheduled</span>
          </div>
        </div>

        <div className="ref-kpi-card">
          <div className="ref-kpi-icon-bubble ref-bubble-green">
            <Droplet size={20} />
          </div>
          <div className="ref-kpi-details">
            <span className="ref-kpi-label">Cleanliness Drives</span>
            <span className="ref-kpi-value">{cleanlinessCount}</span>
            <span className="ref-kpi-sub text-emerald-600">Riverfront Cleanup</span>
          </div>
        </div>

        <div className="ref-kpi-card">
          <div className="ref-kpi-icon-bubble ref-bubble-orange">
            <Megaphone size={20} />
          </div>
          <div className="ref-kpi-details">
            <span className="ref-kpi-label">Awareness & Rallies</span>
            <span className="ref-kpi-value">{awarenessCount}</span>
            <span className="ref-kpi-sub text-orange-600">Community Outreach</span>
          </div>
        </div>

        <div className="ref-kpi-card">
          <div className="ref-kpi-icon-bubble ref-bubble-purple">
            <Users size={20} />
          </div>
          <div className="ref-kpi-details">
            <span className="ref-kpi-label">Target Volunteers</span>
            <span className="ref-kpi-value">{totalTargetVolunteers}</span>
            <span className="ref-kpi-sub text-purple-600">Total Enrolled Reach</span>
          </div>
        </div>
      </div>

      {/* 4. Filter & Search Bar Card */}
      <div className="ref-filter-card">
        <div className="ref-search-wrap">
          <Search size={15} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by event title, location, ghat, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="btn-close"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="ref-filter-actions">
          <div className="ref-select-item">
            <Filter size={13} className="text-slate-500" />
            <span className="ref-select-label">CATEGORY:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="ref-select-input"
            >
              <option value="All">All Categories</option>
              <option value="Cleanliness Drive">Cleanliness Drive</option>
              <option value="Awareness Program">Awareness Program</option>
              <option value="Workshop">Workshop</option>
              <option value="Tree Plantation">Tree Plantation</option>
              <option value="Riverfront Rally">Riverfront Rally</option>
            </select>
          </div>

          <div className="ref-select-item">
            <span className="ref-select-label">STATUS:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="ref-select-input"
            >
              <option value="All">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Past">Past Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Section Header */}
      <div className="ref-section-header">
        <h3 className="ref-section-title">
          Upcoming Drives & Events ({filteredEvents.length})
        </h3>
        {(search || filterType !== 'All' || filterStatus !== 'All') && (
          <button
            onClick={() => {
              setSearch('');
              setFilterType('All');
              setFilterStatus('All');
            }}
            className="ref-section-link"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* 5B. Pending Volunteer Requests (Admin Approval) */}
      {events.some((e) => (e.volunteerRequests || []).length > 0) && (
        <div
          className="ref-table-card"
          style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem', border: '1px solid #bbf7d0', background: '#f7fbf7' }}
        >
          <h3 style={{ color: '#064e3b', fontSize: '1.05rem', fontWeight: 750, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} />
            <span>Volunteer Join Requests</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {events.flatMap((evt) =>
              (evt.volunteerRequests || []).map((req) => (
                <div
                  key={req._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
                      {req.name} {req.memberId ? `(${req.memberId})` : ''}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                      Event: <strong>{evt.title}</strong> • {req.email}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background:
                          req.status === 'Confirmed'
                            ? '#dcfce7'
                            : req.status === 'Rejected'
                            ? '#fee2e2'
                            : '#fef3c7',
                        color:
                          req.status === 'Confirmed'
                            ? '#064e3b'
                            : req.status === 'Rejected'
                            ? '#dc2626'
                            : '#92400e',
                      }}
                    >
                      {req.status}
                    </span>
                    {req.status !== 'Confirmed' && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await API.patch(`/admin/events/${evt._id}/volunteers/${req._id}`, { status: 'Confirmed' });
                            setEvents((prev) => prev.map((e) => (e._id === evt._id ? res.data.event : e)));
                          } catch (err) {
                            alert('Failed to confirm volunteer');
                          }
                        }}
                        style={{
                          background: '#006B3C',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.38rem 0.85rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Give Access (Confirm Volunteer)
                      </button>
                    )}
                    {req.status === 'Pending' && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await API.patch(`/admin/events/${evt._id}/volunteers/${req._id}`, { status: 'Rejected' });
                            setEvents((prev) => prev.map((e) => (e._id === evt._id ? res.data.event : e)));
                          } catch (err) {
                            alert('Failed to reject request');
                          }
                        }}
                        style={{
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.38rem 0.75rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Decline
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 6. Events Cards List */}
      {loading ? (
        <div className="ref-table-card p-12 text-center text-muted">
          <RefreshCw size={28} className="animate-spin inline mb-2 text-blue-600" />
          <p className="font-semibold text-slate-700 text-sm">Loading events from database...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="ref-table-card p-12 text-center text-muted">
          <Calendar size={36} className="mx-auto mb-2 opacity-40 text-slate-500" />
          <p className="font-semibold text-sm text-slate-700 mb-1">
            No events found matching your search.
          </p>
          <button
            onClick={openAddModal}
            className="ref-btn-enroll mt-3"
          >
            <Plus size={15} />
            <span>Schedule New Event</span>
          </button>
        </div>
      ) : (
        <div className="ref-events-list">
          {filteredEvents.map((evt) => {
            const enrolled = evt.enrolledVolunteersCount || (evt.eventType === 'Cleanliness Drive' ? 42 : 88);
            const target = evt.targetVolunteers || (evt.eventType === 'Cleanliness Drive' ? 100 : 200);
            const percent = Math.min(100, Math.round((enrolled / target) * 100));
            const eventDate = new Date(evt.date || Date.now());
            const isUpcoming = eventDate >= new Date();

            const formattedDate = eventDate.toLocaleDateString('en-US', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div key={evt._id} className="ref-event-card">
                {/* Top Row: Category Badge + Title + Status Pill */}
                <div className="ref-event-top-row">
                  <div className="ref-event-badge-title">
                    <span className={`ref-tier-badge ${getCategoryBadgeClass(evt.eventType)}`}>
                      {getCategoryIcon(evt.eventType)}
                      <span>{evt.eventType}</span>
                    </span>
                    <h3 className="ref-event-title" title={evt.title}>
                      {evt.title}
                    </h3>
                  </div>

                  <span
                    className={`ref-event-status-pill ${
                      isUpcoming ? 'ref-status-upcoming' : 'ref-status-past'
                    }`}
                  >
                    <span className="ref-status-dot"></span>
                    <span>{isUpcoming ? 'Upcoming' : 'Past Event'}</span>
                  </span>
                </div>

                {/* Middle Row: Schedule Info + Description + 3 CRUD Actions */}
                <div className="ref-event-mid-row">
                  {/* Left: Schedule Information */}
                  <div className="ref-event-schedule-col">
                    <div className="ref-event-schedule-item">
                      <Calendar size={13} className="text-emerald-600 flex-shrink-0" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="ref-event-schedule-item">
                      <Clock size={13} className="text-slate-400 flex-shrink-0" />
                      <span>{evt.time || '06:30 AM - 10:00 AM'}</span>
                    </div>
                    <div className="ref-event-schedule-item" title={`${evt.location?.venue || 'Kotilingala Ghat'}${evt.location?.riverGhat ? ` (${evt.location.riverGhat})` : ''}`}>
                      <MapPin size={13} className="text-rose-500 flex-shrink-0" />
                      <span>
                        {evt.location?.venue || 'Kotilingala Ghat, Riverbank Reach'}
                        {evt.location?.riverGhat && ` (${evt.location.riverGhat})`}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Description */}
                  <div className="ref-event-desc-col">
                    <p>{evt.description}</p>
                  </div>

                  {/* Right: Actions (Labeled Edit, Delete) */}
                  <div className="ref-event-actions-col">
                    {/* UPDATE */}
                    <button
                      type="button"
                      onClick={() => openEditModal(evt)}
                      className="ref-btn-edit-action"
                      title="Edit Event Details"
                    >
                      <Edit2 size={11} />
                      <span>Edit</span>
                    </button>

                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={() => openDeleteModal(evt)}
                      className="ref-act-btn delete"
                      title="Delete event record"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Volunteer Progress Bar */}
                <div className="ref-event-bottom-row">
                  <div className="ref-event-volunteers-text">
                    <Users size={13} className="text-slate-400" />
                    <span>
                      {enrolled} / {target} Volunteers Enrolled ({percent}%)
                    </span>
                  </div>
                  <div className="ref-event-progress-track">
                    <div
                      className="ref-event-progress-bar"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
