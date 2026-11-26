import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import HeroBanner from '../components/HeroBanner';
import announceStreamNewsImg from '../assets/announce-stream-news.jpg';
import { ArrowLeft, Calendar, Megaphone, ShieldCheck } from 'lucide-react';

const fallbackCircularsById = {
  'ann-world-env': {
    title: 'World Environment Day Celebrations',
    category: 'Special Event',
    publishedAt: '2025-06-05T09:00:00.000Z',
    content:
      'Join us for a greener tomorrow along the sacred River Godavari! Our World Environment Day celebrations feature a morning riverbank cleanup at Kotilingala Ghat, native sapling distribution to local families, and youth environmental pledges.',
  },
  'ann-river-clean': {
    title: 'River Cleaning Drive Success',
    category: 'Impact Report',
    publishedAt: '2025-05-25T09:00:00.000Z',
    content:
      'A big thank you to all volunteers who joined our weekend sunrise sanitation drive! Together, over 180 citizens cleared and segregated more than 600 kg of plastic and non-biodegradable waste from Pushkar and Kotilingala ghats.',
  },
  'ann-tree-plant': {
    title: 'Tree Plantation Program',
    category: 'Afforestation',
    publishedAt: '2025-05-15T09:00:00.000Z',
    content:
      "Let's plant more trees along the Godavari Bund Road green corridor. Volunteers planted 300 native Neem, Jamun, and Peepal saplings complete with bamboo protective guards and organic compost.",
  },
  'circ-1': {
    title: 'Advisory on Monsoon Drainage Catch Nets and Prohibited Debris Disposal',
    category: 'Environmental Advisory',
    priority: 'Urgent',
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    content:
      'Newly tensioned bio-barrier nets are actively operational across 22 drainage outfalls. Deliberate dumping of non-biodegradable packaging or plastic bottles into drainage canals incurs civic penalties under the Municipal River Conservation Ordinance. Volunteers conduct daily inspections at dawn to clear intercepted debris before it enters the Godavari mainstream.',
  },
  'circ-2': {
    title: 'Seasonal Schedule for Kotilingala and Pushkar Ghats Sunrise Cleaning Cadres',
    category: 'Operational Circular',
    priority: 'Important',
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    content:
      'Morning sanitation shifts for registered volunteers commence at 06:30 AM every Saturday and Sunday across Kotilingala, Pushkar, and Saraswathi Ghats. Shift coordinators must verify safety gear at the central desk before deploying.',
  },
  'circ-3': {
    title: 'Public Invitation: Q3 Basin Water Quality Open Review and Community Hearing',
    category: 'Public Hearing',
    priority: 'Important',
    publishedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    content:
      'The NGO Ecological Directorate invites citizens, collegiate researchers, and media representatives to attend the open public dissemination of the Third Quarter 2026 Godavari Basin Water Quality Index at the Municipal Library Auditorium.',
  },
  'circ-4': {
    title: 'Guidelines for Free Distribution of Reusable Cloth Bags to Pilgrims and Merchants',
    category: 'Community Notice',
    priority: 'General',
    publishedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    content:
      'Under the "Nadi Mitrula Sangham" civic program, 10,000 unbleached cotton carry bags are being supplied to riverbank flower and pooja merchants free of cost to replace single-use plastic covers.',
  },
};

const AnnouncementDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      if (fallbackCircularsById[id]) {
        setItem(fallbackCircularsById[id]);
        setLoading(false);
        return;
      }
      try {
        const res = await API.get(`/public/announcements/${id}`);
        setItem(res.data);
      } catch (err) {
        setItem(fallbackCircularsById['circ-1']);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '6rem 1.5rem', textAlign: 'center', color: '#064e3b' }}>
        Loading announcement...
      </div>
    );
  }

  return (
    <div className="clean-page-wrapper" style={{ background: '#ffffff' }}>
      <HeroBanner
        title="Announcements"
        subtitle="Official Circulars & Updates from River Godavari Conservation"
      />

      <section className="section-padding" style={{ paddingTop: '1.5rem' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          <Link
            to="/announcements"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#064e3b',
              fontWeight: 600,
              textDecoration: 'none',
              marginBottom: '1.5rem',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to All Announcements</span>
          </Link>

          <article className="clean-content-box">
            <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <img
                src={announceStreamNewsImg}
                alt={item?.title}
                style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="clean-badge">
                <Megaphone size={13} style={{ marginRight: '4px' }} />
                {item?.category || 'Official Notice'}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.88rem' }}>
                <Calendar size={14} />
                {new Date(item?.publishedAt || item?.createdAt || Date.now()).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)', color: '#064e3b', marginBottom: '1rem' }}>
              {item?.title}
            </h1>

            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, color: '#173D2B', whiteSpace: 'pre-line' }}>
              {item?.content || item?.message}
            </p>

            <div
              style={{
                marginTop: '2rem',
                padding: '1rem 1.25rem',
                background: '#f7fbf7',
                border: '1px solid #d1fae5',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#064e3b',
              }}
            >
              <ShieldCheck size={20} />
              <span>Issued by the Secretariat, Godhavari Nadhi Paryavarana Parishubratha, Rajahmundry.</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default AnnouncementDetails;

