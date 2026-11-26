import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import HeroBanner from '../components/HeroBanner';
import eventsScheduleCleanImg from '../assets/events-schedule-clean.jpg';
import eventsSchedulePlantImg from '../assets/events-schedule-plant.jpg';
import eventsScheduleMeetImg from '../assets/events-schedule-meet.jpg';
import galleryCleanKotilingalaImg from '../assets/gallery-clean-kotilingala.jpg';
import galleryPlantBundImg from '../assets/gallery-plant-bund.jpg';
import galleryAwarePledgeImg from '../assets/gallery-aware-pledge.jpg';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  CheckCircle2,
  Target,
  Award,
  Sparkles,
} from 'lucide-react';

const sampleEventsById = {
  'sample-drv-1': {
    title: 'River Cleaning Drive — Kotilingala Ghat',
    eventType: 'Cleanliness Drive',
    date: new Date(Date.now() + 86400000 * 3).toISOString(),
    time: '06:30 AM – 09:00 AM',
    location: { venue: 'Kotilingala Ghat, Godavari Bund Road, Rajahmundry' },
    description:
      'Join our sunrise community sanitation drive along the sacred Kotilingala Ghat steps. Volunteers will collect, segregate, and weigh plastic debris and floral offerings for municipal composting.',
    image: eventsScheduleCleanImg,
    objectives: [
      'Clear floating plastic and shoreline litter across 800m of ghat steps',
      'Segregate biodegradable floral offerings for vermi-composting',
      'Engage pilgrims and shopkeepers in zero-plastic riverbank pledges',
    ],
    outcomes: [
      'Over 450 kg of non-biodegradable waste diverted from River Godavari',
      'Clean, safe bathing steps prepared for morning devotees',
      'Volunteer service hours certified for all participants',
    ],
  },
  'sample-drv-2': {
    title: 'Tree Plantation Program — Bund Road Corridor',
    eventType: 'Tree Plantation',
    date: new Date(Date.now() + 86400000 * 7).toISOString(),
    time: '07:00 AM – 10:00 AM',
    location: { venue: 'Godavari Bund Road Greenbelt, Rajahmundry' },
    description:
      'Mass native sapling plantation along vulnerable riverbank embankments featuring Neem, Jamun, Peepal, and Pongamia saplings with protective bamboo tree guards.',
    image: eventsSchedulePlantImg,
    objectives: [
      'Plant 250 indigenous riverbank-stabilizing saplings',
      'Install protective bamboo guards and organic mulch rings',
      'Assign local student eco-captains for weekly watering',
    ],
    outcomes: [
      'Strengthened riparian soil binding against monsoon erosion',
      'Expanded shaded green canopy for riverfront walkers',
    ],
  },
  'sample-drv-3': {
    title: 'Environmental Awareness Rally & River Pledge',
    eventType: 'Awareness Rally',
    date: new Date(Date.now() + 86400000 * 12).toISOString(),
    time: '08:00 AM – 11:00 AM',
    location: { venue: 'Pushkar Ghat to Kambala Cheruvu, Rajahmundry' },
    description:
      'Citizens, school eco-clubs, and youth volunteers march together spreading awareness against single-use plastics and encouraging eco-friendly river traditions.',
    image: galleryAwarePledgeImg,
    objectives: [
      'Distribute 1,500 reusable cloth bags to riverbank visitors',
      'Administer the Nadi Prathijna community river pledge',
      'Demonstrate rapid water quality testing parameters',
    ],
    outcomes: [
      '1,200+ residents reached directly with zero-plastic alternatives',
      'Active student ambassador chapters onboarded across 6 schools',
    ],
  },
  'sample-drv-4': {
    title: 'Yoga for a Green Life & Eco-Wellness Morning',
    eventType: 'Community Wellness',
    date: new Date(Date.now() + 86400000 * 16).toISOString(),
    time: '06:00 AM – 08:30 AM',
    location: { venue: 'Saraswathi Ghat Riverside Lawns, Rajahmundry' },
    description:
      'A rejuvenating sunrise yoga and mindfulness gathering along the banks of River Godavari connecting personal health with environmental stewardship.',
    image: eventsScheduleMeetImg,
    objectives: [
      'Promote holistic wellness in harmony with clean river ecosystems',
      'Host an open community dialogue on sustainable daily habits',
    ],
    outcomes: [
      'Strengthened community volunteer camaraderie and new member sign-ups',
    ],
  },
};

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [joinMsg, setJoinMsg] = useState('');
  const [joinError, setJoinError] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [submittingJoin, setSubmittingJoin] = useState(false);
  const [guestForm, setGuestForm] = useState({ name: '', email: '', phone: '' });

  const handleJoinClick = async () => {
    setJoinError('');
    if (!user) {
      setShowGuestForm(true);
      return;
    }
    setSubmittingJoin(true);
    try {
      const res = await API.post(`/member/events/${id}/enroll`, {
        title: event?.title,
        description: event?.description,
        eventType: event?.eventType,
        date: event?.date,
        time: event?.time,
        location: event?.location,
      });
      setJoined(true);
      setJoinMsg(res.data?.message || 'Your join request has been sent to the Admin Dashboard for approval!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to submit join request.';
      if (msg.toLowerCase().includes('already')) {
        setJoined(true);
        setJoinMsg(msg);
      } else {
        setJoinError(msg);
      }
    } finally {
      setSubmittingJoin(false);
    }
  };

  const handleGuestJoinSubmit = async (e) => {
    e.preventDefault();
    setJoinError('');
    setSubmittingJoin(true);
    try {
      const res = await API.post(`/public/events/${id}/join`, {
        ...guestForm,
        title: event?.title,
        description: event?.description,
        eventType: event?.eventType,
        date: event?.date,
        time: event?.time,
        location: event?.location,
      });
      setJoined(true);
      setShowGuestForm(false);
      setJoinMsg(res.data?.message || 'Your join request has been sent to the Admin Dashboard for approval!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to submit join request.';
      if (msg.toLowerCase().includes('already')) {
        setJoined(true);
        setShowGuestForm(false);
        setJoinMsg(msg);
      } else {
        setJoinError(msg);
      }
    } finally {
      setSubmittingJoin(false);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (sampleEventsById[id]) {
        setEvent(sampleEventsById[id]);
        setLoading(false);
        return;
      }
      try {
        const res = await API.get(`/public/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        setEvent(sampleEventsById['sample-drv-1']);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '6rem 1.5rem', textAlign: 'center', color: '#064e3b' }}>
        Loading event details...
      </div>
    );
  }

  const locationText =
    typeof event?.location === 'object' && event?.location !== null
      ? event.location.venue || event.location.riverGhat || event.location.city || 'Godavari Ghat, Rajahmundry'
      : event?.location || 'Godavari Ghat, Rajahmundry';

  const objectives = event?.objectives || [
    'Mobilize local citizens and youth volunteers for measurable ecological impact',
    'Maintain clean, plastic-free Godavari ghats and embankments',
    'Document waste recovery and water quality outcomes transparently',
  ];

  const outcomes = event?.outcomes || [
    'Cleaner, safer riverbanks for pilgrims and local residents',
    'Certified volunteer service hours and community awareness growth',
  ];

  const schedule = [
    { time: '06:30 AM', activity: 'Volunteer Assembly, Safety Briefing & Gear Distribution' },
    { time: '07:00 AM', activity: 'Main Field Drive & Coordinated Team Execution' },
    { time: '08:30 AM', activity: 'Segregation, Weigh-In Audit & Community Pledge' },
    { time: '09:00 AM', activity: 'Refreshments, Group Photo & Certificate Check-In' },
  ];

  const eventGallery = [galleryCleanKotilingalaImg, galleryPlantBundImg, galleryAwarePledgeImg];

  return (
    <div className="clean-page-wrapper" style={{ background: '#ffffff' }}>
      <HeroBanner
        title={event?.title || 'Drives & Events'}
        subtitle="Together for a Cleaner and Greener Godavari"
      />

      <section className="section-padding" style={{ paddingTop: '1.5rem' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <Link
            to="/events"
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
            <span>Back to All Drives &amp; Events</span>
          </Link>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              alignItems: 'start',
            }}
          >
            {/* Left Main Image & Full Description */}
            <div>
              <div
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                  marginBottom: '1.75rem',
                }}
              >
                <img
                  src={event?.image || eventsScheduleCleanImg}
                  alt={event?.title}
                  style={{ width: '100%', height: '340px', objectFit: 'cover', display: 'block' }}
                />
              </div>

              <div className="clean-content-box" style={{ marginBottom: '1.5rem' }}>
                <span className="clean-badge">{event?.eventType || 'Conservation Drive'}</span>
                <h2 style={{ marginTop: '0.5rem' }}>About This Event</h2>
                <p style={{ lineHeight: 1.75, color: '#334155' }}>
                  {event?.description ||
                    'Join our dedicated volunteers along the sacred River Godavari to restore ghat cleanliness, plant native trees, and build lasting environmental awareness.'}
                </p>
              </div>

              <div className="clean-content-box" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#064e3b' }}>
                  <Target size={18} /> Objectives
                </h3>
                <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.7 }}>
                  {objectives.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>

                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#064e3b', marginTop: '1.5rem' }}>
                  <Award size={18} /> Expected Outcomes
                </h3>
                <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.7 }}>
                  {outcomes.map((out, idx) => (
                    <li key={idx}>{out}</li>
                  ))}
                </ul>
              </div>

              {/* Event Schedule */}
              <div className="clean-content-box">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#064e3b', marginBottom: '1rem' }}>
                  <Clock size={18} /> Event Schedule
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {schedule.map((slot, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        padding: '0.75rem 1rem',
                        background: '#f7fbf7',
                        border: '1px solid #d1fae5',
                        borderRadius: '10px',
                      }}
                    >
                      <strong style={{ color: '#006B3C', minWidth: '80px' }}>{slot.time}</strong>
                      <span style={{ color: '#173D2B' }}>{slot.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar Info Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div
                style={{
                  background: '#f7fbf7',
                  border: '1px solid #d1fae5',
                  borderRadius: '16px',
                  padding: '1.75rem',
                }}
              >
                <h3 style={{ color: '#064e3b', marginBottom: '1rem' }}>Event Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', color: '#173D2B' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Calendar size={18} color="#006B3C" />
                    <span>
                      <strong>Date:</strong>{' '}
                      {new Date(event?.date || Date.now()).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Clock size={18} color="#006B3C" />
                    <span>
                      <strong>Time:</strong> {event?.time || '06:30 AM – 09:00 AM'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <MapPin size={18} color="#006B3C" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>
                      <strong>Location:</strong> {locationText}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Users size={18} color="#006B3C" />
                    <span>
                      <strong>Organized By:</strong> Godhavari Nadhi Paryavarana Parishubratha
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  {joinError && (
                    <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.65rem 0.9rem', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                      {joinError}
                    </div>
                  )}

                  {joined ? (
                    <div
                      style={{
                        background: '#dcfce7',
                        color: '#064e3b',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                      }}
                    >
                      <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                      <span>{joinMsg || 'Your join request has been sent to the Admin Dashboard for approval!'}</span>
                    </div>
                  ) : showGuestForm ? (
                    <form onSubmit={handleGuestJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #d1fae5' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#064e3b' }}>
                        Enter details to send join request to Admin:
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Full Name *"
                        value={guestForm.name}
                        onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                        style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                      />
                      <input
                        type="email"
                        required
                        placeholder="Email Address *"
                        value={guestForm.email}
                        onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                        style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={guestForm.phone}
                        onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                        style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="submit"
                          disabled={submittingJoin}
                          className="btn-hero-join-mission"
                          style={{ flex: 1, justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                        >
                          {submittingJoin ? 'Sending...' : 'Submit Request'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowGuestForm(false)}
                          style={{ padding: '0 0.9rem', borderRadius: '9999px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontSize: '0.82rem' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={handleJoinClick}
                      disabled={submittingJoin}
                      className="btn-hero-join-mission"
                      style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                    >
                      <Sparkles size={16} />
                      <span>{submittingJoin ? 'Sending Request...' : 'Join This Event'}</span>
                    </button>
                  )}

                  <Link
                    to="/register"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      marginTop: '0.75rem',
                      color: '#006B3C',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                    }}
                  >
                    New volunteer? Register as a Member →
                  </Link>
                </div>
              </div>

              {/* Mini Event Gallery */}
              <div className="clean-content-box">
                <h3 style={{ color: '#064e3b', marginBottom: '0.85rem' }}>Event Gallery</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {eventGallery.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Godavari event highlight ${i + 1}`}
                      style={{
                        width: '100%',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetails;

