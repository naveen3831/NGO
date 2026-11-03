import React, { useState } from 'react';
import { Image, Filter, Eye, MapPin, Calendar } from 'lucide-react';

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const galleryItems = [
    {
      id: 1,
      title: 'Kotilingala Ghat Weekend Cleanup Drive',
      category: 'Cleanliness Drives',
      location: 'Kotilingala Ghat, Rajahmundry',
      date: 'October 2026',
      image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: 'School Youth River Stewardship Workshop',
      category: 'Awareness Programs',
      location: 'Pushkar Ghat Community Hall',
      date: 'September 2026',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      title: 'Mass Native Sapling Plantation on Riverbank',
      category: 'Tree Plantation',
      location: 'Godavari Bund Road',
      date: 'October 2026',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      title: 'Morning Ecological Survey at Dowleswaram',
      category: 'River Conservation',
      location: 'Dowleswaram Barrage',
      date: 'August 2026',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      title: 'Plastic Interception & Waste Segregation',
      category: 'Cleanliness Drives',
      location: 'Saraswathi Ghat',
      date: 'September 2026',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 6,
      title: 'Paryavarana Community Pledge & Rally',
      category: 'Awareness Programs',
      location: 'Rajahmundry Municipal Grounds',
      date: 'July 2026',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 7,
      title: 'Riverbank Green Corridor Development',
      category: 'Tree Plantation',
      location: 'Kovvur Riverbank',
      date: 'August 2026',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 8,
      title: 'Pristine Riverfront Water Sampling',
      category: 'River Conservation',
      location: 'Havelock Bridge Viewpoint',
      date: 'September 2026',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const categories = ['All', 'Cleanliness Drives', 'Awareness Programs', 'Tree Plantation', 'River Conservation'];

  const filtered = activeFilter === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <div className="eco-page-container">
      {/* Subpage Header */}
      <div className="eco-subpage-hero">
        <div className="container">
          <div className="eco-green-accent-bar mb-2"></div>
          <h1 className="eco-subpage-title">Initiative Photo Gallery</h1>
          <p className="eco-subpage-desc">
            Visual documentation of citizen volunteer efforts, riverbank cleanups, educational programs, and ecological regeneration along the Godavari.
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Category Filter Pills */}
        <div className="eco-filter-pills-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`eco-filter-pill ${activeFilter === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="eco-gallery-grid">
          {filtered.map((item) => (
            <div key={item.id} className="eco-gallery-card">
              <div className="eco-gallery-img-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  className="eco-gallery-img"
                  loading="lazy"
                />
                <span className="eco-gallery-badge">{item.category}</span>
              </div>
              <div className="eco-gallery-content">
                <h3 className="eco-gallery-title">{item.title}</h3>
                <div className="eco-gallery-meta">
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <MapPin size={13} className="text-emerald-600" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Calendar size={13} className="text-emerald-600" />
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;

