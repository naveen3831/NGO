import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import heroGodavariBannerImg from '../assets/hero-godavari-banner.jpg';
import homePillarCleanImg from '../assets/home-pillar-clean.jpg';
import homePillarPlantImg from '../assets/home-pillar-plant.jpg';
import homePillarSchoolImg from '../assets/home-pillar-school.jpg';
import homePillarCompostImg from '../assets/home-pillar-compost.jpg';
import heroPlantImg from '../assets/hero-plant.jpg';
import galleryCleanKotilingalaImg from '../assets/gallery-clean-kotilingala.jpg';
import galleryPlantBundImg from '../assets/gallery-plant-bund.jpg';
import galleryAwareSchoolImg from '../assets/gallery-aware-school.jpg';
import galleryConserveDowleswaramImg from '../assets/gallery-conserve-dowleswaram.jpg';
import {
  Sprout,
  Calendar,
  Megaphone,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  Image as ImageIcon,
  Droplets,
  HeartHandshake,
  CheckCircle2,
  X,
  Quote,
} from 'lucide-react';

const homePillars = [
  {
    title: 'Ghat Cleanliness & Catch-Nets',
    tag: 'Shoreline Sanitation',
    image: homePillarCleanImg,
    path: '/activities/cleanliness',
    metric: '28.4 Tons Diverted',
    desc: 'Weekly volunteer sweeps and 22 drainage outfall bio-barrier nets preventing debris from entering River Godavari.'
  },
  {
    title: 'Riverbank Tree Afforestation',
    tag: 'Riparian Canopy',
    image: homePillarPlantImg,
    path: '/activities/plantation',
    metric: '2,500+ Saplings Planted',
    desc: 'Planting native Neem, Jamun, and Pongamia with protective guards along vulnerable erosion embankments.'
  },
  {
    title: 'School & College Eco-Drives',
    tag: 'Youth Education',
    image: homePillarSchoolImg,
    path: '/awareness/schools',
    metric: '12,500+ Students Certified',
    desc: 'Hands-on water quality test demonstrations, river science curriculum, and student ambassador charters.'
  },
  {
    title: 'Temple Floral Composting',
    tag: 'Cultural Stewardship',
    image: homePillarCompostImg,
    path: '/awareness/workshops',
    metric: '65+ Workshops Completed',
    desc: 'Transforming tons of sacred ritual flowers into nutrient bio-compost and promoting biodegradable leaf vessels.'
  }
];

const Home = () => {
  const [content, setContent] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [donateOpen, setDonateOpen] = useState(false);
  const [donationForm, setDonationForm] = useState({ donorName: '', email: '', phone: '', amount: 500, purpose: 'Godavari River Conservation Fund', paymentMethod: 'UPI' });
  const [donationStatus, setDonationStatus] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [contentRes, eventsRes, announcementsRes] = await Promise.all([
          API.get('/public/content'),
          API.get('/public/events'),
          API.get('/public/announcements'),
        ]);

        setContent(contentRes.data);
        setEvents(Array.isArray(eventsRes.data) ? eventsRes.data.slice(0, 3) : Array.isArray(eventsRes.data?.events) ? eventsRes.data.events.slice(0, 3) : []);
        setAnnouncements(Array.isArray(announcementsRes.data) ? announcementsRes.data.slice(0, 3) : Array.isArray(announcementsRes.data?.announcements) ? announcementsRes.data.announcements.slice(0, 3) : []);
      } catch (err) {
        console.error('Failed to load public website content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterMsg('');
    try {
      const res = await API.post('/public/newsletter', { email: newsletterEmail });
      setNewsletterMsg(res.data?.message || 'Subscribed successfully!');
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterMsg(err.response?.data?.message || 'Could not subscribe. Please try again.');
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    setDonationStatus('');
    try {
      const res = await API.post('/public/donations', donationForm);
      setDonationStatus(res.data?.message || 'Thank you for your generous support!');
      setDonationForm({ donorName: '', email: '', phone: '', amount: 500, purpose: 'Godavari River Conservation Fund', paymentMethod: 'UPI' });
    } catch (err) {
      setDonationStatus(err.response?.data?.message || 'Unable to record donation. Please check details.');
    }
  };

  return (
    <div className="eco-home-wrapper">
      {/* 1. HERO SECTION - Lush Godavari River Panorama with Left-Aligned Crisp Overlay */}
      <section className="eco-hero-master-section">
        <div className="eco-hero-canvas-wrapper">
          <div className="eco-hero-canvas-inner">
            <img
              src={heroGodavariBannerImg}
              alt="Clean Godavari Green Future - Together for a Cleaner and Greener Godavari"
              className="eco-hero-panorama-img"
              loading="eager"
            />
            <div className="eco-hero-scrim" aria-hidden="true" />

            {/* Left-Aligned Live Vector Typography & Single CTA */}
            <div className="eco-hero-content-overlay">
              <div className="eco-hero-text-block">
                <h1 className="eco-hero-main-title">
                  Clean Godavari <br />
                  Green Future
                </h1>
                <p className="eco-hero-subtitle">
                  Together for a Cleaner and Greener Godavari
                </p>

                <div className="eco-hero-buttons-overlay">
                  <Link to="/register" className="btn-hero-join-mission">
                    <span>Join Our Mission</span>
                    <ArrowRight size={16} className="btn-hero-arrow" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Subtle Curved Bottom Transition */}
            <svg
              className="eco-hero-bottom-curve"
              viewBox="0 0 1440 48"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,12 Q720,48 1440,12 L1440,48 L0,48 Z"
                fill="#ffffff"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* 2. CENTERED 4-CARD QUICK NAVIGATION ROW */}
      <section className="eco-perminu-cards-section">
        <div className="container">
          <div className="eco-perminu-cards-grid">
            {/* Card 1: Our Activities */}
            <Link to="/activities" className="eco-perminu-card">
              <div className="eco-pcard-icon-wrap">
                <Sprout size={24} className="eco-pcard-icon" />
              </div>
              <div className="eco-pcard-body">
                <h3 className="eco-pcard-title">Our Activities</h3>
                <p className="eco-pcard-desc">For a Cleaner River</p>
              </div>
            </Link>

            {/* Card 2: Upcoming Events */}
            <Link to="/events" className="eco-perminu-card">
              <div className="eco-pcard-icon-wrap">
                <Calendar size={24} className="eco-pcard-icon" />
              </div>
              <div className="eco-pcard-body">
                <h3 className="eco-pcard-title">Upcoming Events</h3>
                <p className="eco-pcard-desc">Be a Part</p>
              </div>
            </Link>

            {/* Card 3: Our Gallery */}
            <Link to="/gallery" className="eco-perminu-card">
              <div className="eco-pcard-icon-wrap">
                <ImageIcon size={24} className="eco-pcard-icon" />
              </div>
              <div className="eco-pcard-body">
                <h3 className="eco-pcard-title">Our Gallery</h3>
                <p className="eco-pcard-desc">See Our Work</p>
              </div>
            </Link>

            {/* Card 4: Announcements */}
            <Link to="/announcements" className="eco-perminu-card">
              <div className="eco-pcard-icon-wrap">
                <Megaphone size={24} className="eco-pcard-icon" />
              </div>
              <div className="eco-pcard-body">
                <h3 className="eco-pcard-title">Announcements</h3>
                <p className="eco-pcard-desc">Stay Updated</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. IMPACT STATISTICS STRIP (CONSISTENT WITH PLATFORM STANDARDS) */}
      <section style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '2.5rem 1.5rem', marginBottom: '3.5rem' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {[
              { val: '28.4+', label: 'Tons Diverted', sub: 'Non-biodegradable waste audited' },
              { val: '35+', label: 'Educational Campuses', sub: 'Schools & degree colleges engaged' },
              { val: '12,000+', label: 'Citizens Pledged', sub: 'Nadi Prathijna oath signed' },
              { val: '100%', label: 'Community Service', sub: 'Free public action across all ghats' }
            ].map((stat, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                borderLeft: '4px solid #059669',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#047857', lineHeight: 1.1, marginBottom: '0.25rem' }}>
                  {stat.val}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FOUR CORE PILLARS OF RIVER RESTORATION (PHOTO SHOWCASE WITH CONCISE COPY) */}
      <section style={{ padding: '0 1.5rem 4rem', maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{
            display: 'inline-block',
            background: '#ecfdf5',
            color: '#047857',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.76rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            border: '1px solid #a7f3d0',
            marginBottom: '0.5rem'
          }}>
            CONSERVATION IN ACTION
          </span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
            Core Pillars of River Godavari Rejuvenation
          </h2>
          <p style={{ fontSize: '0.98rem', color: '#64748b', maxWidth: '620px', margin: '0 auto' }}>
            Hands-on environmental programs delivering measurable restoration across the sacred river basin.
          </p>
        </div>

        <div className="eco-home-pillars-grid">
          {homePillars.slice(0, 2).map((pillar, idx) => (
            <div key={idx} className="eco-home-pillar-card">
              {/* Left Side: Photo */}
              <div className="eco-home-pillar-media">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="eco-home-pillar-img"
                />
                <span className="eco-home-pillar-tag">{pillar.tag}</span>
              </div>

              {/* Right Side: Matter & Explore CTA */}
              <div className="eco-home-pillar-body">
                <div className="eco-home-pillar-metric">{pillar.metric}</div>
                <h3 className="eco-home-pillar-title">{pillar.title}</h3>
                <p className="eco-home-pillar-desc">{pillar.desc}</p>

                <div style={{ marginTop: 'auto' }}>
                  <Link to={pillar.path} className="eco-home-pillar-btn">
                    <span>Explore Program</span>
                    <ArrowRight size={14} color="#059669" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4B. ABOUT OUR NGO & THREE MISSION HIGHLIGHTS */}
      <section style={{ padding: '1rem 1.5rem 4rem', maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center', marginBottom: '3.5rem', background: '#F7FBF7', padding: '2rem', borderRadius: '20px', border: '1px solid #d1fae5' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <img src={heroPlantImg} alt="About Godhavari Nadhi Paryavarana Parishubratha" style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }} />
          </div>
          <div>
            <span className="clean-badge">ABOUT OUR NGO</span>
            <h2 style={{ color: '#064e3b', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', margin: '0.5rem 0 0.75rem' }}>
              Protecting River Godavari for Generations
            </h2>
            <p style={{ color: '#173D2B', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Godhavari Nadhi Paryavarana Parishubratha unites local citizens, youth volunteers, and environmental stewards in Rajahmundry to preserve river purity, plant native trees, and foster eco-friendly traditions.
            </p>
            <Link to="/about" className="btn-eco-about-learn">
              <span>Learn More</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Three Mission Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {[
            { icon: Droplets, title: 'Clean River, Clean Life', desc: 'Weekly ghat sanitation and bio-barrier nets keeping River Godavari plastic-free.' },
            { icon: Sprout, title: 'Green Environment', desc: 'Native Neem, Jamun, and Peepal plantation corridors stabilizing river embankments.' },
            { icon: HeartHandshake, title: 'Healthy Community', desc: 'Youth eco-clubs, pilgrim outreach, and clean water stewardship across all ghats.' },
          ].map((hl, idx) => {
            const Icon = hl.icon;
            return (
              <div key={idx} style={{ background: '#ffffff', border: '1px solid #d1fae5', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 14px rgba(0, 107, 60, 0.05)' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#E8F5E9', color: '#006B3C', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                  <Icon size={22} />
                </div>
                <h3 style={{ color: '#064e3b', fontSize: '1.12rem', margin: '0 0 0.4rem' }}>{hl.title}</h3>
                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{hl.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Gallery Preview */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <span className="clean-badge">OUR GALLERY</span>
              <h2 style={{ color: '#064e3b', margin: '0.35rem 0 0' }}>Moments from the Riverfront</h2>
            </div>
            <Link to="/gallery" className="eco-preview-all">
              View All →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {[
              { img: galleryCleanKotilingalaImg, title: 'Kotilingala Ghat Cleanup' },
              { img: galleryPlantBundImg, title: 'Bund Road Plantation' },
              { img: galleryAwareSchoolImg, title: 'Youth River Workshops' },
              { img: galleryConserveDowleswaramImg, title: 'Dowleswaram Survey' },
            ].map((g, i) => (
              <Link key={i} to="/gallery" style={{ textDecoration: 'none', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff' }}>
                <img src={g.img} alt={g.title} style={{ width: '100%', height: '165px', objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#064e3b', fontSize: '0.92rem' }}>{g.title}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Community Testimonials */}
        <div style={{ background: '#F7FBF7', borderRadius: '20px', padding: '2.5rem 2rem', border: '1px solid #d1fae5' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span className="clean-badge">COMMUNITY VOICES</span>
            <h2 style={{ color: '#064e3b', marginTop: '0.4rem' }}>What Our Volunteers Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {[
              { quote: 'Every Sunday morning at Kotilingala Ghat brings citizens together with real purpose. Seeing the riverbanks spotless is deeply rewarding.', author: 'Smt. P. Lakshmi Devi', role: 'Community Volunteer' },
              { quote: 'Our college students learned practical water testing and waste segregation through the Godhavari youth program.', author: 'Dr. K. V. Subba Rao', role: 'Educator & Mentor' },
              { quote: 'Switching to leaf bowls and biodegradable offerings has transformed our temple surroundings.', author: 'Sri M. Ramu Naidu', role: 'Ghat Coordinator' },
            ].map((t, idx) => (
              <div key={idx} style={{ background: '#ffffff', borderRadius: '14px', padding: '1.35rem', border: '1px solid #e2e8f0' }}>
                <Quote size={20} color="#008C4A" style={{ marginBottom: '0.5rem' }} />
                <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '0.85rem' }}>"{t.quote}"</p>
                <div style={{ fontWeight: 700, color: '#064e3b', fontSize: '0.9rem' }}>{t.author}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LIVE COMMUNITY UPDATES (When Available) */}
      {(events.length > 0 || announcements.length > 0) && (
        <section className="eco-home-preview-section" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '3.5rem' }}>
          <div className="container">
            <div className="eco-preview-grid">
              {/* Upcoming Events Column */}
              {events.length > 0 && (
                <div className="eco-preview-col">
                  <div className="eco-preview-header">
                    <div className="d-flex align-items-center gap-2">
                      <Calendar size={20} className="text-emerald-700" />
                      <h3 className="eco-preview-title">Upcoming Drives &amp; Events</h3>
                    </div>
                    <Link to="/events" className="eco-preview-all">
                      View All →
                    </Link>
                  </div>

                  <div className="eco-preview-list">
                    {events.slice(0, 2).map((evt) => (
                      <div key={evt._id || evt.id} className="eco-preview-item">
                        <div className="eco-preview-date-badge">
                          <span className="p-month">
                            {new Date(evt.date || Date.now()).toLocaleDateString('en-US', {
                              month: 'short',
                            })}
                          </span>
                          <span className="p-day">
                            {new Date(evt.date || Date.now()).getDate()}
                          </span>
                        </div>
                        <div className="eco-preview-item-info">
                          <h4 className="p-item-name">{evt.title}</h4>
                          <p className="p-item-meta">
                            <Clock size={13} />
                            <span>{evt.time || '07:00 AM - 10:00 AM'}</span>
                            <span className="mx-1">•</span>
                            <MapPin size={13} />
                            <span>
                              {typeof evt.location === 'object' && evt.location !== null
                                ? evt.location.venue || evt.location.riverGhat || evt.location.city || 'Godhavari Ghat'
                                : evt.location || 'Godhavari Ghat'}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Latest Announcements Column */}
              {announcements.length > 0 && (
                <div className="eco-preview-col">
                  <div className="eco-preview-header">
                    <div className="d-flex align-items-center gap-2">
                      <Megaphone size={20} className="text-emerald-700" />
                      <h3 className="eco-preview-title">Latest Announcements</h3>
                    </div>
                    <Link to="/announcements" className="eco-preview-all">
                      View All →
                    </Link>
                  </div>

                  <div className="eco-preview-list">
                    {announcements.slice(0, 2).map((item) => (
                      <div key={item._id || item.id} className="eco-preview-item">
                        <div className="eco-preview-bullet-icon">
                          <Sparkles size={16} />
                        </div>
                        <div className="eco-preview-item-info">
                          <h4 className="p-item-name">{item.title}</h4>
                          <p className="p-item-meta">
                            <span>
                              {new Date(item.createdAt || Date.now()).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 6. CALL TO ACTION BANNER (CONSISTENT WITH OTHER PLATFORM PAGES) */}
      <section style={{
        background: 'var(--footer-secondary, #006B3C)',
        color: 'var(--footer-heading, #FFFFFF)',
        padding: '4.5rem 1.5rem',
        textAlign: 'center',
        marginTop: '2rem',
        borderBottom: '1px solid var(--footer-border, #38845C)'
      }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#86efac',
            marginBottom: '1rem'
          }}>
            JOIN THE CONSERVATION MOVEMENT
          </span>

          <h2 style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.25 }}>
            Be Part of the Solution for River Godavari
          </h2>

          <p style={{ fontSize: '1.02rem', color: '#ecfdf5', lineHeight: 1.7, margin: '0 0 2rem', opacity: 0.95 }}>
            Whether dedicating two hours on a weekend morning or spreading eco-awareness in your community, every action counts.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => { setDonateOpen(true); setDonationStatus(''); }}
              style={{
                background: '#ffffff',
                color: '#064e3b',
                padding: '0.85rem 2rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.98rem',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              <HeartHandshake size={17} />
              <span>Donate Now</span>
            </button>
            <Link
              to="/register"
              style={{
                background: '#008C4A',
                color: '#ffffff',
                padding: '0.85rem 2rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.98rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
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
                border: '1px solid rgba(255, 255, 255, 0.35)',
                padding: '0.85rem 1.75rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.98rem',
                textDecoration: 'none'
              }}
            >
              Contact Our Coordinators
            </Link>
          </div>
        </div>
      </section>

      {/* 7. NEWSLETTER SUBSCRIPTION */}
      <section style={{ background: '#F7FBF7', padding: '3rem 1.5rem', borderTop: '1px solid #d1fae5' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ color: '#064e3b', fontSize: '1.45rem', marginBottom: '0.4rem' }}>Subscribe to River Conservation Updates</h3>
          <p style={{ color: '#475569', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
            Receive monthly ghat cleanup schedules, plantation milestones, and environmental circulars.
          </p>
          <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              style={{ flex: '1 1 260px', maxWidth: '380px', padding: '0.7rem 1rem', borderRadius: '9999px', border: '1px solid #cbd5e1' }}
            />
            <button type="submit" className="btn-hero-join-mission" style={{ border: 'none', cursor: 'pointer' }}>
              Subscribe
            </button>
          </form>
          {newsletterMsg && <p style={{ marginTop: '0.75rem', color: '#006B3C', fontWeight: 600 }}>{newsletterMsg}</p>}
        </div>
      </section>

      {/* Donation Modal */}
      {donateOpen && (
        <div
          onClick={() => setDonateOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#ffffff', borderRadius: '18px', maxWidth: '480px', width: '100%', padding: '1.75rem', position: 'relative' }}
          >
            <button
              type="button"
              onClick={() => setDonateOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
            <h3 style={{ color: '#064e3b', marginBottom: '0.5rem' }}>Support River Godavari Conservation</h3>
            <p style={{ color: '#475569', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Your contribution directly funds ghat cleaning gear, bio-barrier nets, and native saplings.
            </p>
            {donationStatus ? (
              <div style={{ background: '#E8F5E9', color: '#064e3b', padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} />
                <span>{donationStatus}</span>
              </div>
            ) : (
              <form onSubmit={handleDonationSubmit} className="auth-form-body">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" required value={donationForm.donorName} onChange={(e) => setDonationForm({ ...donationForm, donorName: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Email</label>
                    <input type="email" value={donationForm.email} onChange={(e) => setDonationForm({ ...donationForm, email: e.target.value })} />
                  </div>
                  <div className="form-group flex-1">
                    <label>Amount (₹) *</label>
                    <input type="number" min="1" required value={donationForm.amount} onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select value={donationForm.paymentMethod} onChange={(e) => setDonationForm({ ...donationForm, paymentMethod: e.target.value })}>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-2">
                  Confirm Contribution
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
