import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Bell, Send, CheckCircle, Smartphone } from 'lucide-react';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'General Announcement',
    targetAudience: 'All Members',
    channel: 'In-App',
  });

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/notifications');
      setNotifications(data || []);
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to load notifications' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      await API.post('/admin/notifications', formData);
      setFeedback({ type: 'success', text: 'Notification dispatched successfully to all member devices!' });
      setFormData({
        title: '',
        message: '',
        type: 'General Announcement',
        targetAudience: 'All Members',
        channel: 'In-App',
      });
      fetchNotifications();
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to send notification' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-notifications-page">
      <div className="admin-page-header">
        <div>
          <h2>Member Notifications Dispatcher</h2>
          <p>Send urgent alerts, drive reminders, and meeting updates to member devices.</p>
        </div>
      </div>

      {feedback.text && (
        <div className={`alert-banner ${feedback.type === 'error' ? 'alert-danger' : 'alert-success'}`}>
          {feedback.text}
        </div>
      )}

      <div className="notifications-grid">
        {/* Left: Compose Form */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Compose Broadcast / In-App Alert</h3>
          </div>
          <form onSubmit={handleSendNotification} className="admin-card-body">
            <div className="form-group">
              <label>Notification Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g. Drive Reminder: Assembly at Pushkar Ghat"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Category</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="General Announcement">General Announcement</option>
                  <option value="Event Reminder">Event Reminder</option>
                  <option value="Meeting Notice">Meeting Notice</option>
                  <option value="Alert">Urgent River Alert</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label>Target Audience</label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                >
                  <option value="All Members">All Members</option>
                  <option value="Active Volunteers">Active Volunteers</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Delivery Channel</label>
              <select
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
              >
                <option value="In-App">In-App Notification Feed</option>
                <option value="Push Notification">Mobile Push Notification (Firebase)</option>
                <option value="Broadcast">All Broadcast Channels</option>
              </select>
            </div>

            <div className="form-group">
              <label>Message Text *</label>
              <textarea
                rows="4"
                required
                placeholder="Type your alert or reminder text here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary">
              <Send size={16} /> {submitting ? 'Dispatching...' : 'Dispatch Notification'}
            </button>
          </form>
        </div>

        {/* Right: Sent History */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Dispatched Notifications History</h3>
          </div>
          <div className="admin-card-body">
            {loading ? (
              <div className="admin-loading">Loading log...</div>
            ) : notifications.length === 0 ? (
              <p className="empty-state-text">No notifications dispatched yet.</p>
            ) : (
              <div className="notification-history-list">
                {notifications.map((n) => (
                  <div key={n._id} className="history-notification-item">
                    <div className="history-header">
                      <strong>{n.title}</strong>
                      <span className="badge badge-sm badge-outline">{n.type}</span>
                    </div>
                    <p className="history-msg">{n.message}</p>
                    <div className="history-footer">
                      <span>Audience: {n.targetAudience}</span>
                      <span>Channel: {n.channel}</span>
                      <span>{new Date(n.createdAt).toLocaleDateString('en-IN', { dateStyle: 'short' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;

