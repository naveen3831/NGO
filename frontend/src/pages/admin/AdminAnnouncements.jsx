import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Megaphone, Plus, Trash2, X, AlertCircle } from 'lucide-react';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General Update',
    priority: 'Normal',
    visibility: 'All',
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/announcements');
      setAnnouncements(data || []);
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to load announcements' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/admin/announcements', formData);
      setFeedback({ type: 'success', text: 'Announcement published successfully' });
      setShowAddModal(false);
      setFormData({
        title: '',
        content: '',
        category: 'General Update',
        priority: 'Normal',
        visibility: 'All',
      });
      fetchAnnouncements();
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to publish announcement' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete announcement "${title}"?`)) return;
    try {
      await API.delete(`/admin/announcements/${id}`);
      setFeedback({ type: 'success', text: 'Announcement removed' });
      fetchAnnouncements();
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to delete announcement' });
    }
  };

  return (
    <div className="admin-announcements-page">
      <div className="admin-page-header">
        <div>
          <h2>Announcements & Circulars</h2>
          <p>Publish official updates, river cleanliness alerts, and circulars.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {feedback.text && (
        <div className={`alert-banner ${feedback.type === 'error' ? 'alert-danger' : 'alert-success'}`}>
          {feedback.text}
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className="admin-card p-4 text-center">No announcements published yet.</div>
      ) : (
        <div className="announcements-list-view">
          {announcements.map((a) => (
            <div key={a._id} className="announcement-item-card">
              <div className="announcement-header">
                <div className="badge-group">
                  <span className={`badge ${a.priority === 'Urgent' ? 'badge-danger' : a.priority === 'Important' ? 'badge-amber' : 'badge-outline'}`}>
                    {a.priority}
                  </span>
                  <span className="badge badge-purple">{a.category}</span>
                  <span className="badge badge-blue">Audience: {a.visibility}</span>
                </div>
                <button
                  onClick={() => handleDelete(a._id, a.title)}
                  className="btn btn-xs btn-icon btn-danger"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <h3 className="announcement-title">{a.title}</h3>
              <p className="announcement-body-text">{a.content}</p>

              <div className="announcement-footer">
                <small className="text-muted">
                  Published: {new Date(a.publishedAt || a.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Create Announcement</h3>
              <button onClick={() => setShowAddModal(false)} className="btn-close">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateAnnouncement} className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Single-Use Plastic Ban on River Ghats"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="General Update">General Update</option>
                    <option value="Cleanliness Alert">Cleanliness Alert</option>
                    <option value="Meeting Circular">Meeting Circular</option>
                    <option value="Event Notice">Event Notice</option>
                    <option value="Press Release">Press Release</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent Alert</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Visibility</label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                  >
                    <option value="All">All Audiences</option>
                    <option value="Public">Public Only</option>
                    <option value="Members Only">Members Only</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Announcement Details *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Provide full description of the announcement..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                  {submitting ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;

