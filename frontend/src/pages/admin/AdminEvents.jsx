import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Calendar,
  Plus,
  Trash2,
  MapPin,
  Clock,
  Users,
  Eye,
  Lock,
  X,
  Droplet,
} from 'lucide-react';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'Cleanliness Drive',
    date: '',
    time: '06:30 AM - 09:30 AM',
    venue: 'Kotilingala Ghat',
    riverGhat: 'Kotilingala Ghat',
    isPublic: true,
    isMemberOnly: false,
    targetVolunteers: 50,
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/events');
      setEvents(data || []);
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to load events' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      await API.post('/admin/events', {
        title: formData.title,
        description: formData.description,
        eventType: formData.eventType,
        date: formData.date,
        time: formData.time,
        location: {
          venue: formData.venue,
          riverGhat: formData.riverGhat,
          city: 'Rajahmundry',
        },
        isPublic: formData.isPublic,
        isMemberOnly: formData.isMemberOnly,
        targetVolunteers: Number(formData.targetVolunteers),
      });

      setFeedback({ type: 'success', text: `Event "${formData.title}" published!` });
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        eventType: 'Cleanliness Drive',
        date: '',
        time: '06:30 AM - 09:30 AM',
        venue: 'Kotilingala Ghat',
        riverGhat: 'Kotilingala Ghat',
        isPublic: true,
        isMemberOnly: false,
        targetVolunteers: 50,
      });
      fetchEvents();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to create event',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"?`)) return;
    try {
      await API.delete(`/admin/events/${id}`);
      setFeedback({ type: 'success', text: `Event "${title}" removed` });
      fetchEvents();
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to delete event' });
    }
  };

  return (
    <div className="admin-events-page">
      <div className="admin-page-header">
        <div>
          <h2>Cleanliness Drives & Awareness Events</h2>
          <p>Organize riverfront cleanliness campaigns, workshops, and awareness rallies.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Schedule New Drive / Event
        </button>
      </div>

      {feedback.text && (
        <div className={`alert-banner ${feedback.type === 'error' ? 'alert-danger' : 'alert-success'}`}>
          {feedback.text}
        </div>
      )}

      {/* Events Grid */}
      {loading ? (
        <div className="admin-loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="admin-card p-4 text-center">No events found. Schedule one above.</div>
      ) : (
        <div className="admin-events-grid">
          {events.map((evt) => (
            <div key={evt._id} className="admin-event-card">
              <div className="admin-event-card-top">
                <span className="badge badge-green">{evt.eventType}</span>
                <div className="visibility-tag">
                  {evt.isPublic ? (
                    <span className="text-muted flex items-center gap-1 text-xs">
                      <Eye size={12} /> Public
                    </span>
                  ) : (
                    <span className="text-amber flex items-center gap-1 text-xs">
                      <Lock size={12} /> Members Only
                    </span>
                  )}
                </div>
              </div>

              <h3 className="admin-event-title">{evt.title}</h3>
              <p className="admin-event-desc">{evt.description}</p>

              <div className="admin-event-details">
                <div className="detail-item">
                  <Calendar size={14} className="text-muted" />
                  <span>{new Date(evt.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                </div>
                <div className="detail-item">
                  <Clock size={14} className="text-muted" />
                  <span>{evt.time}</span>
                </div>
                <div className="detail-item">
                  <MapPin size={14} className="text-muted" />
                  <span>{evt.location?.venue || 'Rajahmundry'}</span>
                </div>
                <div className="detail-item">
                  <Users size={14} className="text-muted" />
                  <span>{evt.enrolledVolunteersCount || 0} enrolled / {evt.targetVolunteers} target</span>
                </div>
              </div>

              <div className="admin-event-card-footer">
                <button
                  onClick={() => handleDelete(evt._id, evt.title)}
                  className="btn btn-xs btn-outline btn-danger"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Publish Cleanliness Drive / Event</h3>
              <button onClick={() => setShowAddModal(false)} className="btn-close">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="modal-body">
              <div className="form-group">
                <label>Event / Drive Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maha Godavari Ghat Cleanliness Drive - Phase V"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Event Category</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  >
                    <option value="Cleanliness Drive">Cleanliness Drive</option>
                    <option value="Awareness Program">Awareness Program</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Tree Plantation">Tree Plantation</option>
                    <option value="Riverfront Rally">Riverfront Rally</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Target Volunteers</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={formData.targetVolunteers}
                    onChange={(e) => setFormData({ ...formData, targetVolunteers: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Timing *</label>
                  <input
                    type="text"
                    required
                    placeholder="06:30 AM - 09:30 AM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Ghat / Location Venue *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pushkar Ghat / Kotilingala Ghat Steps"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>River Ghat</label>
                  <input
                    type="text"
                    placeholder="Kotilingala Ghat"
                    value={formData.riverGhat}
                    onChange={(e) => setFormData({ ...formData, riverGhat: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description & Scope of Activity *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Outline the area of cleaning, safety equipment provided, and target waste materials..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  />
                  <span>Display on Public Website</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isMemberOnly}
                    onChange={(e) => setFormData({ ...formData, isMemberOnly: e.target.checked })}
                  />
                  <span>Members-Only Access</span>
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Publishing...' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;

