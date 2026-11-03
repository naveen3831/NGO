import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Calendar, Clock, MapPin, Users, Droplet, ArrowRight } from 'lucide-react';

const Activities = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await API.get('/public/events');
        setEvents(data || []);
      } catch (err) {
        console.error('Failed to load activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const categories = ['All', 'Cleanliness Drive', 'Awareness Program', 'Workshop', 'Tree Plantation'];

  const filteredEvents =
    filterType === 'All'
      ? events
      : events.filter((e) => e.eventType.toLowerCase() === filterType.toLowerCase());

  return (
    <div className="clean-page-wrapper">
      <div className="clean-page-header">
        <div className="container">
          <span className="clean-badge">ON-GROUND INITIATIVES</span>
          <h1>Cleanliness Drives & Activities</h1>
          <p className="clean-page-sub">
            Join hands in regular riverfront cleanups, ghat desiltation, and community environmental
            actions across Rajahmundry.
          </p>
        </div>
      </div>

      <div className="container section-padding">
        {/* Simple Filter Strip */}
        <div className="clean-filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`filter-tab-btn ${filterType === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Drives Grid */}
        {loading ? (
          <div className="text-center py-5">Loading scheduled activities...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state-box">
            <Droplet size={36} className="text-muted mb-2" />
            <h3>No scheduled activities found in this category</h3>
            <p className="text-muted">New drives are posted every week. Join as a volunteer to receive alerts.</p>
          </div>
        ) : (
          <div className="drives-grid-clean mt-4">
            {filteredEvents.map((evt) => (
              <div key={evt._id} className="clean-drive-card">
                <div className="drive-card-img-wrap">
                  <img
                    src={evt.bannerImage || 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600'}
                    alt={evt.title}
                  />
                  <span className="drive-badge-type">{evt.eventType}</span>
                </div>
                <div className="drive-card-body">
                  <div className="drive-date-pill">
                    <Calendar size={13} />
                    <span>{new Date(evt.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                    <span className="dot-sep">•</span>
                    <Clock size={13} />
                    <span>{evt.time}</span>
                  </div>
                  <h3 className="drive-title">{evt.title}</h3>
                  <p className="drive-desc-snippet">{evt.description}</p>
                  <div className="drive-venue-text">
                    <MapPin size={14} className="text-muted" />
                    <span>{evt.location?.venue}</span>
                  </div>
                  <div className="drive-footer-flex">
                    <span className="vol-status-text">
                      <strong>{evt.enrolledVolunteersCount || 0}</strong> / {evt.targetVolunteers} volunteers
                    </span>
                    <Link to="/register" className="btn btn-primary btn-sm">
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
