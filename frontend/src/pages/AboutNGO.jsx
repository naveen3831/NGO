import React from 'react';
import { Link } from 'react-router-dom';
import heroGodavariBannerImg from '../assets/hero-godavari-banner.jpg';
import heroPlantImg from '../assets/hero-plant.jpg';
import godavariCleanupImg from '../assets/godavari-cleanup.jpg';
import godavariMissionHeroImg from '../assets/godavari-mission-hero.jpg';
import aboutWhoWeAreImg from '../assets/about-who-we-are.jpg';
import aboutOurPurposeImg from '../assets/about-our-purpose.jpg';
import aboutWorkCleanupImg from '../assets/about-work-cleanup.jpg';
import aboutWorkAwarenessImg from '../assets/about-work-awareness.jpg';
import aboutWorkPlantationImg from '../assets/about-work-plantation.jpg';
import aboutPillarCleanlinessImg from '../assets/about-pillar-cleanliness.jpg';
import aboutPillarAwarenessImg from '../assets/about-pillar-awareness.jpg';
import aboutPillarCommunityImg from '../assets/about-pillar-community.jpg';
import aboutPillarPracticesImg from '../assets/about-pillar-practices.jpg';
import aboutPillarCollectiveImg from '../assets/about-pillar-collective.jpg';
import aboutApproachImg from '../assets/about-approach.jpg';
import aboutCommitmentImg from '../assets/about-commitment.jpg';
import { 
  Users, 
  Target, 
  Leaf, 
  Globe, 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Compass,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Award,
  Sprout,
  Eye
} from 'lucide-react';

const standForList = [
  {
    title: 'Environmental Cleanliness',
    desc: 'Protecting sacred riverbanks and maintaining clean, trash-free bathing ghat steps.',
    image: aboutPillarCleanlinessImg,
    icon: Leaf,
    color: '#059669',
    bg: '#ecfdf5',
    tag: 'River Purity'
  },
  {
    title: 'Public Awareness',
    desc: 'Empowering students, pilgrims, and residents through hands-on water quality literacy.',
    image: aboutPillarAwarenessImg,
    icon: Globe,
    color: '#0284c7',
    bg: '#f0f9ff',
    tag: 'Education'
  },
  {
    title: 'Community Participation',
    desc: 'Mobilizing citizens, youth groups, and local shopkeepers for shared civic action.',
    image: aboutPillarCommunityImg,
    icon: Users,
    color: '#7c3aed',
    bg: '#faf5ff',
    tag: 'Civic Pride'
  },
  {
    title: 'Responsible Practices',
    desc: 'Transitioning to biodegradable leaf offerings and terracotta lamps across ghat temples.',
    image: aboutPillarPracticesImg,
    icon: ShieldCheck,
    color: '#d97706',
    bg: '#fffbeb',
    tag: 'Eco Traditions'
  },
  {
    title: 'Collective Society',
    desc: 'Uniting grassroots volunteers with municipal teams for measurable river restoration.',
    image: aboutPillarCollectiveImg,
    icon: HeartHandshake,
    color: '#0f766e',
    bg: '#f0fdfa',
    tag: 'Teamwork'
  },
];

const photoHighlights = [
  {
    title: 'Community Cleanliness Drives',
    subtitle: 'Kotilingala & Pushkar Ghats',
    image: aboutWorkCleanupImg,
    tag: 'Field Action'
  },
  {
    title: 'Public Awareness & Youth Education',
    subtitle: 'Schools & Pilgrim Workshops',
    image: aboutWorkAwarenessImg,
    tag: 'Awareness'
  },
  {
    title: 'Riverbank Afforestation & Tree Plantation',
    subtitle: 'Godavari Bund Road Corridor',
    image: aboutWorkPlantationImg,
    tag: 'Conservation'
  }
];

const AboutNGO = () => {
  return (
    <div className="clean-page-wrapper" style={{ minHeight: '100vh', background: '#ffffff', color: '#1e293b' }}>
      
      {/* 1. ABOUT US HERO BANNER (Matches Reference Design) */}
      <section className="eco-hero-master-section">
        <div className="eco-hero-canvas-wrapper">
          <div className="eco-hero-canvas-inner eco-subpage-hero-inner">
            <img
              src={heroGodavariBannerImg}
              alt="About Us - Together for a Cleaner and Greener Godavari"
              className="eco-hero-panorama-img"
              loading="eager"
            />
            <div className="eco-subpage-hero-scrim" aria-hidden="true" />

            <div className="eco-subpage-hero-overlay">
              <h1 className="eco-subpage-hero-title">About Us</h1>
              <p className="eco-subpage-hero-subtitle">
                Together for a Cleaner and Greener Godavari
              </p>
            </div>

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

      {/* 1B. OUR ORGANIZATION + MISSION / VISION ROW */}
      <section className="eco-about-intro-section">
        <div className="container">
          <div className="eco-about-intro-grid">
            {/* Left: Hands Holding Sapling Image */}
            <div className="eco-about-intro-photo-wrap">
              <img
                src={heroPlantImg}
                alt="Hands nurturing a young green sapling along River Godavari"
                className="eco-about-intro-photo"
              />
            </div>

            {/* Center: Our Organization + CTA */}
            <div className="eco-about-intro-copy">
              <h2 className="eco-about-intro-heading">Our Organization</h2>
              <p className="eco-about-intro-text">
                Godhavari Nadhi Paryavarana Parishubratha is dedicated to protecting the environment
                and preserving the Godavari River for future generations.
              </p>
              <a href="#conviction" className="btn-eco-about-learn">
                <span>Learn More</span>
                <ArrowRight size={16} className="btn-hero-arrow" />
              </a>
            </div>

            {/* Right: Stacked Mission & Vision Mint Card */}
            <div className="eco-about-mv-stack">
              <Link to="/about/mission" className="eco-about-mv-row">
                <div className="eco-about-mv-icon-wrap">
                  <Sprout size={24} />
                </div>
                <div className="eco-about-mv-body">
                  <h3 className="eco-about-mv-title">Our Mission</h3>
                  <p className="eco-about-mv-desc">Protect the environment</p>
                </div>
              </Link>

              <Link to="/about/objectives" className="eco-about-mv-row">
                <div className="eco-about-mv-icon-wrap">
                  <Eye size={24} />
                </div>
                <div className="eco-about-mv-body">
                  <h3 className="eco-about-mv-title">Our Vision</h3>
                  <p className="eco-about-mv-desc">Greener Godavari</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE NARRATIVE WITH FEATURED IMAGE */}
      <section id="conviction" style={{ padding: '4.5rem 1.5rem', background: '#ffffff', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            
            {/* Left Narrative */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                <Sparkles size={16} />
                <span>Our Core Conviction</span>
              </div>
              
              <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.1rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, margin: '0 0 1.25rem' }}>
                Collective Responsibility for a Cleaner Environment
              </h2>
              
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: '0 0 1.25rem' }}>
                Maintaining a clean, unpolluted river ecosystem is a <strong style={{ color: '#0f172a' }}>collective civic responsibility</strong>. 
                Through organized ghat sweeps, student eco-clubs, and public pledge drives, we empower citizens to actively protect Godavari.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  'Organizing regular community-led cleanliness drives along the riverbanks',
                  'Creating proactive awareness campaigns for schools, youth and pilgrims',
                  'Fostering long-term civic ownership and responsible environmental practices'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual Photo Card (Unobstructed & Razor-Sharp) */}
            <div>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.12)',
                border: '1px solid #e2e8f0',
                background: '#ffffff'
              }}>
                <img 
                  src={godavariCleanupImg} 
                  alt="Godavari River Cleanliness and Awareness Volunteer Drive" 
                  style={{ 
                    width: '100%', 
                    height: '390px', 
                    objectFit: 'cover', 
                    display: 'block'
                  }}
                  loading="eager"
                />
                <div style={{
                  padding: '0.85rem 1.25rem',
                  background: '#f8fafc',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>
                      Godavari Riverfront Community Cleanup Initiative
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#047857',
                    background: '#ecfdf5',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    border: '1px solid #a7f3d0',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap'
                  }}>
                    Civic Action
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. WHO WE ARE & OUR PURPOSE WITH REAL PHOTO CARDS */}
      <section id="who-we-are" style={{ padding: '4.5rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Card 1: Who We Are with Photo Header */}
            <div style={{
              background: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={aboutWhoWeAreImg} 
                  alt="Community Volunteers in Rajahmundry"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: '12px', left: '16px', background: 'rgba(6, 78, 59, 0.9)', backdropFilter: 'blur(4px)', color: '#ffffff', padding: '4px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Community Stewardship
                </div>
              </div>
              
              <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Who We Are
                  </h3>
                </div>

                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
                  We are a grassroots civic movement dedicated to the environmental conservation and cleanliness of the sacred River Godavari.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: 'auto' }}>
                  {['100% Volunteer-driven riverfront patrols', 'Daily plastic cleanup across bathing ghats', 'Citizen education and student eco-cadres'].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#334155', fontWeight: 500 }}>
                      <CheckCircle2 size={15} style={{ color: '#059669', flexShrink: 0 }} />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Our Purpose with Photo Header */}
            <div style={{
              background: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={aboutOurPurposeImg} 
                  alt="Ghat Cleanliness Action and Orientation"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: '12px', left: '16px', background: 'rgba(2, 132, 199, 0.9)', backdropFilter: 'blur(4px)', color: '#ffffff', padding: '4px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Mission In Action
                </div>
              </div>

              <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#eff6ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Target size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Our Purpose
                  </h3>
                </div>

                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
                  To preserve Godavari's ecological sanctity by eliminating floating plastics, fostering sustainable pilgrimage rituals, and inspiring civic ownership.
                </p>

                <div style={{
                  marginTop: 'auto',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem'
                }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Key Focus Areas
                  </span>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.86rem', color: '#334155', fontWeight: 500, lineHeight: 1.4 }}>
                    Ghat cleanliness • Drainage barrier nets • Nirmalya composting
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. REAL-TIME ACTIVITIES PHOTO RIBBON */}
      <section id="initiatives" style={{ padding: '4.5rem 1.5rem', background: '#ffffff', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="clean-badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
              GROUNDWORK IN ACTION
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 0.75rem' }}>
              Our Work Across Godavari
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
              Photographic highlights of our hands-on environmental programs and civic initiatives.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {photoHighlights.map((photo, idx) => (
              <div 
                key={idx}
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={photo.image} 
                    alt={photo.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    {photo.tag}
                  </span>
                </div>
                
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem' }}>
                    {photo.title}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                    {photo.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. WHAT WE STAND FOR (5 PILLARS WITH CRISP IMAGES & LESS MATTER) */}
      <section id="principles" style={{ padding: '4.5rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="clean-badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
              GUIDING PRINCIPLES
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 0.5rem' }}>
              What We Stand For
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: '580px', margin: '0 auto' }}>
              Five foundational values that steer our daily riverfront restoration and volunteer programs.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {standForList.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div>
                    {/* Pillar Image Header */}
                    <div style={{ position: 'relative', height: '145px', overflow: 'hidden' }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: item.color,
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}>
                        {item.tag}
                      </div>
                    </div>

                    <div style={{ padding: '1.25rem 1.25rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: item.bg,
                          color: item.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Icon size={16} />
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                          {item.title}
                        </h4>
                      </div>
                      
                      <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: '0.75rem 1.25rem 1.15rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: item.color
                    }}>
                      <CheckCircle2 size={13} />
                      Active Daily Standard
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. OUR APPROACH & OUR COMMITMENT WITH VISUALS */}
      <section style={{ padding: '4.5rem 1.5rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Our Approach Card with Photo Header */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ position: 'relative', height: '175px', overflow: 'hidden' }}>
                <img
                  src={aboutApproachImg}
                  alt="Our Approach on Godavari Ghats"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: 'rgba(5, 150, 105, 0.95)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: '5px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  Strategy In Action
                </span>
              </div>

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Compass size={18} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Our Approach
                  </h3>
                </div>

                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
                  We bridge science, local governance, and grassroots citizens to implement tangible river restoration.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: 'auto' }}>
                  {['Synchronized dawn volunteer ghat sweeps', 'Outfall bio-net barriers to stop canal plastics', 'Continuous riverfront youth stewardship cadres'].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#334155', fontWeight: 500 }}>
                      <CheckCircle2 size={14} style={{ color: '#059669', flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Our Commitment Card with Photo Header */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ position: 'relative', height: '175px', overflow: 'hidden' }}>
                <img
                  src={aboutCommitmentImg}
                  alt="Our Commitment and Civic Dedication"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: 'rgba(217, 119, 6, 0.95)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: '5px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  Long-Term Promise
                </span>
              </div>

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={18} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Our Commitment
                  </h3>
                </div>

                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
                  Unwavering dedication to keeping the Godavari waters pure, accessible, and ecologically thriving for generations.
                </p>

                <div style={{
                  marginTop: 'auto',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <CheckCircle2 size={15} style={{ color: '#059669', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', color: '#14532d', fontWeight: 600 }}>
                    Every small effort directly protects our sacred river ecosystem.
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. PROFESSIONAL JOIN INITIATIVE CTA */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--footer-secondary, #006B3C)', color: 'var(--footer-heading, #FFFFFF)', borderBottom: '1px solid var(--footer-border, #38845C)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          
          <span style={{
            display: 'inline-block',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#86efac',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '0.35rem 1rem',
            borderRadius: '999px',
            marginBottom: '1rem',
            textTransform: 'uppercase'
          }}>
            BE PART OF THE CHANGE
          </span>

          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, margin: '0 0 1rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Join Our Initiative
          </h2>

          <p style={{ fontSize: '1.1rem', color: '#d1fae5', lineHeight: 1.75, maxWidth: '660px', margin: '0 auto 1.25rem' }}>
            Let us work together to promote cleanliness, protect our environment and create awareness among future generations.
          </p>

          <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#86efac', margin: '0 auto 2.5rem' }}>
            Together for a Cleaner Environment. Together for a Better Future.
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
                padding: '0.9rem 2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
              }}
            >
              <span>Join Our Mission</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/activities"
              className="btn btn-outline btn-lg"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'rgba(255,255,255,0.4)',
                color: '#ffffff',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.9rem 2rem',
                borderRadius: '8px'
              }}
            >
              <span>Explore Our Activities</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutNGO;
