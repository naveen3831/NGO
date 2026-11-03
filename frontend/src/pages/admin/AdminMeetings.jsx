import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Clock, Plus, Trash2, Video, MapPin, X } from 'lucide-react';

const AdminMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

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
      setFeedback({ type: 'error', text: 'Failed to load meetings' });
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
      setFeedback({ type: 'success', text: 'Meeting scheduled successfully' });
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
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Error creating meeting' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete meeting "${title}"?`)) return;
    try {
      await API.delete(`/admin/meetings/${id}`);
      setFeedback({ type: 'success', text: 'Meeting removed' });
      fetchMeetings();
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to remove meeting' });
    }
  };

  return (
    <div className="admin-meetings-page">
      <div className="admin-page-header">
        <div>
          <h2>Meetings & Sessions Management</h2>
          <p>Schedule executive committee meetings, volunteer briefings, and general body sessions.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Schedule Meeting
        </button>
      </div>

      {feedback.text && (
        <div className={`alert-banner ${feedback.type === 'error' ? 'alert-danger' : 'alert-success'}`}>
          {feedback.text}
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Loading scheduled meetings...</div>
      ) : meetings.length === 0 ? (
        <div className="admin-card p-4 text-center">No meetings scheduled.</div>
      ) : (
        <div className="admin-meetings-list">
          {meetings.map((m) => (
            <div key={m._id} className="admin-meeting-card">
              <div className="meeting-header">
                <div>
                  <span className="badge badge-amber">{m.meetingType}</span>
                  <span className="badge badge-outline ml-2">{m.targetAudience}</span>
                </div>
                <button
                  onClick={() => handleDelete(m._id, m.title)}
                  className="btn btn-xs btn-icon btn-danger"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <h3 className="meeting-title">{m.title}</h3>
              <p className="meeting-agenda"><strong>Agenda:</strong> {m.agenda}</p>

              <div className="meeting-meta-row">
                <span>🗓️ {new Date(m.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                <span>⏰ {m.time}</span>
                <span>
                  {m.isVirtual ? <Video size={13} className="inline mr-1" /> : <MapPin size={13} className="inline mr-1" />}
                  {m.location}
                </span>
                {m.meetingLink && (
                  <a href={m.meetingLink} target="_blank" rel="noreferrer" className="text-primary underline text-xs">
                    Join Link
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Schedule New Meeting</h3>
              <button onClick={() => setShowAddModal(false)} className="btn-close">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateMeeting} className="modal-body">
              <div className="form-group">
                <label>Meeting Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Executive Committee Meeting"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Meeting Category</label>
                  <select
                    value={formData.meetingType}
                    onChange={(e) => setFormData({ ...formData, meetingType: e.target.value })}
                  >
                    <option value="Executive Committee">Executive Committee</option>
                    <option value="General Body">General Body</option>
                    <option value="Volunteer Briefing">Volunteer Briefing</option>
                    <option value="Annual General Meeting">Annual General Meeting</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  >
                    <option value="All Members">All Members</option>
                    <option value="Executive Committee Only">Executive Committee Only</option>
                    <option value="Volunteers Only">Volunteers Only</option>
                  </select>
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
                    placeholder="05:30 PM - 07:00 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Venue / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="Central Office / Community Hall"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label mb-2">
                  <input
                    type="checkbox"
                    checked={formData.isVirtual}
                    onChange={(e) => setFormData({ ...formData, isVirtual: e.target.checked })}
                  />
                  <span>Online / Virtual Conference Session</span>
                </label>
                {formData.isVirtual && (
                  <input
                    type="url"
                    placeholder="Google Meet / Zoom link"
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  />
                )}
              </div>

              <div className="form-group">
                <label>Key Agenda Points *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="1. Action item review 2. Budget allocation 3. Upcoming drives..."
                  value={formData.agenda}
                  onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                ></textarea>
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
                  {submitting ? 'Scheduling...' : 'Save & Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMeetings;

