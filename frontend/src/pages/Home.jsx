import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
  Users,
  Sprout,
  Recycle,
  Leaf,
  Waves,
  Brush,
  ChevronRight,
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Megaphone,
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
    cleanlinessDrives: 142,
    volunteersActive: 1250,
    wasteRemovedTons: 85,
    ghatsCleaned: 18,
    treesPlanted: 3500,
  };

  return (
    <div className="eco-home-wrapper">
      {/* 1. HERO SECTION - Exact Match to Design Image */}
      <section className="eco-hero-section">
        <div className="eco-hero-bg-scenery"></div>
        <div className="eco-hero-scrim"></div>

        <div className="container eco-hero-content">
          <div className="eco-hero-text-block">
            {/* Small green horizontal bar accent */}
            <div className="eco-green-accent-bar mb-4"></div>

            <h1 className="eco-hero-title">
              Working Together for a<br />
              Cleaner & Greener{' '}
              <span className="text-highlight-green">Godhavari</span>
            </h1>

            <p className="eco-hero-subtitle">
              A People's Initiative for a Clean, Green and Healthy Godhavari
            </p>

            <div className="eco-hero-btn-group">
              <Link to="/activities" className="btn-hero-primary-pill">
                <span>Our Activities</span>
                <ChevronRight size={18} />
              </Link>
              <Link to="/register" className="btn-hero-secondary-pill">
                Become a Member
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING QUICK FEATURE STRIP - 4 Pillars */}
      <section className="eco-feature-strip-section">
        <div className="container">
          <div className="eco-feature-strip-card">
            {/* Item 1 */}
            <div className="eco-feature-item">
              <div className="eco-feature-icon-circle">
                <Users size={22} className="text-emerald-700" />
              </div>
              <div className="eco-feature-text">
                <h4 className="eco-feature-title">Public Awareness</h4>
                <p className="eco-feature-desc">
                  Educating communities for a cleaner environment
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="eco-feature-item">
              <div className="eco-feature-icon-circle">
                <Sprout size={22} className="text-emerald-700" />
              </div>
              <div className="eco-feature-text">
                <h4 className="eco-feature-title">Cleanliness Drives</h4>
                <p className="eco-feature-desc">
                  Regular clean-up activities along Godhavari
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="eco-feature-item">
              <div className="eco-feature-icon-circle">
                <Recycle size={22} className="text-emerald-700" />
              </div>
              <div className="eco-feature-text">
                <h4 className="eco-feature-title">Community Activities</h4>
                <p className="eco-feature-desc">
                  Engaging people for environmental protection
                </p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="eco-feature-item">
              <div className="eco-feature-icon-circle">
                <Leaf size={22} className="text-emerald-700" />
              </div>
              <div className="eco-feature-text">
                <h4 className="eco-feature-title">Environmental Care</h4>
                <p className="eco-feature-desc">
                  Preserving the Godhavari ecosystem for future generations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR FOCUS AREAS SECTION - Exact 4 Cards in Row */}
      <section className="eco-focus-section">
        <div className="container">
          <div className="eco-section-header">
            <div>
              <div className="eco-green-accent-bar mb-2"></div>
              <h2 className="eco-section-title">Our Focus Areas</h2>
            </div>
            <Link to="/activities" className="eco-view-all-link">
              <span>View All Activities</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="eco-focus-grid">
            {/* Card 1: Cleanliness Drives */}
            <div className="eco-focus-card">
              <div className="eco-focus-image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80"
                  alt="Cleanliness Drives along Godavari river"
                  className="eco-focus-img"
                  loading="lazy"
                />
              </div>
              <div className="eco-focus-content">
                <div className="eco-focus-icon-circle">
                  <Brush size={20} className="text-emerald-700" />
                </div>
                <div className="eco-focus-body">
                  <h3 className="eco-focus-heading">Cleanliness Drives</h3>
                  <p className="eco-focus-paragraph">
                    River and community clean-up efforts
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Awareness Programs */}
            <div className="eco-focus-card">
              <div className="eco-focus-image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80"
                  alt="Environmental Awareness Programs"
                  className="eco-focus-img"
                  loading="lazy"
                />
              </div>
              <div className="eco-focus-content">
                <div className="eco-focus-icon-circle">
                  <Users size={20} className="text-emerald-700" />
                </div>
                <div className="eco-focus-body">
                  <h3 className="eco-focus-heading">Awareness Programs</h3>
                  <p className="eco-focus-paragraph">
                    Environmental education and public awareness
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Tree Plantation */}
            <div className="eco-focus-card">
              <div className="eco-focus-image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80"
                  alt="Tree Plantation along Godavari riverbanks"
                  className="eco-focus-img"
                  loading="lazy"
                />
              </div>
              <div className="eco-focus-content">
                <div className="eco-focus-icon-circle">
                  <Leaf size={20} className="text-emerald-700" />
                </div>
                <div className="eco-focus-body">
                  <h3 className="eco-focus-heading">Tree Plantation</h3>
                  <p className="eco-focus-paragraph">
                    Increasing green cover along the river
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: River Conservation */}
            <div className="eco-focus-card">
              <div className="eco-focus-image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80"
                  alt="River Conservation in Godavari basin"
                  className="eco-focus-img"
                  loading="lazy"
                />
              </div>
              <div className="eco-focus-content">
                <div className="eco-focus-icon-circle">
                  <Waves size={20} className="text-emerald-700" />
                </div>
                <div className="eco-focus-body">
                  <h3 className="eco-focus-heading">River Conservation</h3>
                  <p className="eco-focus-paragraph">
                    Protecting and preserving the Godhavari ecosystem
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UPCOMING DRIVES & EVENTS SECTION (MongoDB Connected) */}
      <section className="eco-events-section py-12 bg-slate-50">
        <div className="container">
          <div className="eco-section-header">
            <div>
              <div className="eco-green-accent-bar mb-2"></div>
              <h2 className="eco-section-title">Upcoming Cleanliness Drives & Events</h2>
              <p className="text-sm text-muted">Join hands with citizens and volunteers at Rajahmundry riverfront.</p>
            </div>
            <Link to="/events" className="eco-view-all-link">
              <span>View All Events</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-3 gap-6">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event._id} className="eco-event-card">
                  <div className="eco-event-header">
                    <span className="eco-badge-event">{event.eventType}</span>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Calendar size={13} className="text-emerald-600" />
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="eco-event-title">{event.title}</h3>
                  <p className="eco-event-desc line-clamp-2">{event.description}</p>
                  <div className="eco-event-meta">
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <MapPin size={13} className="text-emerald-600" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Clock size={13} className="text-emerald-600" />
                      {event.time}
                    </span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-semibold text-emerald-800">
                      👥 {event.volunteersNeeded || 50}+ Volunteers Welcome
                    </span>
                    <Link to="/register" className="text-xs font-bold text-emerald-700 hover:underline">
                      Participate →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-muted">
                <Calendar size={32} className="mx-auto mb-2 text-emerald-600 opacity-60" />
                <p>New riverbank drives are currently being scheduled for this weekend.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. LIVE IMPACT METRICS STRIP */}
      <section className="eco-impact-stats-section py-12">
        <div className="container">
          <div className="eco-impact-box">
            <div className="eco-impact-item">
              <span className="eco-impact-number">{stats.cleanlinessDrives}+</span>
              <span className="eco-impact-label">Drives Completed</span>
            </div>
            <div className="eco-impact-divider"></div>
            <div className="eco-impact-item">
              <span className="eco-impact-number">{stats.volunteersActive}+</span>
              <span className="eco-impact-label">Registered Citizens</span>
            </div>
            <div className="eco-impact-divider"></div>
            <div className="eco-impact-item">
              <span className="eco-impact-number">{stats.wasteRemovedTons} Tons</span>
              <span className="eco-impact-label">Solid Waste Intercepted</span>
            </div>
            <div className="eco-impact-divider"></div>
            <div className="eco-impact-item">
              <span className="eco-impact-number">{stats.ghatsCleaned}</span>
              <span className="eco-impact-label">Ghats Revitalized</span>
            </div>
            <div className="eco-impact-divider"></div>
            <div className="eco-impact-item">
              <span className="eco-impact-number">{stats.treesPlanted}+</span>
              <span className="eco-impact-label">Trees Planted</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
