import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import HeroBanner from '../components/HeroBanner';
import heroPlantImg from '../assets/hero-plant.jpg';
import actHeroShowcaseImg from '../assets/act-hero-showcase.jpg';
import actPillarCleanlinessImg from '../assets/act-pillar-cleanliness.jpg';
import actPillarPlantationImg from '../assets/act-pillar-plantation.jpg';
import actPillarConservationImg from '../assets/act-pillar-conservation.jpg';
import actPillarCommunityImg from '../assets/act-pillar-community.jpg';
import actEventCleanlinessImg from '../assets/act-event-cleanliness.jpg';
import actEventPlantationImg from '../assets/act-event-plantation.jpg';
import actEventConservationImg from '../assets/act-event-conservation.jpg';
import actEventCommunityImg from '../assets/act-event-community.jpg';

import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Brush, 
  Sprout, 
  Waves, 
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Layers,
  Award
} from 'lucide-react';

const activityPillars = [
  {
    title: 'Cleanliness Drives',
    tag: 'Shoreline Action',
    badgeBg: '#ecfdf5',
    badgeColor: '#047857',
    image: actPillarCleanlinessImg,
    path: '/activities/cleanliness',
    desc: 'Systematic bi-weekly cleaning of major Godavari bathing ghats, removing synthetic plastic waste and restoring riverfront beauty.',
    metric: '45+ Drives Completed'
  },
  {
    title: 'Tree Plantation',
    tag: 'Afforestation',
    badgeBg: '#eff6ff',
    badgeColor: '#1d4ed8',
    image: actPillarPlantationImg,
    path: '/activities/plantation',
    desc: 'Planting indigenous Neem, Peepal, and Pongamia trees along 8 km of Godavari embankments to stabilize soil and cool local microclimates.',
    metric: '10,000+ Native Trees'
  },
  {
    title: 'River Conservation',
    tag: 'Hydrology & Science',
    badgeBg: '#faf5ff',
    badgeColor: '#7c3aed',
    image: actPillarConservationImg,
    path: '/activities/conservation',
    desc: 'Deploying canal plastic-trap netting barriers and operating 15 ghat water quality testing stations with transparent public health reporting.',
    metric: '22 Net Traps Active'
  },
  {
    title: 'Community Programs',
    tag: 'Civic Mobilization',
    badgeBg: '#fffbeb',
    badgeColor: '#b45309',
    image: actPillarCommunityImg,
    path: '/activities/community',
    desc: 'Youth eco-ambassador workshops, plastic-free pooja counseling for pilgrims, and merchant alliances across East & West Godavari.',
    metric: '3,500+ Citizens Engaged'
  }
];

const fallbackEvents = [
  {
    _id: 'sample-cleanliness-1',
    title: 'Kotilingala Ghat Weekend Sanitation Drive',
    eventType: 'Cleanliness Drive',
    date: new Date(Date.now() + 86400000 * 3).toISOString(),
    time: '06:30 AM – 09:00 AM',
    location: { venue: 'Kotilingala Ghat, Godavari Bund Road' },
    enrolledVolunteersCount: 28,
    targetVolunteers: 40,
    description: 'Bi-weekly shoreline cleanup focusing on plastic bottle extraction and segregation into municipal recycling streams.',
    bannerImage: actEventCleanlinessImg
  },
  {
    _id: 'sample-plantation-1',
    title: 'Riparian Forest Embankment Afforestation',
    eventType: 'Tree Plantation',
    date: new Date(Date.now() + 86400000 * 7).toISOString(),
    time: '07:00 AM – 10:00 AM',
    location: { venue: 'Godavari Bund Corridor, Near Dowleswaram' },
    enrolledVolunteersCount: 35,
    targetVolunteers: 50,
    description: 'Planting 250 native Neem and Pongamia saplings with protective bamboo guards along eroding riverbanks.',
    bannerImage: actEventPlantationImg
  },
  {
    _id: 'sample-conservation-1',
    title: 'Citizen-Science Water Sampling & Testing',
    eventType: 'River Conservation',
    date: new Date(Date.now() + 86400000 * 12).toISOString(),
    time: '08:00 AM – 10:30 AM',
    location: { venue: 'Pushkar & Saraswathi Ghats' },
    enrolledVolunteersCount: 16,
    targetVolunteers: 25,
    description: 'Testing dissolved oxygen, pH, and turbidity alongside college biology students using digital field equipment.',
    bannerImage: actEventConservationImg
  },
  {
    _id: 'sample-community-1',
    title: 'Youth Eco-Ambassador Riverfront Campaign',
    eventType: 'Community Program',
    date: new Date(Date.now() + 86400000 * 16).toISOString(),
    time: '05:00 PM – 07:00 PM',
    location: { venue: 'Godavari River Promenade, Rajahmundry' },
    enrolledVolunteersCount: 42,
    targetVolunteers: 60,
    description: 'Student-led environmental rally and merchant outreach promoting reusable cotton bags and plastic-free pooja traditions.',
    bannerImage: actEventCommunityImg
  }
];

const Activities = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await API.get('/public/events');
        const validEvents = Array.isArray(data) ? data : Array.isArray(data?.events) ? data.events : [];
        setEvents(validEvents.length > 0 ? validEvents : fallbackEvents);
      } catch (err) {
        console.warn('Using curated scheduled activities fallback:', err);
        setEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const categories = ['All', 'Cleanliness Drive', 'Tree Plantation', 'River Conservation', 'Community Program'];

  const filteredEvents =
    filterType === 'All'
      ? events
      : events.filter((e) => (e.eventType || '').toLowerCase() === filterType.toLowerCase());

  return (
    <div className="clean-page-wrapper" style={{ minHeight: '100vh', background: '#ffffff', color: '#1e293b' }}>
      
      {/* 1. ACTIVITIES HERO BANNER (Matches Reference Design) */}
      <HeroBanner
        title="Our Activities"
        subtitle="Together for a Cleaner and Greener Godavari"
      />

      {/* 1B. 4-COLUMN CORE ACTIVITIES ROW (Matches Reference Cards) */}
      <section className="eco-ref-activities-section">
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div className="eco-ref-activities-grid">
            {[
              {
                title: 'River Cleaning Drives',
                image: actPillarCleanlinessImg,
                path: '/activities/cleanliness',
              },
              {
                title: 'Plantation Drives',
                image: heroPlantImg,
                path: '/activities/plantation',
              },
              {
                title: 'Environmental Protection',
                image: actPillarConservationImg,
                path: '/activities/conservation',
              },
              {
                title: 'Community Service',
                image: actPillarCommunityImg,
                path: '/activities/community',
              },
            ].map((card) => (
              <Link key={card.path} to={card.path} className="eco-ref-activity-card">
                <div className="eco-ref-activity-img-wrap">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="eco-ref-activity-img"
                    loading="lazy"
                  />
                </div>
                <div className="eco-ref-activity-body">
                  <h3 className="eco-ref-activity-title">{card.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. FOUR CORE ACTIVITY PILLARS (CARD SHOWCASE WITH UNIQUE PHOTOS) */}
      <section id="pillars" style={{ padding: '4.5rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="clean-badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
              WHAT WE DO
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 0.5rem' }}>
              Explore Our Core Action Pillars
            </h2>
            <p style={{ fontSize: '0.98rem', color: '#64748b', maxWidth: '620px', margin: '0 auto' }}>
              Click into each dedicated initiative to review schedules, methodologies, and volunteer opportunities.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.75rem' }}>
            {activityPillars.map((pillar, idx) => (
              <div 
                key={idx}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {/* Photo Header */}
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative', background: '#f1f5f9' }}>
                  <img 
                    src={pillar.image} 
                    alt={pillar.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                    loading="lazy"
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    {pillar.tag}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '1.65rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {pillar.metric}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                    {pillar.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.65, margin: '0 0 1.25rem', flex: 1 }}>
                    {pillar.desc}
                  </p>

                  <Link 
                    to={pillar.path}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      color: '#0f172a',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      textDecoration: 'none',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <span>View Dedicated Page</span>
                    <ArrowRight size={15} color="#059669" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. SCHEDULED DRIVES & EVENTS LIST (WITH DEDICATED AUTHENTIC PHOTOS) */}
      <section style={{ padding: '4.5rem 1.5rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="clean-badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
              UPCOMING SCHEDULE
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 0.5rem' }}>
              Scheduled Field Drives
            </h2>
            <p style={{ fontSize: '0.98rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
              Join an upcoming drive. Free registration, safety equipment provided, and certified service hours.
            </p>
          </div>

          {/* Simple Filter Strip */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterType(cat)}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '999px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: filterType === cat ? '1px solid #059669' : '1px solid #e2e8f0',
                  background: filterType === cat ? '#059669' : '#ffffff',
                  color: filterType === cat ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Drives Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              Loading scheduled activities...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              background: '#f8fafc',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <AlertCircle size={36} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
                No drives found in this category
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                New drives are posted every week. Join as a volunteer to receive immediate notifications.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
              {filteredEvents.map((evt) => (
                <div 
                  key={evt._id} 
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ height: '185px', overflow: 'hidden', position: 'relative', background: '#f1f5f9' }}>
                    <img
                      src={evt.bannerImage || actEventCleanlinessImg}
                      alt={evt.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                      loading="lazy"
                    />
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {evt.eventType}
                    </span>
                  </div>

                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.65rem' }}>
                      <Calendar size={13} />
                      <span>{new Date(evt.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                      <span>•</span>
                      <Clock size={13} />
                      <span>{evt.time}</span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem', lineHeight: 1.35 }}>
                      {evt.title}
                    </h3>

                    <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 1rem', flex: 1 }}>
                      {evt.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                      <MapPin size={14} color="#059669" />
                      <span>{evt.location?.venue || 'Godavari Riverbank, Rajamahendravaram'}</span>
                    </div>

                    <div style={{
                      marginTop: 'auto',
                      paddingTop: '1rem',
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                        <span style={{ color: '#059669', fontWeight: 800 }}>{evt.enrolledVolunteersCount || 0}</span> / {evt.targetVolunteers || 50} vols
                      </div>
                      <Link
                        to="/register"
                        className="btn btn-primary btn-sm"
                        style={{
                          backgroundColor: '#059669',
                          borderColor: '#059669',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          padding: '0.45rem 1.1rem',
                          borderRadius: '8px',
                          textDecoration: 'none'
                        }}
                      >
                        <span>Sign Up</span>
                      </Link>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section style={{ padding: '4.5rem 1.5rem', background: 'var(--footer-secondary, #006B3C)', color: 'var(--footer-heading, #FFFFFF)', borderBottom: '1px solid var(--footer-border, #38845C)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          
          <span style={{
            display: 'inline-block',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#86efac',
            fontSize: '0.76rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '0.35rem 1rem',
            borderRadius: '999px',
            marginBottom: '1rem',
            textTransform: 'uppercase'
          }}>
            BE PART OF THE CHANGE
          </span>

          <h2 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.85rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Together for a Cleaner Environment. Together for a Better Future.
          </h2>

          <p style={{ fontSize: '1.05rem', color: '#d1fae5', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto 2rem' }}>
            Join our growing family of dedicated environmental volunteers across the sacred Godavari basin.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              className="btn btn-primary btn-lg"
              style={{
                backgroundColor: '#ffffff',
                color: '#064e3b',
                fontWeight: 700,
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.85rem',
                borderRadius: '8px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                textDecoration: 'none'
              }}
            >
              <span>Join As Volunteer</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/events"
              className="btn btn-outline btn-lg"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'rgba(255,255,255,0.4)',
                color: '#ffffff',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.85rem',
                borderRadius: '8px',
                textDecoration: 'none'
              }}
            >
              <span>View All Events</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Activities;
