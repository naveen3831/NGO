import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import HeroBanner from '../components/HeroBanner';
import eventsScheduleCleanImg from '../assets/events-schedule-clean.jpg';
import eventsScheduleMeetImg from '../assets/events-schedule-meet.jpg';
import eventsSchedulePlantImg from '../assets/events-schedule-plant.jpg';
import galleryAwarePledgeImg from '../assets/gallery-aware-pledge.jpg';
import { MapPin, ArrowRight } from 'lucide-react';

const curatedEvents = [
  {
    _id: 'sample-drv-1',
    title: 'River Cleaning Drive',
    eventType: 'Cleanliness Drive',
    bucket: 'Upcoming',
    date: '2026-06-15T06:30:00.000Z',
    dayLabel: '15',
    monthLabel: 'Jun',
    location: { venue: 'Godavari River' },
    bannerImage: eventsScheduleCleanImg,
  },
  {
    _id: 'sample-drv-2',
    title: 'Tree Plantation Program',
    eventType: 'Tree Plantation',
    bucket: 'Upcoming',
    date: '2026-06-28T07:00:00.000Z',
    dayLabel: '28',
    monthLabel: 'Jun',
    location: { venue: 'Green Park' },
    bannerImage: eventsSchedulePlantImg,
  },
  {
    _id: 'sample-drv-3',
    title: 'Environmental Awareness Rally',
    eventType: 'Awareness Rally',
    bucket: 'Upcoming',
    date: '2026-07-10T08:00:00.000Z',
    dayLabel: '10',
    monthLabel: 'Jul',
    location: { venue: 'Town Hall' },
    bannerImage: galleryAwarePledgeImg,
  },
  {
    _id: 'sample-drv-4',
    title: 'Yoga for a Green Life',
    eventType: 'Community Wellness',
    bucket: 'Past Events',
    date: '2026-05-18T06:00:00.000Z',
    dayLabel: '18',
    monthLabel: 'May',
    location: { venue: 'Saraswathi Ghat Lawns' },
    bannerImage: eventsScheduleMeetImg,
  },
  {
    _id: 'sample-past-2',
    title: 'Kotilingala Ghat Monsoon Cleanup',
    eventType: 'Cleanliness Drive',
    bucket: 'Past Events',
    date: '2026-04-22T06:30:00.000Z',
    dayLabel: '22',
    monthLabel: 'Apr',
    location: { venue: 'Kotilingala Ghat' },
    bannerImage: eventsScheduleCleanImg,
  },
  {
    _id: 'sample-meet-1',
    title: 'Monthly Coordinator Strategy Meeting',
    eventType: 'Volunteer Meeting',
    bucket: 'Meetings',
    date: '2026-06-20T17:00:00.000Z',
    dayLabel: '20',
    monthLabel: 'Jun',
    location: { venue: 'Godavari Bund Secretariat' },
    bannerImage: eventsScheduleMeetImg,
  },
];

const Events = () => {
  const [events, setEvents] = useState(curatedEvents);
  const [activeTab, setActiveTab] = useState('Upcoming');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await API.get('/public/events');
        const list = Array.isArray(data) ? data : Array.isArray(data?.events) ? data.events : [];
        if (list.length > 0) {
          const enriched = list.map((e) => {
            const d = new Date(e.date || Date.now());
            const isMeeting = (e.eventType || '').toLowerCase().includes('meeting');
            const isPast = e.status === 'Completed' || d < new Date();
            return {
              ...e,
              bucket: isMeeting ? 'Meetings' : isPast ? 'Past Events' : 'Upcoming',
              dayLabel: String(d.getDate()).padStart(2, '0'),
              monthLabel: d.toLocaleDateString('en-US', { month: 'short' }),
              bannerImage:
                e.bannerImage ||
                (isMeeting
                  ? eventsScheduleMeetImg
                  : (e.eventType || '').toLowerCase().includes('plant')
                  ? eventsSchedulePlantImg
                  : eventsScheduleCleanImg),
            };
          });
          setEvents([...enriched, ...curatedEvents]);
        }
      } catch (err) {
        setEvents(curatedEvents);
      }
    };
    fetchEvents();
  }, []);

  const tabs = ['Upcoming', 'Past Events', 'Meetings'];
  const filteredEvents = events.filter((evt) => evt.bucket === activeTab);

  return (
    <div className="clean-page-wrapper" style={{ minHeight: '100vh', background: '#ffffff', color: '#1e293b' }}>
      {/* 1. EVENTS HERO BANNER (Matches Reference Design) */}
      <HeroBanner
        title="Drives & Events"
        subtitle="Join Our Events for a Greener Tomorrow"
      />

      {/* 2. FILTER PILLS & 3-COLUMN EVENT CARDS */}
      <section className="eco-ref-events-section">
        <div className="container" style={{ maxWidth: '1160px' }}>
          <div className="eco-ref-filter-row">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`eco-ref-filter-pill ${activeTab === tab ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="eco-ref-events-grid">
            {filteredEvents.map((evt) => {
              const d = new Date(evt.date || Date.now());
              const day = evt.dayLabel || String(d.getDate()).padStart(2, '0');
              const month = evt.monthLabel || d.toLocaleDateString('en-US', { month: 'short' });
              const venue =
                typeof evt.location === 'object' && evt.location !== null
                  ? evt.location.venue || evt.location.riverGhat || evt.location.city || 'Godavari River'
                  : evt.location || 'Godavari River';

              return (
                <div key={evt._id} className="eco-ref-event-card">
                  <div className="eco-ref-event-img-wrap">
                    <img
                      src={evt.bannerImage || eventsScheduleCleanImg}
                      alt={evt.title}
                      className="eco-ref-event-img"
                      loading="lazy"
                    />
                    <div className="eco-ref-event-date-badge">
                      <span className="eco-ref-event-day">{day}</span>
                      <span className="eco-ref-event-month">{month}</span>
                    </div>
                  </div>

                  <div className="eco-ref-event-body">
                    <h3 className="eco-ref-event-title">{evt.title}</h3>
                    <div className="eco-ref-event-loc">
                      <MapPin size={15} color="#006B3C" style={{ flexShrink: 0 }} />
                      <span>{venue}</span>
                    </div>
                  </div>

                  <Link to={`/events/${evt._id}`} className="eco-ref-event-footer">
                    <span>View Details</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. VOLUNTEER CTA BANNER */}
      <section
        style={{
          background: 'var(--footer-secondary, #006B3C)',
          color: 'var(--footer-heading, #FFFFFF)',
          padding: '4rem 1.5rem',
          textAlign: 'center',
          borderBottom: '1px solid var(--footer-border, #38845C)',
        }}
      >
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: 800, margin: '0 0 0.85rem' }}>
            Ready to Join the Next Weekend River Cleanup?
          </h2>
          <p style={{ fontSize: '1rem', color: '#f0fdf4', lineHeight: 1.7, margin: '0 0 1.75rem' }}>
            Register once as an active volunteer to get scheduled drive alerts, safety gear, and digital participation certificates.
          </p>
          <Link
            to="/register"
            style={{
              background: '#ffffff',
              color: '#1e6e14',
              padding: '0.8rem 1.85rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Register Free as Volunteer</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Events;
