import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import HeroBanner from '../components/HeroBanner';
import announceStreamNewsImg from '../assets/announce-stream-news.jpg';
import eventsScheduleCleanImg from '../assets/events-schedule-clean.jpg';
import heroPlantImg from '../assets/hero-plant.jpg';
import { ArrowRight } from 'lucide-react';

const curatedAnnouncements = [
  {
    _id: 'ann-world-env',
    title: 'World Environment Day Celebrations',
    summary: 'Join us for a greener tomorrow...',
    publishedAt: '2025-06-05T09:00:00.000Z',
    dateLabel: '05 Jun 2025',
    image: announceStreamNewsImg,
  },
  {
    _id: 'ann-river-clean',
    title: 'River Cleaning Drive Success',
    summary: 'A big thank you to all volunteers...',
    publishedAt: '2025-05-25T09:00:00.000Z',
    dateLabel: '25 May 2025',
    image: eventsScheduleCleanImg,
  },
  {
    _id: 'ann-tree-plant',
    title: 'Tree Plantation Program',
    summary: "Let's plant more trees...",
    publishedAt: '2025-05-15T09:00:00.000Z',
    dateLabel: '15 May 2025',
    image: heroPlantImg,
  },
];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState(curatedAnnouncements);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await API.get('/public/announcements');
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.announcements)
          ? data.announcements
          : [];
        if (list.length > 0) {
          const enriched = list.map((item, idx) => ({
            ...item,
            summary:
              (item.content || item.message || '').slice(0, 85) +
              ((item.content || item.message || '').length > 85 ? '...' : ''),
            image:
              item.image ||
              item.imageUrl ||
              [announceStreamNewsImg, eventsScheduleCleanImg, heroPlantImg][idx % 3],
          }));
          setAnnouncements([...enriched, ...curatedAnnouncements]);
        }
      } catch (err) {
        setAnnouncements(curatedAnnouncements);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="clean-page-wrapper" style={{ minHeight: '100vh', background: '#ffffff', color: '#1e293b' }}>
      {/* 1. ANNOUNCEMENTS HERO BANNER (Matches Reference Design) */}
      <HeroBanner
        title="Announcements"
        subtitle="Stay Informed with Our Latest Updates"
      />

      {/* 2. HORIZONTAL ANNOUNCEMENT ROWS */}
      <section className="eco-ref-announcements-section">
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div className="eco-ref-announcements-list">
            {announcements.map((item) => {
              const dateText =
                item.dateLabel ||
                new Date(item.publishedAt || item.createdAt || Date.now()).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                });

              return (
                <div key={item._id} className="eco-ref-announcement-row">
                  <div className="eco-ref-announcement-thumb-wrap">
                    <img
                      src={item.image || announceStreamNewsImg}
                      alt={item.title}
                      className="eco-ref-announcement-thumb"
                      loading="lazy"
                    />
                  </div>

                  <div className="eco-ref-announcement-info">
                    <h3 className="eco-ref-announcement-title">{item.title}</h3>
                    <p className="eco-ref-announcement-desc">
                      {item.summary || item.content || item.message}
                    </p>
                  </div>

                  <div className="eco-ref-announcement-date">{dateText}</div>

                  <Link
                    to={`/announcements/${item._id}`}
                    className="eco-ref-announcement-btn"
                  >
                    <span>Read More</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. STAY CONNECTED CTA BANNER */}
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
            Want Direct Alerts for River Conservation Drives?
          </h2>
          <p style={{ fontSize: '1rem', color: '#f0fdf4', lineHeight: 1.7, margin: '0 0 1.75rem' }}>
            Join Godhavari Nadhi Paryavarana Parishubratha as a volunteer member to receive official circulars and drive schedules.
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
            <span>Join Our Mission</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Announcements;
