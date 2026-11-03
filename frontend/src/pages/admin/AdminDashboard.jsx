import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  Users,
  Calendar,
  Clock,
  Megaphone,
  Bell,
  CheckCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data);
      } catch (err) {
        setError('Failed to fetch dashboard statistics from backend server');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading administrative metrics...</div>;
  }

  if (error) {
    return <div className="admin-alert-error">{error}</div>;
  }

  const counts = stats?.counts || {};

  return (
    <div className="admin-dashboard-view">
      {/* Welcome Banner */}
      <div className="admin-welcome-banner">
        <div>
          <h2>Organizational Control Center</h2>
          <p>
            Real-time management of members, ghat cleanliness drives, meetings, and notifications
            for Godhavari Nadhi Paryavarana Parishubratha.
          </p>
        </div>
        <div className="quick-action-buttons">
          <Link to="/admin/members" className="btn btn-primary btn-sm">
            <PlusCircle size={13} /> Add Member
          </Link>
          <Link to="/admin/events" className="btn btn-outline btn-sm">
            <Calendar size={13} /> New Cleanliness Drive
          </Link>
          <Link to="/admin/notifications" className="btn btn-secondary btn-sm">
            <Bell size={13} /> Send Alert
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-metric-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Registered Members</span>
            <div className="metric-icon-wrap bg-blue-light">
              <Users size={15} className="text-blue" />
            </div>
          </div>
          <div className="metric-value">{counts.totalMembers || 0}</div>
          <div className="metric-footer">
            <span className="text-success font-medium">
              {counts.activeMembers || 0} Active Memberships
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Drives & Events</span>
            <div className="metric-icon-wrap bg-green-light">
              <Calendar size={15} className="text-green" />
            </div>
          </div>
          <div className="metric-value">{counts.totalEvents || 0}</div>
          <div className="metric-footer">
            <span className="text-primary font-medium">
              {counts.upcomingEvents || 0} Scheduled Ahead
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Meetings Organized</span>
            <div className="metric-icon-wrap bg-amber-light">
              <Clock size={15} className="text-amber" />
            </div>
          </div>
          <div className="metric-value">{counts.totalMeetings || 0}</div>
          <div className="metric-footer">
            <span>{counts.scheduledMeetings || 0} Active Sessions</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Announcements & Circulars</span>
            <div className="metric-icon-wrap bg-purple-light">
              <Megaphone size={15} className="text-purple" />
            </div>
          </div>
          <div className="metric-value">{counts.totalAnnouncements || 0}</div>
          <div className="metric-footer">
            <span>{counts.totalNotifications || 0} Broadcasts Dispatched</span>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="admin-grid-two">
        {/* Left: Upcoming Cleanliness Drives */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Upcoming Cleanliness Drives & Programs</h3>
            <Link to="/admin/events" className="card-header-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="admin-card-body">
            {stats?.upcomingEventsList?.length > 0 ? (
              <div className="admin-event-list">
                {stats.upcomingEventsList.map((evt) => (
                  <div key={evt._id} className="admin-event-row">
                    <div className="event-date-box">
                      <span className="date-month">
                        {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="date-day">{new Date(evt.date).getDate()}</span>
                    </div>
                    <div className="event-info">
                      <h4 className="event-title">{evt.title}</h4>
                      <div className="event-meta">
                        <span>📍 {evt.location?.venue || 'Kotilingala Ghat'}</span>
                        <span className="meta-sep">•</span>
                        <span>⏰ {evt.time}</span>
                        <span className="meta-sep">•</span>
                        <span className="badge badge-sm badge-green">{evt.eventType}</span>
                      </div>
                    </div>
                    <div className="event-stats">
                      <span className="vol-count font-semibold">
                        {evt.enrolledVolunteersCount || 0}
                      </span>
                      <span className="vol-label">Volunteers</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state-text">No upcoming events scheduled.</p>
            )}
          </div>
        </div>

        {/* Right: Recent Members Table */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Recently Enrolled Members</h3>
            <Link to="/admin/members" className="card-header-link">
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          <div className="admin-card-body">
            {stats?.recentMembers?.length > 0 ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Member ID</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentMembers.map((member) => (
                      <tr key={member._id}>
                        <td>
                          <div className="member-name-cell">
                            <strong>{member.name}</strong>
                            <small className="text-muted">{member.email}</small>
                          </div>
                        </td>
                        <td>
                          <code className="member-id-pill">{member.memberId || 'PENDING'}</code>
                        </td>
                        <td>
                          <span className="badge badge-sm badge-blue">{member.role}</span>
                        </td>
                        <td>
                          <span className="status-badge active">
                            <CheckCircle size={12} /> Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-state-text">No member records found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

