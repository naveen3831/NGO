import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import {
  Bell,
  Send,
  CheckCircle,
  Smartphone,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Users,
  Radio,
  Search,
  X,
  Clock,
  Check,
  ArrowRight,
  Inbox,
} from 'lucide-react';

const AdminNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [unreadInboxCount, setUnreadInboxCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [historySearch, setHistorySearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'General Announcement',
    targetAudience: 'All Members',
    channel: 'In-App',
  });

  const fetchAllNotifications = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const [broadcastRes, inboxRes] = await Promise.all([
        API.get('/admin/notifications'),
        API.get('/admin/notifications/admin-inbox').catch(() => ({
          data: { notifications: [], unreadCount: 0 },
        })),
      ]);
      setNotifications(Array.isArray(broadcastRes.data) ? broadcastRes.data : []);
      setInbox(Array.isArray(inboxRes.data?.notifications) ? inboxRes.data.notifications : []);
      setUnreadInboxCount(inboxRes.data?.unreadCount || 0);
    } catch {
      if (!silent) {
        setFeedback({ type: 'error', text: 'Failed to load notifications from database.' });
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotifications();

    const handleRealtime = () => {
      fetchAllNotifications({ silent: true });
    };
    window.addEventListener('ngo-admin-realtime', handleRealtime);
    return () => window.removeEventListener('ngo-admin-realtime', handleRealtime);
  }, []);

  const handleMarkInboxRead = async (notif, goToMembers = false) => {
    if (!notif.isRead) {
      try {
        await API.patch(`/admin/notifications/${notif._id}/read`);
        setInbox((prev) =>
          prev.map((item) => (item._id === notif._id ? { ...item, isRead: true } : item))
        );
        setUnreadInboxCount((prev) => Math.max(0, prev - 1));
        window.dispatchEvent(new Event('ngo-admin-notifications-sync'));
      } catch {
        // Ignore
      }
    }
    if (goToMembers) {
      navigate('/admin/members');
    }
  };

  const handleMarkAllInboxRead = async () => {
    try {
      await API.patch('/admin/notifications/read-all');
      setInbox((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadInboxCount(0);
      window.dispatchEvent(new Event('ngo-admin-notifications-sync'));
    } catch {
      setFeedback({ type: 'error', text: 'Failed to mark notifications as read.' });
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      await API.post('/admin/notifications', formData);
      setFeedback({
        type: 'success',
        text: 'Notification dispatched successfully to all member devices!',
      });
      setFormData({
        title: '',
        message: '',
        type: 'General Announcement',
        targetAudience: 'All Members',
        channel: 'In-App',
      });
      fetchAllNotifications();
    } catch {
      setFeedback({ type: 'error', text: 'Failed to dispatch notification to members.' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredHistory = notifications.filter((n) => {
    const matchesSearch =
      !historySearch ||
      n.title?.toLowerCase().includes(historySearch.toLowerCase()) ||
      n.message?.toLowerCase().includes(historySearch.toLowerCase());

    const matchesType = filterType === 'All' || n.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalCount = notifications.length;
  const alertCount = notifications.filter((n) => n.type === 'Alert').length;
  const eventReminderCount = notifications.filter((n) => n.type === 'Event Reminder').length;
  const broadcastCount = notifications.filter((n) => n.channel !== 'In-App').length;

  const getCategoryBadgeClass = (type) => {
    switch (type) {
      case 'Alert':
        return 'eco-priority-urgent';
      case 'Event Reminder':
        return 'eco-tier-volunteer';
      case 'Meeting Notice':
        return 'eco-tier-patron';
      case 'General Announcement':
      default:
        return 'eco-tier-annual';
    }
  };

  return (
    <div className="eco-cms-page">
      {/* 1. Full-Page Header */}
      <div className="eco-cms-header-row">
        <div className="eco-cms-header-info">
          <div className="eco-cms-badge-row">
            <span className="eco-cms-live-badge">
              <span className="live-dot-pulse"></span>
              Live Notifications Center &amp; Broadcasts &bull; Full Page View
            </span>
          </div>
          <h1 className="eco-cms-main-title">Notifications &amp; Member Alerts</h1>
          <p className="eco-cms-sub-title">
            Review real-time registration notifications and dispatch announcements or urgent alerts across all members.
          </p>
        </div>

        <div className="eco-cms-header-actions">
          <button
            type="button"
            onClick={() => fetchAllNotifications()}
            className="eco-cms-btn-secondary"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          {unreadInboxCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllInboxRead}
              className="eco-cms-btn-primary"
            >
              <Check size={15} />
              <span>Mark All Read ({unreadInboxCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Feedback Alert Banner */}
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
            type="button"
            onClick={() => setFeedback({ type: '', text: '' })}
            className="text-xs opacity-70 hover:opacity-100 font-semibold cursor-pointer border-none bg-transparent"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Full-Page Incoming Registration & Admin Inbox Notifications */}
      <section
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div
          className="eco-card-header-bar"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}
        >
          <h3 className="eco-card-header-title">
            <Inbox size={18} className="text-emerald-700" />
            <span>Incoming Admin Alerts &amp; New Registrations</span>
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span
              style={{
                background: unreadInboxCount > 0 ? '#dcfce7' : '#f1f5f9',
                color: unreadInboxCount > 0 ? '#065f46' : '#475569',
                borderRadius: '9999px',
                padding: '0.2rem 0.7rem',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {unreadInboxCount} Unread
            </span>
          </div>
        </div>

        <div style={{ padding: '1rem 1.25rem' }}>
          {loading ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.86rem' }}>
              <RefreshCw size={20} className="animate-spin inline mr-2 text-emerald-700" />
              Loading live inbox notifications...
            </div>
          ) : inbox.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.86rem' }}>
              No incoming registration or admin notifications yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {inbox.map((notif) => (
                <div
                  key={notif._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.85rem',
                    padding: '0.95rem 1.15rem',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: notif.isRead ? '#e2e8f0' : '#86efac',
                    background: notif.isRead ? '#ffffff' : '#f0fdf4',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: notif.isRead ? '#cbd5e1' : '#059669',
                        marginTop: '6px',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>
                        {notif.title}
                      </div>
                      <div style={{ fontSize: '0.83rem', color: '#475569', marginTop: '3px', lineHeight: 1.45 }}>
                        {notif.message}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '5px' }}>
                        {new Date(notif.createdAt).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkInboxRead(notif, false)}
                        style={{
                          background: '#ffffff',
                          color: '#065f46',
                          border: '1px solid #a7f3d0',
                          borderRadius: '8px',
                          padding: '0.4rem 0.75rem',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleMarkInboxRead(notif, true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: '#059669',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.42rem 0.85rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <span>Verify in Members</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. 4-Card Pastel KPI Metric Strip */}
      <section className="eco-kpi-4-strip">
        <div className="eco-stat-card eco-stat-blue">
          <div className="eco-stat-icon-bubble bg-blue-bubble">
            <Bell size={20} className="text-blue-icon" />
          </div>
          <div className="eco-stat-details">
            <span className="eco-stat-label">Total Dispatched</span>
            <div className="eco-stat-number">{totalCount}</div>
            <span className="eco-stat-trend text-blue-icon">Delivered Alerts</span>
          </div>
        </div>

        <div className="eco-stat-card eco-stat-orange">
          <div className="eco-stat-icon-bubble bg-orange-bubble">
            <AlertTriangle size={20} className="text-orange-icon" />
          </div>
          <div className="eco-stat-details">
            <span className="eco-stat-label">Urgent Alerts</span>
            <div className="eco-stat-number">{alertCount}</div>
            <span className="eco-stat-trend text-orange-icon">High Priority</span>
          </div>
        </div>

        <div className="eco-stat-card eco-stat-green">
          <div className="eco-stat-icon-bubble bg-green-bubble">
            <Calendar size={20} className="text-green-icon" />
          </div>
          <div className="eco-stat-details">
            <span className="eco-stat-label">Event Reminders</span>
            <div className="eco-stat-number">{eventReminderCount}</div>
            <span className="eco-stat-trend text-trend-green">Drive Notices</span>
          </div>
        </div>

        <div className="eco-stat-card eco-stat-purple">
          <div className="eco-stat-icon-bubble bg-purple-bubble">
            <Smartphone size={20} className="text-purple-icon" />
          </div>
          <div className="eco-stat-details">
            <span className="eco-stat-label">Push &amp; Broadcast</span>
            <div className="eco-stat-number">{broadcastCount}</div>
            <span className="eco-stat-trend text-purple-icon">Multi-Channel</span>
          </div>
        </div>
      </section>

      {/* 5. Two-Column Layout: Left Compose Form & Right History */}
      <div className="eco-notifications-layout">
        <div className="eco-compose-card">
          <div className="eco-card-header-bar">
            <h3 className="eco-card-header-title">
              <Send size={18} className="text-emerald-700" />
              <span>Compose Broadcast / In-App Alert</span>
            </h3>
          </div>

          <form onSubmit={handleSendNotification} className="eco-card-body-padded">
            <div className="eco-form-field">
              <label className="eco-field-label">Notification Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g. Drive Reminder: Assembly at Pushkar Ghat"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="eco-field-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="eco-form-field">
                <label className="eco-field-label">Category</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="eco-field-select"
                >
                  <option value="General Announcement">General Announcement</option>
                  <option value="Event Reminder">Event Reminder</option>
                  <option value="Meeting Notice">Meeting Notice</option>
                  <option value="Alert">Urgent River Alert</option>
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
                  <option value="Active Volunteers">Active Volunteers</option>
                </select>
              </div>
            </div>

            <div className="eco-form-field">
              <label className="eco-field-label">Delivery Channel</label>
              <select
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                className="eco-field-select"
              >
                <option value="In-App">In-App Notification Feed</option>
                <option value="Push Notification">Mobile Push Notification (Firebase)</option>
                <option value="Broadcast">All Broadcast Channels</option>
              </select>
            </div>

            <div className="eco-form-field">
              <label className="eco-field-label">Message Text *</label>
              <textarea
                rows="4"
                required
                placeholder="Type your alert or reminder text here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="eco-field-textarea"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="eco-cms-btn-primary w-full justify-center mt-2"
            >
              <Send size={15} />
              <span>{submitting ? 'Dispatching...' : 'Dispatch Notification'}</span>
            </button>
          </form>
        </div>

        <div className="eco-history-card">
          <div className="eco-card-header-bar">
            <h3 className="eco-card-header-title">
              <Clock size={18} className="text-emerald-700" />
              <span>Dispatched Notifications History</span>
            </h3>
            <span className="eco-id-tag">{notifications.length} Sent</span>
          </div>

          <div className="p-3 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-2 items-center">
            <div className="eco-search-bar flex-1" style={{ maxWidth: 'none', padding: '0.4rem 0.75rem' }}>
              <Search size={14} className="eco-search-icon" />
              <input
                type="text"
                placeholder="Search history..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="eco-search-input text-xs"
              />
              {historySearch && (
                <button
                  type="button"
                  onClick={() => setHistorySearch('')}
                  className="eco-search-clear-btn"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="eco-filter-select text-xs"
              style={{ padding: '0.4rem 1.6rem 0.4rem 0.6rem' }}
            >
              <option value="All">All Types</option>
              <option value="General Announcement">General</option>
              <option value="Event Reminder">Reminders</option>
              <option value="Meeting Notice">Meetings</option>
              <option value="Alert">Alerts</option>
            </select>
          </div>

          <div className="eco-history-list">
            {loading ? (
              <div className="p-8 text-center text-muted">
                <RefreshCw size={24} className="animate-spin inline mb-2 text-emerald-700" />
                <p className="font-semibold text-slate-700 text-sm">Loading dispatch log...</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="p-8 text-center text-muted">
                <Bell size={32} className="mx-auto mb-2 opacity-40 text-slate-500" />
                <p className="font-semibold text-sm text-slate-700">No notifications found.</p>
                <span className="text-xs text-slate-500">
                  {notifications.length === 0
                    ? 'Use the compose form to dispatch your first alert.'
                    : 'Try adjusting your search criteria.'}
                </span>
              </div>
            ) : (
              filteredHistory.map((n) => {
                const createdDate = new Date(n.createdAt);
                return (
                  <div key={n._id} className="eco-history-item">
                    <div className="eco-history-top">
                      <h4 className="eco-history-title">{n.title}</h4>
                      <span className={`eco-tier-pill ${getCategoryBadgeClass(n.type)}`}>
                        {n.type === 'Alert' && <AlertTriangle size={11} />}
                        {n.type}
                      </span>
                    </div>

                    <p className="eco-history-msg">{n.message}</p>

                    <div className="eco-history-meta">
                      <span className="eco-meta-chip">
                        <Users size={12} /> {n.targetAudience}
                      </span>
                      <span className="eco-meta-chip">
                        <Radio size={12} /> {n.channel}
                      </span>
                      <span className="eco-meta-chip">
                        <Calendar size={12} />
                        {createdDate.toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="eco-meta-chip text-slate-500">
                        <Clock size={12} />
                        {createdDate.toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
