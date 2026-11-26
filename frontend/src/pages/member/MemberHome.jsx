import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import {
  Calendar,
  CreditCard,
  Bell,
  Clock,
  ArrowRight,
  MapPin,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const MemberHome = () => {
  const { user, membership } = useAuth();
  const [nextEvent, setNextEvent] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [volunteerStatus, setVolunteerStatus] = useState(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const [eventsRes, announcementsRes] = await Promise.all([
          API.get('/member/events'),
          API.get('/member/announcements'),
        ]);

        const eventsData = Array.isArray(eventsRes.data) ? eventsRes.data : Array.isArray(eventsRes.data?.events) ? eventsRes.data.events : [];
        if (eventsData.length > 0) {
          setNextEvent(eventsData[0]);
          setVolunteerStatus(eventsData[0].myVolunteerStatus || null);
        }
        const announcementsData = Array.isArray(announcementsRes.data) ? announcementsRes.data : Array.isArray(announcementsRes.data?.announcements) ? announcementsRes.data.announcements : [];
        setAnnouncements(announcementsData.slice(0, 3));
      } catch (err) {
        console.error('Error fetching member home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, []);

  const handleEnroll = async () => {
    if (!nextEvent || volunteerStatus) return;
    try {
      const { data } = await API.post(`/member/events/${nextEvent._id}/enroll`);
      setVolunteerStatus(data?.status || 'Pending');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to submit volunteer request.');
    }
  };

  return (
    <div className="member-screen member-home">
      {/* Welcome Card */}
      <div className="member-welcome-card">
        <div className="member-greeting">
          <h2>Namaste, {user?.name || 'Member'}</h2>
          <p className="welcome-tagline">
            Thank you for being a vital guardian of River Godavari.
          </p>
        </div>
        <div className="member-quick-stats">
          <div className="quick-stat-box">
            <span className="stat-num">{membership?.status || 'Active'}</span>
            <span className="stat-name">Membership</span>
          </div>
          <div className="quick-stat-box">
            <span className="stat-num">{user?.role === 'volunteer' ? 'Volunteer' : 'Member'}</span>
            <span className="stat-name">Cadre</span>
          </div>
        </div>
      </div>

      {/* Digital ID Card Teaser */}
      <div className="app-card digital-id-teaser">
        <div className="teaser-content">
          <div className="teaser-left">
            <CreditCard size={28} className="text-primary" />
            <div>
              <h4>Official Digital Membership Card</h4>
              <p>ID: {user?.memberId || 'GNPP-2026-MEMBER'}</p>
            </div>
          </div>
          <Link to="/member/card" className="btn btn-sm btn-primary">
            View Card
          </Link>
        </div>
      </div>

      {/* Next Upcoming Cleanliness Drive */}
      <div className="app-section">
        <div className="app-section-header">
          <h3>Upcoming Cleanliness Drive</h3>
          <Link to="/member/drives" className="section-link">
            All Drives <ArrowRight size={14} />
          </Link>
        </div>

        {nextEvent ? (
          <div className="app-card event-highlight-card">
            <div className="event-highlight-tag">{nextEvent.eventType}</div>
            <h4 className="event-highlight-title">{nextEvent.title}</h4>
            <div className="event-highlight-meta">
              <span>🗓️ {new Date(nextEvent.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
              <span>⏰ {nextEvent.time}</span>
              <span><MapPin size={13} className="inline mr-1" /> {nextEvent.location?.venue}</span>
            </div>
            <p className="event-highlight-desc">{nextEvent.description}</p>
            <div className="event-highlight-footer">
              <span className="text-muted text-xs">
                {nextEvent.enrolledVolunteersCount || 0} fellow members enrolled
              </span>
              <button
                onClick={handleEnroll}
                disabled={!!volunteerStatus}
                className={`btn btn-sm ${volunteerStatus ? 'btn-outline' : 'btn-primary'}`}
                style={
                  volunteerStatus === 'Confirmed'
                    ? { background: '#dcfce7', color: '#064e3b', borderColor: '#86efac' }
                    : volunteerStatus === 'Pending'
                    ? { background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }
                    : undefined
                }
              >
                {volunteerStatus === 'Confirmed' ? (
                  <>
                    <CheckCircle size={14} /> Confirmed as Volunteer
                  </>
                ) : volunteerStatus === 'Pending' ? (
                  <>
                    <Clock size={14} /> Pending Admin Approval
                  </>
                ) : volunteerStatus === 'Rejected' ? (
                  'Request Declined'
                ) : (
                  'Join as Volunteer'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="app-card text-center p-3 text-muted">
            No upcoming drives scheduled right now.
          </div>
        )}
      </div>

      {/* Announcements Feed */}
      <div className="app-section mt-4">
        <div className="app-section-header">
          <h3>Organizational Updates</h3>
          <Link to="/member/announcements" className="section-link">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="app-announcements-list">
          {announcements.map((a) => (
            <div key={a._id} className="app-announcement-card">
              <div className="announcement-meta-top">
                <span className={`badge badge-xs ${a.priority === 'Urgent' ? 'badge-danger' : 'badge-outline'}`}>
                  {a.priority}
                </span>
                <span className="text-xs text-muted">{a.category}</span>
              </div>
              <h5 className="announcement-title-sm">{a.title}</h5>
              <p className="announcement-excerpt-sm">{a.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberHome;

