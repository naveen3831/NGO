import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import {
  Calendar,
  CreditCard,
  Megaphone,
  Users,
  ShieldCheck,
  Clock,
  MapPin,
  ArrowRight,
  Zap,
  User,
} from 'lucide-react';

const MemberHome = () => {
  const { user, membership } = useAuth();
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [eventsRes, announcementsRes, meetingsRes] = await Promise.all([
          API.get('/member/events'),
          API.get('/member/announcements'),
          API.get('/member/meetings').catch(() => ({ data: [] })),
        ]);

        const eventsData = Array.isArray(eventsRes.data)
          ? eventsRes.data
          : Array.isArray(eventsRes.data?.events)
          ? eventsRes.data.events
          : [];
        setEvents(eventsData);

        const announcementsData = Array.isArray(announcementsRes.data)
          ? announcementsRes.data
          : Array.isArray(announcementsRes.data?.announcements)
          ? announcementsRes.data.announcements
          : [];
        setAnnouncements(announcementsData);

        const meetingsData = Array.isArray(meetingsRes.data) ? meetingsRes.data : [];
        setMeetings(meetingsData);
      } catch (err) {
        console.error('Error fetching member dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const isVolunteer = user?.role?.toLowerCase() === 'volunteer';
  const roleLabel = isVolunteer ? 'Volunteer' : 'Member';

  const upcomingEvents = events.slice(0, 3).map((evt, idx) => {
    const d = new Date(evt.date);
    return {
      id: evt._id || idx,
      day: String(d.getDate()).padStart(2, '0'),
      month: d.toLocaleString('default', { month: 'short' }),
      title: evt.title,
      time: evt.time || '07:00 AM',
      venue: evt.location?.venue || 'Kotilingala Ghat',
    };
  });

  return (
    <div className="eco-admin-dashboard-page">
      {/* 1. Scenic Welcome Banner matching Admin Dashboard */}
      <section className="eco-welcome-banner-card">
        <div className="eco-banner-text-side">
          <div className="eco-accent-pill-bar"></div>
          <h2 className="eco-welcome-headline">
            Welcome Back, {user?.name || roleLabel} 👋
          </h2>
          <p className="eco-welcome-subtext">
            View your {roleLabel.toLowerCase()} status, drives, meetings, announcements, and digital ID in read-only mode.
          </p>
        </div>
        <div className="eco-banner-scenic-overlay" aria-hidden="true"></div>
      </section>

      {/* 2. Four Pastel KPI Metric Cards matching Admin Dashboard */}
      <section className="eco-kpi-metric-strip">
        <div className="eco-stat-card eco-stat-green">
          <div className="eco-stat-icon-bubble bg-green-bubble">
            <ShieldCheck size={22} className="text-green-icon" />
          </div>
          <div className="eco-stat-details">
            <span className="eco-stat-label">Account Status</span>
            <div className="eco-stat-number">{membership?.status || 'Active'}</div>
            <span className="eco-stat-status-badge">
              <span className="status-green-dot"></span> {user?.memberId || 'Verified'}
            </span>
          </div>
        </div>

        <div className="eco-stat-card eco-stat-blue">
          <div className="eco-stat-icon-bubble bg-blue-bubble">
            <Calendar size={22} className="text-blue-icon" />
          </div>
          <div className="eco-stat-details">
            <span className="eco-stat-label">Drives &amp; Events</span>
            <div className="eco-stat-number">{events.length}</div>
            <span className="eco-stat-trend text-trend-green">Read-Only Schedule</span>
          </div>
        </div>

        <div className="eco-stat-card eco-stat-orange">
          <div className="eco-stat-icon-bubble bg-orange-bubble">
            <Megaphone size={22} className="text-orange-icon" />
          </div>
          <div className="eco-stat-details">
            <span className="eco-stat-label">Announcements</span>
            <div className="eco-stat-number">{announcements.length}</div>
            <span className="eco-stat-trend text-trend-green">Latest Updates</span>
          </div>
        </div>

        <div className="eco-stat-card eco-stat-purple">
          <div className="eco-stat-icon-bubble bg-purple-bubble">
            <Users size={22} className="text-purple-icon" />
          </div>
          <div className="eco-stat-details">
            <span className="eco-stat-label">Meetings</span>
            <div className="eco-stat-number">{meetings.length}</div>
            <span className="eco-stat-trend text-trend-green">
              {membership?.membershipType || roleLabel}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Read-Only Quick Navigation Bar matching Admin Dashboard */}
      <section className="eco-quick-actions-section">
        <div className="eco-section-heading-row">
          <Zap size={18} className="text-emerald-icon" />
          <h3 className="eco-section-title">Quick Navigation (Read-Only)</h3>
        </div>

        <div className="eco-quick-actions-grid">
          <Link to="/member/drives" className="eco-quick-action-tile">
            <Calendar size={22} className="tile-icon" />
            <span className="tile-text">Drives &amp; Events</span>
          </Link>

          <Link to="/member/meetings" className="eco-quick-action-tile">
            <Users size={22} className="tile-icon" />
            <span className="tile-text">Meetings</span>
          </Link>

          <Link to="/member/announcements" className="eco-quick-action-tile">
            <Megaphone size={22} className="tile-icon" />
            <span className="tile-text">Announcements</span>
          </Link>

          <Link to="/member/card" className="eco-quick-action-tile">
            <CreditCard size={22} className="tile-icon" />
            <span className="tile-text">Digital ID Card</span>
          </Link>

          <Link to="/member/profile" className="eco-quick-action-tile">
            <User size={22} className="tile-icon" />
            <span className="tile-text">My Profile</span>
          </Link>
        </div>
      </section>

      {/* 4. Middle Two-Column Grid matching Admin Dashboard */}
      <section className="eco-mid-dashboard-grid">
        {/* Left Column: Latest Announcements */}
        <div className="eco-card eco-events-card">
          <div className="eco-card-header">
            <div className="eco-card-title-lockup">
              <Megaphone size={18} className="text-emerald-icon" />
              <h3>Latest Announcements</h3>
            </div>
            <Link to="/member/announcements" className="eco-card-view-all-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="eco-card-body eco-events-list">
            {loading ? (
              <p className="text-sm text-slate-500">Loading announcements...</p>
            ) : announcements.length === 0 ? (
              <p className="text-sm text-slate-500">No announcements posted yet.</p>
            ) : (
              announcements.slice(0, 3).map((ann) => {
                const d = new Date(ann.publishedAt || ann.createdAt || Date.now());
                return (
                  <div key={ann._id} className="eco-event-card-item">
                    <div className="eco-event-date-badge">
                      <span className="date-badge-day">{String(d.getDate()).padStart(2, '0')}</span>
                      <span className="date-badge-month">{d.toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className="eco-event-info">
                      <h4 className="eco-event-heading">{ann.title}</h4>
                      <div className="eco-event-meta-line">
                        <span className="meta-item">{ann.category || 'Official Notice'}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Drives & Events */}
        <div className="eco-card eco-events-card">
          <div className="eco-card-header">
            <div className="eco-card-title-lockup">
              <Calendar size={18} className="text-emerald-icon" />
              <h3>Upcoming Drives &amp; Events</h3>
            </div>
            <Link to="/member/drives" className="eco-card-view-all-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="eco-card-body eco-events-list">
            {loading ? (
              <p className="text-sm text-slate-500">Loading drives...</p>
            ) : upcomingEvents.length === 0 ? (
              <p className="text-sm text-slate-500">No upcoming drives scheduled.</p>
            ) : (
              upcomingEvents.map((evt) => (
                <div key={evt.id} className="eco-event-card-item">
                  <div className="eco-event-date-badge">
                    <span className="date-badge-day">{evt.day}</span>
                    <span className="date-badge-month">{evt.month}</span>
                  </div>
                  <div className="eco-event-info">
                    <h4 className="eco-event-heading">{evt.title}</h4>
                    <div className="eco-event-meta-line">
                      <span className="meta-item">
                        <Clock size={13} className="meta-icon" /> {evt.time}
                      </span>
                      <span className="meta-item">
                        <MapPin size={13} className="meta-icon" /> {evt.venue}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MemberHome;
