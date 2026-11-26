import React from 'react';
import { Link } from 'react-router-dom';
import missionHeroShowcaseImg from '../assets/mission-hero-showcase.jpg';
import missionImmediateActionImg from '../assets/mission-immediate-action.jpg';
import missionFutureVisionImg from '../assets/mission-future-vision.jpg';
import missionValResponsibilityImg from '../assets/mission-val-responsibility.jpg';
import missionValCommunityImg from '../assets/mission-val-community.jpg';
import missionValScienceImg from '../assets/mission-val-science.jpg';
import missionValCultureImg from '../assets/mission-val-culture.jpg';
import missionRoadmapBarrierImg from '../assets/mission-roadmap-barrier.jpg';
import missionRoadmapForestImg from '../assets/mission-roadmap-forest.jpg';
import missionRoadmapDashboardImg from '../assets/mission-roadmap-dashboard.jpg';
import missionRoadmapNetworkImg from '../assets/mission-roadmap-network.jpg';
import missionRoadmapImpactImg from '../assets/mission-roadmap-impact.jpg';

import { 
  Target, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Globe2, 
  Users, 
  BarChart3, 
  HeartHandshake, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  Compass,
  Award,
  Layers,
  Trees,
  Activity
} from 'lucide-react';

const coreValues = [
  {
    title: 'Environmental Responsibility',
    subtitle: 'River Purity & Waste Interception',
    desc: 'Acting as accountable custodians of the sacred Godavari river basin through active waste interception.',
    image: missionValResponsibilityImg,
    badge: 'Ecological Care',
    icon: Globe2,
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0'
  },
  {
    title: 'Community First',
    subtitle: 'Grassroots Citizen Leadership',
    desc: 'Empowering local riverbank residents, student cadres, and merchants to take genuine pride and ownership.',
    image: missionValCommunityImg,
    badge: 'Local Ownership',
    icon: Users,
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd'
  },
  {
    title: 'Science-Based Action',
    subtitle: 'Data-Driven Water Governance',
    desc: 'Grounding every cleanup, tree plantation, and intervention in verified hydrological metrics and lab testing.',
    image: missionValScienceImg,
    badge: 'Verified Data',
    icon: BarChart3,
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#e9d5ff'
  },
  {
    title: 'Cultural Harmony',
    subtitle: 'Preserving Sacred Traditions Safely',
    desc: 'Partnering with pilgrimage priests and devotees to transition from plastic rituals to sustainable eco-offerings.',
    image: missionValCultureImg,
    badge: 'Sacred Heritage',
    icon: HeartHandshake,
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a'
  }
];

const strategicRoadmap = [
  {
    year: '2025',
    phase: 'Phase 01',
    title: 'Canal Plastic-Trap Infrastructure',
    desc: 'Deploying 22 heavy-duty netting barriers across urban drainage canals in Rajamahendravaram to trap floating waste before it reaches the river.',
    image: missionRoadmapBarrierImg,
    status: 'In Progress',
    badgeBg: '#ecfdf5',
    badgeColor: '#047857'
  },
  {
    year: '2026',
    phase: 'Phase 02',
    title: 'Riparian Forest Afforestation',
    desc: 'Planting 10,000 indigenous Neem, Peepal, and Pongamia saplings with bamboo guards along 8 km of vulnerable river embankments.',
    image: missionRoadmapForestImg,
    status: 'Planned',
    badgeBg: '#eff6ff',
    badgeColor: '#1d4ed8'
  },
  {
    year: '2027',
    phase: 'Phase 03',
    title: 'Live Water Quality Dashboard',
    desc: 'Installing automated digital sensing buoys across 15 high-footfall ghats to stream real-time Dissolved Oxygen and pH metrics to citizens.',
    image: missionRoadmapDashboardImg,
    status: 'Planned',
    badgeBg: '#faf5ff',
    badgeColor: '#7c3aed'
  },
  {
    year: '2028',
    phase: 'Phase 04',
    title: 'Basin-Wide Volunteer Network',
    desc: 'Expanding field stewardship cadres to 2,000 certified environmental captains across 20 riverside municipal circles.',
    image: missionRoadmapNetworkImg,
    status: 'Planned',
    badgeBg: '#fffbeb',
    badgeColor: '#b45309'
  },
  {
    year: '2030',
    phase: 'Phase 05',
    title: '60% Net Pollution Reduction',
    desc: 'Achieving a certified 60% reduction in plastic pollution across all major pilgrimage ghats, creating a national benchmark for community river restoration.',
    image: missionRoadmapImpactImg,
    status: 'Target Milestone',
    badgeBg: '#f0fdfa',
    badgeColor: '#0f766e'
  }
];

const AboutMission = () => {
  return (
    <div className="clean-page-wrapper" style={{ minHeight: '100vh', background: '#ffffff', color: '#1e293b' }}>
      
      {/* 1. SIGNATURE 2-COLUMN HERO (MATCHES ABOUT NGO & ANNOUNCEMENTS PAGES) */}
      <section style={{
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        padding: '3rem 1.5rem 2.5rem'
      }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            {/* Left Column: Info & Action */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#ecfdf5',
                color: '#059669',
                padding: '0.4rem 0.9rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '0.85rem',
                border: '1px solid #a7f3d0'
              }}>
                <Sparkles size={14} />
                <span>FOUNDATIONAL CHARTER • OUR MISSION &amp; VISION</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.1rem, 3.8vw, 3rem)',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
                marginBottom: '0.75rem'
              }}>
                Our Mission &amp; Vision
              </h1>

              <p style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                color: '#059669',
                fontWeight: 600,
                lineHeight: 1.45,
                marginBottom: '1rem'
              }}>
                The Guiding Principles and Long-Term Aspirations Behind Our Conservation Movement.
              </p>

              <p style={{
                fontSize: '0.98rem',
                color: '#475569',
                lineHeight: 1.75,
                marginBottom: '1.5rem',
                maxWidth: '560px'
              }}>
                Every volunteer initiative, community drive, and environmental policy of Godhavari Nadhi Paryavarana Parishubratha 
                is anchored in a clear roadmap for lasting ecological revival across the river basin.
              </p>

              {/* Three Stat Badges */}
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap',
                marginBottom: '1.75rem'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.84rem',
                  color: '#334155',
                  fontWeight: 600
                }}>
                  <Target size={16} color="#059669" />
                  <span>2030 Net-Zero Plastic</span>
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.84rem',
                  color: '#334155',
                  fontWeight: 600
                }}>
                  <Users size={16} color="#0284c7" />
                  <span>5,000+ Volunteer Cadre</span>
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.84rem',
                  color: '#334155',
                  fontWeight: 600
                }}>
                  <ShieldCheck size={16} color="#7c3aed" />
                  <span>15+ Monitored Ghats</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <a
                  href="#values"
                  className="btn btn-primary"
                  style={{
                    backgroundColor: '#059669',
                    borderColor: '#059669',
                    color: '#ffffff',
                    fontWeight: 600,
                    padding: '0.65rem 1.35rem',
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none'
                  }}
                >
                  <span>Explore Core Values</span>
                  <ArrowRight size={16} />
                </a>
                <Link
                  to="/register"
                  className="btn btn-outline"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    color: '#334155',
                    fontWeight: 600,
                    padding: '0.65rem 1.35rem',
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none'
                  }}
                >
                  <span>Join As Volunteer</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Showcase Card */}
            <div>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                position: 'relative'
              }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={missionHeroShowcaseImg}
                    alt="River Godavari Conservation Stewardship"
                    style={{
                      width: '100%',
                      height: '350px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: 'rgba(6, 78, 59, 0.92)',
                    backdropFilter: 'blur(4px)',
                    color: '#86efac',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Sparkles size={13} />
                    <span>STRATEGIC CHARTER</span>
                  </div>
                </div>

                <div style={{
                  padding: '0.85rem 1.25rem',
                  background: '#ffffff',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#1e293b' }}>
                      Dawn Stewardship &amp; Conservation Briefing — River Godavari
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#059669',
                    background: '#ecfdf5',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    border: '1px solid #a7f3d0',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap'
                  }}>
                    CHARTER 2030
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SECTION: IMMEDIATE MISSION (CONCISE BULLETS + AUTHENTIC PHOTO) */}
      <section id="mission" style={{ padding: '4rem 1.5rem', background: '#ffffff', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            
            {/* Left Content */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>
                <Target size={18} />
                <span>Immediate Mission</span>
              </div>
              
              <h2 style={{ fontSize: 'clamp(1.7rem, 2.5vw, 2.2rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, margin: '0 0 1rem' }}>
                Mobilizing Communities for Direct Action
              </h2>
              
              <p style={{ color: '#475569', fontSize: '0.98rem', lineHeight: 1.75, margin: '0 0 1.5rem' }}>
                Systematically organizing citizens, students, and riverside vendors to maintain clean bathing ghats, 
                intercept trash before it enters the stream, and safeguard river health.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {[
                  { title: 'Bi-Weekly Cleanliness Drives', text: 'Hands-on weekend waste collection across Kotilingala, Pushkar, and Saraswathi Ghats.' },
                  { title: 'Canal Netting Barriers', text: 'Installing floating net catchers at storm-water drainage outlets to stop plastic pollution.' },
                  { title: 'Eco-Friendly Pilgrimage Guidance', text: 'Educating devotees and vendors on biodegradable leaf plates and terracotta offerings.' },
                  { title: 'Grassroots Stewardship Cadre', text: 'Training 5,000 certified youth leaders as regional river protectors by 2030.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{item.title}: </strong>
                      <span style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6 }}>{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Photo */}
            <div>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0',
                background: '#ffffff'
              }}>
                <img 
                  src={missionImmediateActionImg} 
                  alt="Active Godavari Cleanliness Drive" 
                  style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
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
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#1e293b' }}>
                      Active Ghat Cleanliness &amp; Bagging — Rajamahendravaram
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
                    Direct Action
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SECTION: OUR VISION (PANORAMIC RIVER PHOTO + CONCISE TARGETS) */}
      <section id="vision" style={{ padding: '4rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            
            {/* Left Photo */}
            <div>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0',
                background: '#ffffff'
              }}>
                <img 
                  src={missionFutureVisionImg} 
                  alt="Pristine River Godavari Landscape at Dawn" 
                  style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  padding: '0.85rem 1.25rem',
                  background: '#ffffff',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#1e293b' }}>
                      Sacred River Godavari Basin — Panoramic Ecological Revival
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#0369a1',
                    background: '#f0f9ff',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    border: '1px solid #bae6fd',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap'
                  }}>
                    Future Vision
                  </span>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>
                <Eye size={18} />
                <span>Our Vision</span>
              </div>
              
              <h2 style={{ fontSize: 'clamp(1.7rem, 2.5vw, 2.2rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, margin: '0 0 1rem' }}>
                Enduring River Health for Future Generations
              </h2>
              
              <p style={{ color: '#475569', fontSize: '0.98rem', lineHeight: 1.75, margin: '0 0 1.5rem' }}>
                A clean, free-flowing, and living River Godavari guarded with vigilance by local communities, 
                blending deep spiritual reverence with rigorous ecological responsibility.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {[
                  { title: 'Zero Single-Use Plastic', text: 'Plastic-free ghat embankments and pilgrimage corridors throughout the district.' },
                  { title: 'Native Riparian Forest Canopy', text: 'Restoring green tree corridors along 8+ km of vulnerable river embankments.' },
                  { title: 'Thriving Aquatic Ecology', text: 'Improving dissolved oxygen levels to safeguard indigenous fish and aquatic flora.' },
                  { title: 'Benchmark River Rejuvenation', text: 'Creating an inspiring, verifiable civic conservation blueprint for rivers across India.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckCircle2 size={18} color="#0284c7" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{item.title}: </strong>
                      <span style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6 }}>{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SECTION: CORE VALUES (NOW WITH DEDICATED AUTHENTIC PHOTOS FOR EACH VALUE) */}
      <section id="values" style={{ padding: '4.5rem 1.5rem', background: '#ffffff', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="clean-badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
              WHAT DRIVES US
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 0.5rem' }}>
              Our Core Values
            </h2>
            <p style={{ fontSize: '0.98rem', color: '#64748b', maxWidth: '620px', margin: '0 auto' }}>
              Four foundational tenets that define how our volunteers, coordinators, and trustees work, lead, and serve.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem'
          }}>
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div 
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  {/* Photo Header with Badge Overlay */}
                  <div style={{ position: 'relative', height: '175px', overflow: 'hidden' }}>
                    <img 
                      src={val.image} 
                      alt={val.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    <div style={{
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
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase'
                    }}>
                      {val.badge}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: val.bg,
                        color: val.color,
                        border: `1px solid ${val.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={19} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                          {val.title}
                        </h4>
                        <span style={{ fontSize: '0.76rem', color: val.color, fontWeight: 600 }}>
                          {val.subtitle}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                      {val.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. SECTION: STRATEGIC ROADMAP 2025–2030 (WITH VISUAL MILESTONE PHOTOS) */}
      <section id="roadmap" style={{ padding: '4.5rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="clean-badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
              STRATEGIC ROADMAP
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 0.5rem' }}>
              Strategic Goals 2025–2030
            </h2>
            <p style={{ fontSize: '0.98rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
              A structured five-year operational roadmap to accelerate ecological conservation impact.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {strategicRoadmap.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  flexWrap: 'wrap'
                }}
              >
                {/* Year Pill */}
                <div style={{
                  background: '#064e3b',
                  color: '#ffffff',
                  borderRadius: '10px',
                  padding: '0.65rem 1rem',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  letterSpacing: '0.02em',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '85px'
                }}>
                  <span>{item.year}</span>
                  <span style={{ fontSize: '0.68rem', color: '#86efac', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>
                    {item.phase}
                  </span>
                </div>

                {/* Milestone Thumbnail Photo */}
                <div style={{
                  width: '120px',
                  height: '80px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1px solid #e2e8f0',
                  background: '#f1f5f9'
                }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      {item.title}
                    </h3>
                    <span style={{
                      background: item.badgeBg,
                      color: item.badgeColor,
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {item.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
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
            COLLABORATE FOR CONSERVATION
          </span>

          <h2 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.85rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Aligned With Our Mission?
          </h2>

          <p style={{ fontSize: '1.05rem', color: '#d1fae5', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto 1.25rem' }}>
            Explore our daily objectives or join our community of dedicated stewards along the sacred Godavari.
          </p>

          <p style={{ fontSize: '1.15rem', fontWeight: 700, color: '#86efac', margin: '0 auto 2.25rem' }}>
            Together for a Cleaner River. Together for a Better Tomorrow.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/about/objectives"
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
              <span>View Our Objectives</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/register"
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
              <span>Join As Volunteer</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutMission;
