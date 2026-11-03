import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Clock, Calendar, MapPin, Video, CheckCircle } from 'lucide-react';

const MemberMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const { data } = await API.get('/member/meetings');
        setMeetings(data || []);
      } catch (err) {
        console.error('Error fetching member meetings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div className="member-screen member-meetings-screen">
      <div className="screen-header">
        <h2>Organizational Meetings</h2>
        <p className="text-muted text-sm">
          Executive committee sessions, volunteer strategy meetings, and annual general assemblies.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading meetings...</div>
      ) : meetings.length === 0 ? (
        <div className="app-card text-center p-4">No meetings currently scheduled.</div>
      ) : (
        <div className="meetings-stack">
          {meetings.map((m) => (
            <div key={m._id} className="app-card meeting-card">
              <div className="meeting-type-tag">
                <span className="badge badge-amber">{m.meetingType}</span>
                <span className="badge badge-outline">{m.targetAudience}</span>
              </div>

              <h3 className="meeting-title">{m.title}</h3>

              <div className="meeting-details-box">
                <div className="detail-item">
                  <Calendar size={14} className="text-muted" />
                  <span>{new Date(m.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                </div>
                <div className="detail-item">
                  <Clock size={14} className="text-muted" />
                  <span>{m.time}</span>
                </div>
                <div className="detail-item">
                  {m.isVirtual ? <Video size={14} className="text-muted" /> : <MapPin size={14} className="text-muted" />}
                  <span>{m.location}</span>
                </div>
              </div>

              <div className="agenda-box">
                <strong>Discussion Agenda:</strong>
                <p>{m.agenda}</p>
              </div>

              {m.isVirtual && m.meetingLink && (
                <div className="meeting-action">
                  <a
                    href={m.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm btn-block"
                  >
                    Join Video Conference
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberMeetings;

