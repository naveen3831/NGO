import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await API.get('/public/events');
        setEvents(data || []);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="clean-page-wrapper">
      <div className="clean-page-header">
        <div className="container">
          <span className="clean-badge">SCHEDULE</span>
          <h1>Events & Meetings Calendar</h1>
          <p className="clean-page-sub">
            Public schedules for community cleanliness drives, riverfront marches, and general
            gatherings.
          </p>
        </div>
      </div>

      <div className="container section-padding">
        {loading ? (
          <div className="text-center py-5">Loading calendar...</div>
        ) : events.length === 0 ? (
          <div className="empty-state-box">
            <Calendar size={36} className="text-muted mb-2" />
            <h3>No public events scheduled</h3>
          </div>
        ) : (
          <div className="clean-timeline-stack">
            {events.map((evt) => (
              <div key={evt._id} className="clean-timeline-card">
                <div className="clean-date-block">
                  <span className="clean-date-month">
                    {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="clean-date-day">{new Date(evt.date).getDate()}</span>
                  <span className="clean-date-year">{new Date(evt.date).getFullYear()}</span>
                </div>

                <div className="clean-timeline-info">
                  <div className="clean-timeline-meta">
                    <span className="badge badge-green">{evt.eventType}</span>
                    <span className="meta-time">
                      <Clock size={13} className="inline mr-1" />
                      {evt.time}
                    </span>
                  </div>
                  <h3 className="clean-timeline-title">{evt.title}</h3>
                  <p className="clean-timeline-desc">{evt.description}</p>
                  <div className="clean-timeline-location">
                    <MapPin size={14} className="text-muted" />
                    <span>{evt.location?.venue}</span>
                  </div>
                </div>

                <div className="clean-timeline-cta">
                  <Link to="/register" className="btn btn-outline btn-sm">
                    Participate
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
