import React from 'react';
import { Link } from 'react-router-dom';
import objHeroShowcaseImg from '../assets/obj-hero-showcase.jpg';
import objOperationalFrameworkImg from '../assets/obj-operational-framework.jpg';
import objPillar1PlasticImg from '../assets/obj-pillar1-plastic.jpg';
import objPillar2BarrierImg from '../assets/obj-pillar2-barrier.jpg';
import objPillar3AfforestationImg from '../assets/obj-pillar3-afforestation.jpg';
import objPillar4FestivalImg from '../assets/obj-pillar4-festival.jpg';
import objPillar5EducationImg from '../assets/obj-pillar5-education.jpg';
import objPillar6WaterQualityImg from '../assets/obj-pillar6-water-quality.jpg';
import objTransparencyAuditImg from '../assets/obj-transparency-audit.jpg';

import { 
  Trash2, 
  Filter, 
  TreeDeciduous, 
  Sparkles, 
  GraduationCap, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Target, 
  Clock, 
  MapPin, 
  HeartHandshake,
  Award,
  Layers,
  Users
} from 'lucide-react';

const objectivesList = [
  {
    num: '01',
    title: 'Eliminate Ghat Plastic Pollution',
    category: 'Ghat Sanitation',
    icon: Trash2,
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    image: objPillar1PlasticImg,
    badge: 'Direct Action',
    desc: 'Conducting bi-weekly cleanliness drives across Kotilingala, Pushkar, and Saraswathi Ghats, segregating plastics and debris for municipal recycling.',
    targets: [
      'Bi-weekly weekend drives per major ghat',
      '100% on-site segregation into recycling',
      'Municipal transport coordination'
    ]
  },
  {
    num: '02',
    title: 'Canal Plastic Barrier Network',
    category: 'Water Interception',
    icon: Filter,
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    image: objPillar2BarrierImg,
    badge: 'Infrastructure',
    desc: 'Installing and maintaining heavy-duty netting barriers across urban drainage inlets in Rajamahendravaram to trap floating waste before it enters the river.',
    targets: [
      '22 active plastic-trap barrier sites',
      'Weekly waste extraction & mesh servicing',
      'GPS mapping & verified tonnage logs'
    ]
  },
  {
    num: '03',
    title: 'Bund Afforestation & Soil Stabilization',
    category: 'Corridor Forestry',
    icon: TreeDeciduous,
    color: '#15803d',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    image: objPillar3AfforestationImg,
    badge: 'Ecosystem Care',
    desc: 'Planting 10,000 indigenous Neem, Peepal, and Pongamia saplings with bamboo guards along eroding river embankments to stabilize bunds.',
    targets: [
      '2,000 native saplings planted yearly',
      'Community youth Tree Guardians',
      'Embankment soil retention surveys'
    ]
  },
  {
    num: '04',
    title: 'Eco-Friendly Festival Practices',
    category: 'Cultural Stewardship',
    icon: Sparkles,
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#e9d5ff',
    image: objPillar4FestivalImg,
    badge: 'Sacred Heritage',
    desc: 'Partnering with riverside temples and local artisans to replace synthetic immersion materials with handcrafted unbaked terracotta lamps and eco-offerings.',
    targets: [
      'Alliances with 50+ ghat temples',
      '10,000+ compostable leaf-plate sets',
      'Volunteer awareness during Pushkaram'
    ]
  },
  {
    num: '05',
    title: 'Community Education & Youth Cadres',
    category: 'Public Awareness',
    icon: GraduationCap,
    color: '#b45309',
    bg: '#fffbeb',
    border: '#fde68a',
    image: objPillar5EducationImg,
    badge: 'Youth Leadership',
    desc: 'Empowering school students and collegiate youth through Haritha Sena eco-clubs, campus environmental rallies, and certified river ambassador leadership.',
    targets: [
      '50 interactive school & college workshops',
      '1,000 youth volunteers trained yearly',
      'Youth leadership river ambassador badges'
    ]
  },
  {
    num: '06',
    title: 'Live Water Quality & Ecological Monitoring',
    category: 'Scientific Auditing',
    icon: Activity,
    color: '#0f766e',
    bg: '#f0fdfa',
    border: '#99f6e4',
    image: objPillar6WaterQualityImg,
    badge: 'Verified Data',
    desc: 'Operating student and citizen-science water testing across bathing ghats, measuring Dissolved Oxygen, pH, and Turbidity with open public metrics.',
    targets: [
      '15 automated water testing stations',
      'Monthly public river health reports',
      'Data shared with civic authorities'
    ]
  }
];

const AboutObjectives = () => {
  return (
    <div className="clean-page-wrapper" style={{ minHeight: '100vh', background: '#ffffff', color: '#1e293b' }}>
      
      {/* 1. SIGNATURE 2-COLUMN HERO (MATCHES ABOUT NGO & MISSION) */}
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
                <span>STRATEGIC FRAMEWORK • SIX ACTION PILLARS</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.1rem, 3.8vw, 3rem)',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
                marginBottom: '0.75rem'
              }}>
                Our Strategic Objectives
              </h1>

              <p style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                color: '#059669',
                fontWeight: 600,
                lineHeight: 1.45,
                marginBottom: '1rem'
              }}>
                Six Action-Driven Pillars for Rejuvenating River Godavari.
              </p>

              <p style={{
                fontSize: '0.98rem',
                color: '#475569',
                lineHeight: 1.75,
                marginBottom: '1.5rem',
                maxWidth: '560px'
              }}>
                Every objective translates our founding mission into measurable, transparent, and community-led 
                conservation programs across the Godavari delta.
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
                  <Layers size={16} color="#059669" />
                  <span>6 Action Pillars</span>
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
                  <ShieldCheck size={16} color="#0284c7" />
                  <span>100% Ground Verification</span>
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
                  <Clock size={16} color="#7c3aed" />
                  <span>Bi-Weekly Cleanups</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <a
                  href="#pillars"
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
                  <span>Explore 6 Pillars</span>
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
                    src={objHeroShowcaseImg}
                    alt="River Godavari Conservation Framework"
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
                    <span>OPERATIONAL ROADMAP</span>
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
                      River Godavari Conservation Framework &amp; Field Directives
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
                    VERIFIED ACTION
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SECTION: OPERATIONAL FRAMEWORK (CONCISE BULLETS + AUTHENTIC PHOTO) */}
      <section id="overview" style={{ padding: '4rem 1.5rem', background: '#ffffff', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            
            {/* Left Column */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>
                <Target size={18} />
                <span>Operational Framework</span>
              </div>
              
              <h2 style={{ fontSize: 'clamp(1.7rem, 2.5vw, 2.2rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, margin: '0 0 1rem' }}>
                Measurable Milestones &amp; Ground Execution
              </h2>
              
              <p style={{ color: '#475569', fontSize: '0.98rem', lineHeight: 1.75, margin: '0 0 1.5rem' }}>
                Pairing grassroots volunteer energy with scientific testing and civic administration support, 
                turning daily conservation drives into lasting regional river revival.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
                {[
                  { title: 'Quantifiable Targets', text: 'Every drive logs weighed bags, sapling counts, and water test indicators.' },
                  { title: 'Civic Administration Link', text: 'Partnering directly with municipal bodies for rapid waste logistics and disposal.' },
                  { title: 'Dedicated Field Captains', text: 'Certified local coordinators leading on-site safety, tools, and volunteer squads.' },
                  { title: 'Open Public Accountability', text: 'Verified data and photos published openly after every community operation.' }
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

              {/* Stat Box Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', display: 'block' }}>100%</span>
                  <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Ground Verification</span>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7', display: 'block' }}>Bi-Weekly</span>
                  <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Ghat Cleanups</span>
                </div>
              </div>
            </div>

            {/* Right Column Photo Card */}
            <div>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0',
                background: '#ffffff'
              }}>
                <img 
                  src={objOperationalFrameworkImg} 
                  alt="On-Site Ghat Weighing and Field Verification" 
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
                      On-Site Digital Weighing &amp; Data Logging Station
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
                    Audited Records
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SIX OBJECTIVES (ALL AUTHENTIC RIVER GODAVARI PHOTOS • NO GENERIC STOCK) */}
      <section id="pillars" style={{ padding: '4.5rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="clean-badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
              TARGET AREAS
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 0.5rem' }}>
              Core Action Objectives
            </h2>
            <p style={{ fontSize: '0.98rem', color: '#64748b', maxWidth: '640px', margin: '0 auto' }}>
              Six focused conservation priorities with verified field methods and target deliverables.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
            gap: '2rem'
          }}>
            {objectivesList.map((obj) => {
              const Icon = obj.icon;
              return (
                <div 
                  key={obj.num}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  {/* Photo Header */}
                  <div style={{ height: '210px', overflow: 'hidden', position: 'relative', background: '#f1f5f9' }}>
                    <img 
                      src={obj.image} 
                      alt={obj.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                      loading="lazy"
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
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {obj.category}
                    </div>

                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      background: '#064e3b',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '6px'
                    }}>
                      PILLAR {obj.num}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '1.65rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '9px',
                        background: obj.bg,
                        color: obj.color,
                        border: `1px solid ${obj.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={20} />
                      </div>
                      <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                        {obj.title}
                      </h3>
                    </div>

                    <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.65, margin: '0 0 1.25rem' }}>
                      {obj.desc}
                    </p>

                    <div style={{
                      marginTop: 'auto',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Target Deliverables
                      </span>
                      {obj.targets.map((target, tIdx) => (
                        <div key={tIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                          <CheckCircle2 size={15} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
                            {target}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. TRANSPARENCY & GOVERNANCE CALLOUT */}
      <section id="accountability" style={{ padding: '4rem 1.5rem', background: '#ffffff', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '2rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            {/* Audit Thumbnail */}
            <div style={{
              width: '130px',
              height: '90px',
              borderRadius: '12px',
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid #e2e8f0'
            }}>
              <img
                src={objTransparencyAuditImg}
                alt="Photographic Audit Trail"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '280px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Transparency &amp; Governance
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.5rem' }}>
                Every Action Is Documented &amp; Verified
              </h3>
              <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: 1.65, margin: 0 }}>
                Our field operations undergo weekly log reviews, photographic audit trails, and open reports 
                so our community of donors, volunteers, and citizens can follow verified progress.
              </p>
            </div>

            <Link
              to="/activities"
              className="btn btn-outline"
              style={{
                backgroundColor: '#ffffff',
                borderColor: '#cbd5e1',
                color: '#0f172a',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                textDecoration: 'none'
              }}
            >
              <span>Explore Live Activities</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
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
            BE PART OF THE CHANGE
          </span>

          <h2 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.85rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Help Us Achieve These Objectives
          </h2>

          <p style={{ fontSize: '1.05rem', color: '#d1fae5', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto 1.25rem' }}>
            Join our growing community of volunteers and make a direct, visible impact on the Godavari River.
          </p>

          <p style={{ fontSize: '1.15rem', fontWeight: 700, color: '#86efac', margin: '0 auto 2.25rem' }}>
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
                padding: '0.85rem 1.85rem',
                borderRadius: '8px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                textDecoration: 'none'
              }}
            >
              <span>Join As Volunteer</span>
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
                padding: '0.85rem 1.85rem',
                borderRadius: '8px',
                textDecoration: 'none'
              }}
            >
              <span>View All Activities</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutObjectives;
