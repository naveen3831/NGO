import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Calendar, Clock, MapPin, Users, CheckCircle, Shield } from 'lucide-react';

const MemberDrives = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolledMap, setEnrolledMap] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await API.get('/member/events');
        setEvents(data || []);
      } catch (err) {
        console.error('Failed to load member events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEnroll = async (id) => {
    try {
      const { data } = await API.post(`/member/events/${id}/enroll`);
      setEnrolledMap((prev) => ({ ...prev, [id]: data?.status || 'Pending' }));
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to submit volunteer request.');
    }
  };

  return (
    <div className="member-screen member-drives-screen">
      <div className="screen-header">
        <h2>Cleanliness Drives & Activities</h2>
        <p className="text-muted text-sm">
          Active field drives across Godavari River ghats, bank cleanups, and community awareness.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading scheduled drives...</div>
      ) : events.length === 0 ? (
        <div className="app-card text-center p-4">No active drives found.</div>
      ) : (
        <div className="drives-stack">
          {events.map((evt) => {
            const reqStatus = enrolledMap[evt._id] || evt.myVolunteerStatus;
            return (
              <div key={evt._id} className="app-card drive-card">
                <div className="drive-card-header">
                  <span className="badge badge-green">{evt.eventType}</span>
                  {evt.isMemberOnly && (
                    <span className="badge badge-amber flex items-center gap-1">
                      <Shield size={11} /> Exclusive
                    </span>
                  )}
                </div>

                <h3 className="drive-title">{evt.title}</h3>
                <p className="drive-desc">{evt.description}</p>

                <div className="drive-details-list">
                  <div className="detail-line">
                    <Calendar size={14} className="text-muted" />
                    <span>{new Date(evt.date).toLocaleDateString('en-IN', { dateStyle: 'full' })}</span>
                  </div>
                  <div className="detail-line">
                    <Clock size={14} className="text-muted" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="detail-line">
                    <MapPin size={14} className="text-muted" />
                    <span>{evt.location?.venue}</span>
                  </div>
                  <div className="detail-line">
                    <Users size={14} className="text-muted" />
                    <span>{evt.enrolledVolunteersCount || 0} registered volunteers</span>
                  </div>
                </div>

                <div className="drive-footer">
                  <button
                    onClick={() => handleEnroll(evt._id)}
                    disabled={!!reqStatus}
                    className={`btn btn-sm btn-block ${reqStatus ? 'btn-outline' : 'btn-primary'}`}
                    style={
                      reqStatus === 'Confirmed'
                        ? { background: '#dcfce7', color: '#064e3b', borderColor: '#86efac' }
                        : reqStatus === 'Pending'
                        ? { background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }
                        : undefined
                    }
                  >
                    {reqStatus === 'Confirmed' ? (
                      <>
                        <CheckCircle size={14} /> Confirmed as Volunteer
                      </>
                    ) : reqStatus === 'Pending' ? (
                      <>
                        <Clock size={14} /> Pending Admin Approval
                      </>
                    ) : reqStatus === 'Rejected' ? (
                      'Request Declined'
                    ) : (
                      'Join as Volunteer'
                    )}
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

export default MemberDrives;

