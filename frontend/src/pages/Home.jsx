import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
  Droplet,
  Users,
  Calendar,
  ArrowRight,
  MapPin,
  Trash2,
  TreeDeciduous,
  CheckCircle,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';

const Home = () => {
  const [content, setContent] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [contentRes, eventsRes, announcementsRes] = await Promise.all([
          API.get('/public/content'),
          API.get('/public/events'),
          API.get('/public/announcements'),
        ]);

        setContent(contentRes.data);
        setEvents(eventsRes.data ? eventsRes.data.slice(0, 3) : []);
        setAnnouncements(announcementsRes.data ? announcementsRes.data.slice(0, 3) : []);
      } catch (err) {
        console.error('Failed to load public website content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const stats = content?.statistics || {
    cleanlinessDrives: 148,
    volunteersActive: 1280,
    wasteRemovedTons: 92,
    ghatsCleaned: 22,
    treesPlanted: 4200,
  };

  return (
    <div className="home-container">
      {/* Refined Minimalist Hero */}
      <section className="clean-hero-section">
        <div className="container hero-layout">
          <div className="hero-text-col">
            <div className="hero-tag-pill">
              <span className="hero-tag-dot"></span>
              <span>Godavari River Cleanliness Initiative • Rajahmundry</span>
            </div>

            <h1 className="hero-main-heading">
              Preserving the Sacred Purity of <span className="highlight-text">River Godavari</span>
            </h1>

            <p className="hero-description">
              Godhavari Nadhi Paryavarana Parishubratha is a community-driven NGO organizing
              routine ghat cleanliness drives, intercepting plastic waste, and protecting the
              environmental sanctity of the Godavari river basin.
            </p>

            <div className="hero-cta-group">
              <Link to="/register" className="btn btn-primary btn-lg">
                Join as Volunteer <ArrowRight size={16} />
              </Link>
              <Link to="/activities" className="btn btn-outline btn-lg">
                Explore Cleanliness Drives
              </Link>
            </div>

            <div className="hero-social-proof">
              <div className="proof-avatars">
                <span className="proof-circle">1.2K+</span>
              </div>
              <span className="proof-text">
                Over <strong>1,280 active citizens & students</strong> participating across Rajahmundry ghats.
              </span>
            </div>
          </div>

          <div className="hero-visual-col">
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800"
                alt="Godavari River Cleanliness Drive"
                className="hero-main-img"
              />
              <div className="hero-floating-badge">
                <Droplet size={20} className="badge-icon" />
                <div>
                  <strong>Weekly Cleanups</strong>
                  <span>Kotilingala & Pushkar Ghats</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Impact Numbers Bar */}
      <section className="key-metrics-section">
        <div className="container">
          <div className="metrics-strip">
            <div className="metric-item">
              <span className="metric-num">{stats.cleanlinessDrives}+</span>
              <span className="metric-label">Cleanliness Drives Conducted</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-num">{stats.wasteRemovedTons} Tons</span>
              <span className="metric-label">Plastic & Waste Intercepted</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-num">{stats.volunteersActive}+</span>
              <span className="metric-label">Registered Active Volunteers</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-num">{stats.ghatsCleaned}</span>
              <span className="metric-label">River Ghats Regularly Maintained</span>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="section-title-wrap text-center">
            <span className="sub-tag">WHAT WE DO</span>
            <h2>Our Core Conservation Work</h2>
            <p className="section-lead">
              Structured initiatives ensuring measurable ecological protection for River Godavari.
            </p>
          </div>

          <div className="pillars-grid mt-4">
            <div className="clean-pillar-card">
              <div className="pillar-icon-box bg-blue-tint">
                <Droplet size={24} className="text-primary" />
              </div>
              <h3>Ghat Cleanliness Drives</h3>
              <p>
                Weekly field cleanups across pilgrim steps removing non-biodegradable plastics,
                nylon cloth, and floating debris to keep the riverbank sanitary.
              </p>
              <Link to="/activities" className="card-inline-link">
                View drive schedules <ArrowRight size={14} />
              </Link>
            </div>

            <div className="clean-pillar-card">
              <div className="pillar-icon-box bg-green-tint">
                <Trash2 size={24} className="text-green" />
              </div>
              <h3>Plastic Interception</h3>
              <p>
                Working with municipal authorities to distribute biodegradable alternatives to
                merchants and pilgrims, preventing plastic from reaching the water stream.
              </p>
              <Link to="/awareness" className="card-inline-link">
                Learn about campaigns <ArrowRight size={14} />
              </Link>
            </div>

            <div className="clean-pillar-card">
              <div className="pillar-icon-box bg-amber-tint">
                <Users size={24} className="text-amber" />
              </div>
              <h3>Community & Youth Action</h3>
              <p>
                Engaging thousands of local school students, boatmen, and citizens in regular awareness
                marches and environmental stewardship programs.
              </p>
              <Link to="/register" className="card-inline-link">
                Get involved today <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Cleanliness Drives Preview */}
      <section className="section-padding">
        <div className="container">
          <div className="section-title-flex">
            <div>
              <span className="sub-tag">FIELD ACTIONS</span>
              <h2>Upcoming Cleanliness Drives</h2>
            </div>
            <Link to="/activities" className="btn btn-outline btn-sm">
              View All Drives <ArrowRight size={14} />
            </Link>
          </div>

          <div className="drives-grid-clean mt-4">
            {events.map((evt) => (
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
                      <strong>{evt.enrolledVolunteersCount || 0}</strong> volunteers registered
                    </span>
                    <Link to="/register" className="btn btn-primary btn-sm">
                      Volunteer
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Circulars / Announcements */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="section-title-wrap text-center">
            <span className="sub-tag">ORGANIZATIONAL BULLETINS</span>
            <h2>Public Announcements & Advisories</h2>
          </div>

          <div className="announcements-clean-stack mt-4">
            {announcements.map((a) => (
              <div key={a._id} className="clean-announcement-card">
                <div className="announcement-card-header">
                  <span className={`badge ${a.priority === 'Urgent' ? 'badge-danger' : 'badge-green'}`}>
                    {a.priority}
                  </span>
                  <span className="badge badge-outline">{a.category}</span>
                  <span className="announcement-date">
                    {new Date(a.publishedAt || a.createdAt).toLocaleDateString('en-IN', {
                      dateStyle: 'medium',
                    })}
                  </span>
                </div>
                <h3 className="announcement-title">{a.title}</h3>
                <p className="announcement-desc">{a.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clean Call to Action */}
      <section className="clean-cta-section">
        <div className="container">
          <div className="cta-box-card">
            <div className="cta-text">
              <h2>Stand Together for Sacred River Godavari</h2>
              <p>
                Whether by offering your time on Sunday mornings, enrolling as an annual member, or
                supporting our river awareness campaigns, every hand counts.
              </p>
            </div>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Register as Member / Volunteer
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg">
                Contact Office
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
