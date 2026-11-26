import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import HeroBanner from '../components/HeroBanner';

// Activity assets
import heroPlantImg from '../assets/hero-plant.jpg';
import actPillarCleanlinessImg from '../assets/act-pillar-cleanliness.jpg';
import actPillarPlantationImg from '../assets/act-pillar-plantation.jpg';
import actPillarConservationImg from '../assets/act-pillar-conservation.jpg';
import actPillarCommunityImg from '../assets/act-pillar-community.jpg';

// Event assets
import eventsScheduleCleanImg from '../assets/events-schedule-clean.jpg';
import eventsScheduleMeetImg from '../assets/events-schedule-meet.jpg';
import eventsSchedulePlantImg from '../assets/events-schedule-plant.jpg';

// Gallery assets
import galleryCleanKotilingalaImg from '../assets/gallery-clean-kotilingala.jpg';
import galleryAwareSchoolImg from '../assets/gallery-aware-school.jpg';
import galleryPlantBundImg from '../assets/gallery-plant-bund.jpg';
import galleryConserveDowleswaramImg from '../assets/gallery-conserve-dowleswaram.jpg';
import galleryCleanSortingImg from '../assets/gallery-clean-sorting.jpg';
import galleryAwarePledgeImg from '../assets/gallery-aware-pledge.jpg';
import galleryPlantCorridorImg from '../assets/gallery-plant-corridor.jpg';
import galleryConserveSamplingImg from '../assets/gallery-conserve-sampling.jpg';

import {
  MapPin,
  Calendar,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Compass,
  Image as ImageIcon,
} from 'lucide-react';

const activityPillars = [
  {
    title: 'Cleanliness Drives',
    tag: 'Shoreline Action',
    image: actPillarCleanlinessImg,
    path: '/activities/cleanliness',
    desc: 'Systematic bi-weekly cleaning of major Godavari bathing ghats, removing synthetic plastic waste and restoring riverfront beauty.',
    metric: '45+ Drives Completed',
  },
  {
    title: 'Tree Plantation',
    tag: 'Afforestation',
    image: actPillarPlantationImg,
    path: '/activities/plantation',
    desc: 'Planting indigenous Neem, Peepal, and Pongamia trees along 8 km of Godavari embankments to stabilize soil and cool local microclimates.',
    metric: '10,000+ Native Trees',
  },
  {
    title: 'River Conservation',
    tag: 'Hydrology & Science',
    image: actPillarConservationImg,
    path: '/activities/conservation',
    desc: 'Deploying canal plastic-trap netting barriers and operating 15 ghat water quality testing stations with transparent public health reporting.',
    metric: '22 Net Traps Active',
  },
  {
    title: 'Community Programs',
    tag: 'Civic Mobilization',
    image: actPillarCommunityImg,
    path: '/activities/community',
    desc: 'Youth eco-ambassador workshops, plastic-free pooja counseling for pilgrims, and merchant alliances across East & West Godavari.',
    metric: '3,500+ Citizens Engaged',
  },
];

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

const defaultGalleryItems = [
  {
    id: 1,
    title: 'Kotilingala Ghat Weekend Cleanup Drive',
    category: 'River Cleaning',
    location: 'Kotilingala Ghat, Rajahmundry',
    date: 'October 2026',
    image: galleryCleanKotilingalaImg,
  },
  {
    id: 2,
    title: 'Mass Native Sapling Plantation on Riverbank',
    category: 'Plantation',
    location: 'Godavari Bund Road',
    date: 'October 2026',
    image: galleryPlantBundImg,
  },
  {
    id: 3,
    title: 'Paryavarana Community Pledge & Rally',
    category: 'Awareness',
    location: 'Rajahmundry Municipal Grounds',
    date: 'September 2026',
    image: galleryAwarePledgeImg,
  },
  {
    id: 4,
    title: 'Green Future Sapling Care Initiative',
    category: 'Plantation',
    location: 'Pushkar Ghat Nursery',
    date: 'September 2026',
    image: heroPlantImg,
  },
  {
    id: 5,
    title: 'Plastic Interception & Waste Segregation',
    category: 'River Cleaning',
    location: 'Saraswathi Ghat',
    date: 'September 2026',
    image: galleryCleanSortingImg,
  },
  {
    id: 6,
    title: 'Riverbank Green Corridor Development',
    category: 'Plantation',
    location: 'Kovvur Riverbank',
    date: 'August 2026',
    image: galleryPlantCorridorImg,
  },
  {
    id: 7,
    title: 'Morning Ecological Survey at Dowleswaram',
    category: 'Events',
    location: 'Dowleswaram Barrage',
    date: 'August 2026',
    image: galleryConserveDowleswaramImg,
  },
  {
    id: 8,
    title: 'Pristine Riverfront Water Sampling',
    category: 'Events',
    location: 'Havelock Bridge Viewpoint',
    date: 'September 2026',
    image: galleryConserveSamplingImg,
  },
  {
    id: 9,
    title: 'School Youth River Stewardship Workshop',
    category: 'Awareness',
    location: 'Pushkar Ghat Community Hall',
    date: 'September 2026',
    image: galleryAwareSchoolImg,
  },
];

const Initiatives = ({ initialTab = 'all' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');
  const [activeSection, setActiveSection] = useState(queryTab || initialTab);

  // Events state
  const [events, setEvents] = useState(curatedEvents);
  const [activeEventTab, setActiveEventTab] = useState('Upcoming');

  // Gallery state
  const [activeGalleryFilter, setActiveGalleryFilter] = useState('All');
  const [remoteGalleryItems, setRemoteGalleryItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    setActiveSection(queryTab || initialTab);
  }, [queryTab, initialTab]);

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
      } catch {
        setEvents(curatedEvents);
      }
    };

    const fetchGallery = async () => {
      try {
        const res = await API.get('/public/gallery');
        if (Array.isArray(res.data)) {
          setRemoteGalleryItems(
            res.data.map((g) => ({
              id: g._id,
              title: g.title,
              category: g.category || 'River Cleaning',
              location: g.location || 'Godavari Riverfront, Rajahmundry',
              date:
                g.dateLabel ||
                new Date(g.createdAt || Date.now()).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                }),
              image: g.imageUrl,
            }))
          );
        }
      } catch {
        // Fallback to curated default gallery items
      }
    };

    fetchEvents();
    fetchGallery();
  }, []);

  const handleSectionSelect = (key) => {
    setActiveSection(key);
    if (key === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: key });
    }
  };

  const sectionTabs = [
    { key: 'all', label: 'All Initiatives', icon: Compass },
    { key: 'activities', label: 'Activities', icon: Compass },
    { key: 'events', label: 'Events', icon: Calendar },
    { key: 'gallery', label: 'Gallery', icon: ImageIcon },
  ];

  const showActivities = activeSection === 'all' || activeSection === 'activities';
  const showEvents = activeSection === 'all' || activeSection === 'events';
  const showGallery = activeSection === 'all' || activeSection === 'gallery';

  const eventTabs = ['Upcoming', 'Past Events', 'Meetings'];
  const filteredEvents = events.filter((evt) => evt.bucket === activeEventTab);

  const galleryItems = [...remoteGalleryItems, ...defaultGalleryItems];
  const galleryCategories = ['All', 'River Cleaning', 'Plantation', 'Awareness', 'Events'];
  const filteredGallery =
    activeGalleryFilter === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeGalleryFilter);
  const visibleGalleryItems = filteredGallery.slice(0, visibleCount);

  return (
    <div className="clean-page-wrapper" style={{ minHeight: '100vh', background: '#ffffff', color: '#1e293b' }}>
      {/* 1. UNIFIED INITIATIVES HERO BANNER */}
      <HeroBanner
        title="Our Initiatives"
        subtitle="Field Activities, Drives & Events, and Our Conservation Gallery"
      />

      {/* 2. ACTIVITIES SECTION */}
      {showActivities && (
        <>
          <section className="eco-ref-activities-section" id="activities">
            <div className="container" style={{ maxWidth: '1200px' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <span className="clean-badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                  OUR ACTIVITIES
                </span>
                <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 0.5rem' }}>
                  Core Action Pillars
                </h2>
                <p style={{ fontSize: '0.98rem', color: '#64748b', maxWidth: '620px', margin: '0 auto' }}>
                  Together for a cleaner and greener Godavari through ongoing field drives and river conservation.
                </p>
              </div>

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

          <section style={{ padding: '4rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                {activityPillars.map((pillar) => (
                  <div
                    key={pillar.path}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ height: '190px', overflow: 'hidden', position: 'relative', background: '#f1f5f9' }}>
                      <img
                        src={pillar.image}
                        alt={pillar.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        loading="lazy"
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: 'rgba(15, 23, 42, 0.85)',
                          color: '#ffffff',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {pillar.tag}
                      </div>
                    </div>

                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {pillar.metric}
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
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
        </>
      )}

      {/* 3. DRIVES & EVENTS SECTION */}
      {showEvents && (
        <section className="eco-ref-events-section" id="events" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <div className="container" style={{ maxWidth: '1160px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="clean-badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                DRIVES &amp; EVENTS
              </span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 0.5rem' }}>
                Join Our Events for a Greener Tomorrow
              </h2>
            </div>

            <div className="eco-ref-filter-row">
              {eventTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveEventTab(tab)}
                  className={`eco-ref-filter-pill ${activeEventTab === tab ? 'active' : ''}`}
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
      )}

      {/* 4. PHOTO GALLERY SECTION */}
      {showGallery && (
        <section className="eco-ref-gallery-section" id="gallery">
          <div className="container" style={{ maxWidth: '1200px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="clean-badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                PHOTO ARCHIVE
              </span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 0.5rem' }}>
                Our Journey for a Greener Godavari
              </h2>
            </div>

            <div className="eco-ref-filter-row">
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveGalleryFilter(cat);
                    setVisibleCount(8);
                  }}
                  className={`eco-ref-filter-pill ${activeGalleryFilter === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="eco-ref-gallery-grid">
              {visibleGalleryItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="eco-ref-photo-tile"
                  onClick={() => setLightboxIndex(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setLightboxIndex(idx)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="eco-ref-photo-img"
                    loading="lazy"
                  />
                  <div className="eco-ref-photo-hover">
                    <span className="eco-ref-photo-cat">{item.category}</span>
                    <div className="eco-ref-photo-title">{item.title}</div>
                    <div className="eco-ref-photo-loc">
                      <MapPin size={12} />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < filteredGallery.length && (
              <div style={{ textAlign: 'center', marginTop: '2.25rem' }}>
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="btn-hero-join-mission"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  Load More Photos ({filteredGallery.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && visibleGalleryItems[lightboxIndex] && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 20, 12, 0.88)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '900px',
              width: '100%',
              background: '#ffffff',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close lightbox"
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                zIndex: 5,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(0,0,0,0.6)',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
            <img
              src={visibleGalleryItems[lightboxIndex].image}
              alt={visibleGalleryItems[lightboxIndex].title}
              style={{
                width: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                background: '#0f172a',
                display: 'block',
              }}
            />
            <div
              style={{
                padding: '1rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <h4 style={{ margin: 0, color: '#064e3b' }}>
                  {visibleGalleryItems[lightboxIndex].title}
                </h4>
                <span style={{ fontSize: '0.85rem', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <Calendar size={13} />
                  {visibleGalleryItems[lightboxIndex].category} • {visibleGalleryItems[lightboxIndex].location} ({visibleGalleryItems[lightboxIndex].date})
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((lightboxIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length)
                  }
                  style={{
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '0.4rem 0.7rem',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIndex((lightboxIndex + 1) % visibleGalleryItems.length)}
                  style={{
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '0.4rem 0.7rem',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. UNIFIED VOLUNTEER CTA BANNER */}
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
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
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
            <Link
              to="/contact"
              style={{
                background: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.6)',
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
              <span>Share Drive Photos</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Initiatives;

