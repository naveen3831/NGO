import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import HeroBanner from '../components/HeroBanner';
import galleryCleanKotilingalaImg from '../assets/gallery-clean-kotilingala.jpg';
import galleryAwareSchoolImg from '../assets/gallery-aware-school.jpg';
import galleryPlantBundImg from '../assets/gallery-plant-bund.jpg';
import galleryConserveDowleswaramImg from '../assets/gallery-conserve-dowleswaram.jpg';
import galleryCleanSortingImg from '../assets/gallery-clean-sorting.jpg';
import galleryAwarePledgeImg from '../assets/gallery-aware-pledge.jpg';
import galleryPlantCorridorImg from '../assets/gallery-plant-corridor.jpg';
import galleryConserveSamplingImg from '../assets/gallery-conserve-sampling.jpg';
import heroPlantImg from '../assets/hero-plant.jpg';
import {
  MapPin,
  Calendar,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [remoteItems, setRemoteItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await API.get('/public/gallery');
        if (Array.isArray(res.data)) {
          setRemoteItems(
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
      } catch (err) {
        console.error('Failed to load gallery photos:', err);
      }
    };
    fetchGallery();
  }, []);

  const defaultItems = [
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

  const galleryItems = remoteItems.length > 0 ? remoteItems : defaultItems;
  const categories = ['All', 'River Cleaning', 'Plantation', 'Awareness', 'Events'];

  const filtered =
    activeFilter === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  const visibleItems = filtered.slice(0, visibleCount);

  return (
    <div className="clean-page-wrapper" style={{ minHeight: '100vh', background: '#ffffff', color: '#1e293b' }}>
      {/* 1. GALLERY HERO BANNER (Matches Reference Design) */}
      <HeroBanner
        title="Gallery"
        subtitle="Our Journey for a Greener Godavari"
      />

      {/* 2. FILTER PILLS & 4-COLUMN PHOTO GRID */}
      <section className="eco-ref-gallery-section">
        <div className="container" style={{ maxWidth: '1200px' }}>
          {/* Category Filter Pills */}
          <div className="eco-ref-filter-row">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveFilter(cat);
                  setVisibleCount(8);
                }}
                className={`eco-ref-filter-pill ${activeFilter === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 4-Column Clean Rounded Photo Grid */}
          <div className="eco-ref-gallery-grid">
            {visibleItems.map((item, idx) => (
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

          {visibleCount < filtered.length && (
            <div style={{ textAlign: 'center', marginTop: '2.25rem' }}>
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="btn-hero-join-mission"
                style={{ border: 'none', cursor: 'pointer' }}
              >
                Load More Photos ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && visibleItems[lightboxIndex] && (
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
              src={visibleItems[lightboxIndex].image}
              alt={visibleItems[lightboxIndex].title}
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
                  {visibleItems[lightboxIndex].title}
                </h4>
                <span style={{ fontSize: '0.85rem', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <Calendar size={13} />
                  {visibleItems[lightboxIndex].category} • {visibleItems[lightboxIndex].location} ({visibleItems[lightboxIndex].date})
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((lightboxIndex - 1 + visibleItems.length) % visibleItems.length)
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
                  onClick={() => setLightboxIndex((lightboxIndex + 1) % visibleItems.length)}
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

      {/* 3. COMMUNITY CONTRIBUTIONS CTA */}
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
            Have Photos from a Recent Cleanliness Drive?
          </h2>
          <p style={{ fontSize: '1rem', color: '#f0fdf4', lineHeight: 1.7, margin: '0 0 1.75rem', opacity: 0.96 }}>
            Share your volunteer action photos with our media team to be featured in the official Godavari conservation archive.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/contact"
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
              <span>Share Drive Photos</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
