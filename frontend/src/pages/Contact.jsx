import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../services/api';
import HeroBanner from '../components/HeroBanner';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, Globe, Share2, MessageCircle, Video } from 'lucide-react';

const Contact = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await API.post('/public/contact', {
        ...formData,
        subject: formData.subject || 'General Inquiry',
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send message right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="clean-page-wrapper">
      <HeroBanner
        title="Contact Us"
        subtitle="Together for a Cleaner and Greener Godavari"
      />

      <div className="container section-padding">
        <div className="grid-two-cards">
          {/* Secretariat Contact Information */}
          <div id="office" className="clean-content-box" style={{ scrollMarginTop: '100px' }}>
            <h2>Headquarters & Operations</h2>
            <p className="text-muted mb-4">
              Our central office is located on the Godavari Bund Road, directly opposite Kotilingala
              Ghat, serving as the gear hub and volunteer assembly station.
            </p>

            <div className="clean-contact-list">
              <div id="secretariat" className="clean-contact-row" style={{ scrollMarginTop: '100px' }}>
                <div className="contact-bullet-icon bg-blue-tint">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <strong>Secretariat Office</strong>
                  <p>Godavari Bund Road, Opp. Kotilingala Ghat Temple, Rajahmundry, AP - 533101</p>
                </div>
              </div>

              <div id="helpline" className="clean-contact-row" style={{ scrollMarginTop: '100px' }}>
                <div className="contact-bullet-icon bg-green-tint">
                  <Phone size={18} className="text-green" />
                </div>
                <div>
                  <strong>Phone & Helplines</strong>
                  <p>Main Secretariat: +91 883 245 7890</p>
                  <p>Ghat Emergency Helpline: +91 944 012 3456</p>
                </div>
              </div>

              <div className="clean-contact-row">
                <div className="contact-bullet-icon bg-purple-tint">
                  <Mail size={18} className="text-purple" />
                </div>
                <div>
                  <strong>Official Email</strong>
                  <p>contact@godhavari.org</p>
                </div>
              </div>

              <div className="clean-contact-row">
                <div className="contact-bullet-icon bg-amber-tint">
                  <Clock size={18} className="text-amber" />
                </div>
                <div>
                  <strong>Office Hours</strong>
                  <p>Monday - Saturday: 8:30 AM – 6:30 PM</p>
                  <p>Sunday Morning Cleanups: 6:00 AM – 11:30 AM</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem' }}>
              {[
                { icon: Globe, label: 'Facebook', href: 'https://facebook.com' },
                { icon: Share2, label: 'Instagram', href: 'https://instagram.com' },
                { icon: MessageCircle, label: 'Twitter', href: 'https://twitter.com' },
                { icon: Video, label: 'YouTube', href: 'https://youtube.com' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#e8f5e9',
                      color: '#006B3C',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Clean Inquiry Form */}
          <div id="inquiry" className="clean-content-box form-card-box" style={{ scrollMarginTop: '100px' }}>
            <h3>Send an Inquiry</h3>
            {error && (
              <div className="alert-banner alert-danger mb-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            {submitted ? (
              <div className="clean-success-box text-center py-4">
                <CheckCircle size={36} className="text-green mb-2 inline" />
                <h4>Message Received</h4>
                <p className="text-muted mt-1">
                  Thank you for reaching out to Godhavari Nadhi Paryavarana Parishubratha. Our volunteer
                  coordinator will connect with you shortly.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn btn-outline btn-sm mt-3">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="clean-contact-form">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sri / Smt. Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98480 12345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    placeholder="Volunteer Group / Cleanliness Drive"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="How would you like to participate or collaborate?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" disabled={submitting} className="btn btn-primary btn-block">
                  <Send size={15} /> {submitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Google Maps Location */}
        <div className="clean-content-box" style={{ marginTop: '2rem', padding: '1.25rem' }}>
          <h3 style={{ color: '#064e3b', marginBottom: '0.75rem' }}>Our Location on Google Maps</h3>
          <iframe
            title="Godavari Bund Road Rajahmundry Map"
            src="https://www.google.com/maps?q=Kotilingala+Ghat+Rajahmundry+Andhra+Pradesh&output=embed"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '12px' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
