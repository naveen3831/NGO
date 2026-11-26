import React from 'react';
import heroGodavariBannerImg from '../assets/hero-godavari-banner.jpg';

const HeroBanner = ({
  title,
  subtitle = 'Together for a Cleaner and Greener Godavari',
  image = heroGodavariBannerImg,
}) => {
  return (
    <section className="eco-hero-master-section">
      <div className="eco-hero-canvas-wrapper">
        <div className="eco-hero-canvas-inner eco-subpage-hero-inner">
          <img
            src={image}
            alt={title}
            className="eco-hero-panorama-img"
            loading="eager"
          />
          <div className="eco-subpage-hero-scrim" aria-hidden="true" />

          <div className="eco-subpage-hero-overlay">
            <h1 className="eco-subpage-hero-title">{title}</h1>
            {subtitle && <p className="eco-subpage-hero-subtitle">{subtitle}</p>}
          </div>

          <svg
            className="eco-hero-bottom-curve"
            viewBox="0 0 1440 48"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,12 Q720,48 1440,12 L1440,48 L0,48 Z" fill="#ffffff" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

