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
      await API.post(`/member/events/${id}/enroll`);
      setEnrolledMap((prev) => ({ ...prev, [id]: true }));
    } catch (err) {
      alert('You are already registered for this drive.');
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
            const isEnrolled = enrolledMap[evt._id];
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
                    disabled={isEnrolled}
                    className={`btn btn-sm btn-block ${isEnrolled ? 'btn-outline' : 'btn-primary'}`}
                  >
                    {isEnrolled ? (
                      <>
                        <CheckCircle size={14} /> Registered for Drive
                      </>
                    ) : (
                      'Participate as Volunteer'
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

