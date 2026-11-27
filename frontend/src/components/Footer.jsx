import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Globe, Share2, MessageCircle, Video, X } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [legalModal, setLegalModal] = useState(null);

  return (
    <footer className="eco-footer">
      <div className="container">
        <div className="footer-main-grid">
          {/* Column 1: Organization & Identity */}
          <div className="footer-brand-box">
            <div className="footer-brand-title">
              <Link to="/" title="Godhavari Nadhi Paryavarana Parishubratha">
                <Logo variant="light" size={38} />
              </Link>
            </div>
            <p className="footer-tagline">
              Dedicated to preserving the divine purity, ecological vitality, and clean riverbanks of the sacred River Godavari through grassroots community action.
            </p>
            <div className="footer-org-badge">
              <ShieldCheck size={14} className="text-emerald-400 flex-shrink-0" />
              <span>Regd. Non-Profit Society #45/2018</span>
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem' }}>
              {[
                { icon: Globe, label: 'Facebook', href: 'https://facebook.com' },
                { icon: Share2, label: 'Instagram', href: 'https://instagram.com' },
                { icon: MessageCircle, label: 'Twitter', href: 'https://twitter.com' },
                { icon: Video, label: 'YouTube', href: 'https://youtube.com' },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'var(--footer-button)',
                      border: '1px solid var(--footer-border)',
                      color: 'var(--footer-heading)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="footer-nav-col">
            <h4 className="footer-col-heading">Quick Links</h4>
            <ul className="footer-link-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Our NGO</Link></li>
              <li><Link to="/initiatives">Our Initiatives</Link></li>
              <li><Link to="/initiatives?tab=activities">Cleanliness Activities</Link></li>
              <li><Link to="/awareness">Awareness Programs</Link></li>
              <li><Link to="/initiatives?tab=gallery">Photo Gallery</Link></li>
            </ul>
          </div>

          {/* Column 3: Get Involved */}
          <div className="footer-nav-col">
            <h4 className="footer-col-heading">Get Involved</h4>
            <ul className="footer-link-list">
              <li><Link to="/register/volunteer">Volunteer Registration</Link></li>
              <li><Link to="/login">Member Portal Login</Link></li>
              <li><Link to="/initiatives?tab=events">Upcoming Cleanups &amp; Drives</Link></li>
              <li><Link to="/announcements">News & Updates</Link></li>
              <li><Link to="/contact">Contact & Help Desk</Link></li>
            </ul>
          </div>

          {/* Column 4: Secretariat Contact */}
          <div className="footer-nav-col footer-contact-col">
            <h4 className="footer-col-heading">Secretariat</h4>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <MapPin size={15} className="footer-contact-icon" />
                <span>Godavari Bund Road, Opp. Kotilingala Ghat, Rajahmundry - 533101, AP</span>
              </li>
              <li className="footer-contact-item">
                <Phone size={15} className="footer-contact-icon" />
                <a href="tel:+919848012345" className="hover:text-emerald-300 transition">
                  +91 98480 12345 / 0883 245 7890
                </a>
              </li>
              <li className="footer-contact-item">
                <Mail size={15} className="footer-contact-icon" />
                <a href="mailto:contact@godhavari.org" className="hover:text-emerald-300 transition">
                  contact@godhavari.org
                </a>
              </li>
              <li className="footer-contact-item">
                <Clock size={15} className="footer-contact-icon" />
                <span>Mon – Sat: 9:00 AM – 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Clean & Simple Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="container bottom-bar-flex">
          <p className="footer-copyright">
            &copy; {currentYear} Godhavari Nadhi Paryavarana Parishubratha. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.84rem' }}>
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              style={{ background: 'none', border: 'none', color: 'var(--footer-link)', cursor: 'pointer', padding: 0 }}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              style={{ background: 'none', border: 'none', color: 'var(--footer-link)', cursor: 'pointer', padding: 0 }}
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>
      </div>

      {legalModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setLegalModal(null)}
        >
          <div
            style={{
              background: '#ffffff',
              color: '#173D2B',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '1.75rem',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLegalModal(null)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
            <h3 style={{ color: '#006B3C', marginBottom: '0.75rem' }}>
              {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
            </h3>
            <p style={{ lineHeight: 1.7, fontSize: '0.92rem' }}>
              {legalModal === 'privacy'
                ? 'Godhavari Nadhi Paryavarana Parishubratha collects volunteer, member, and contact inquiry details solely for river conservation coordination, event safety communication, and statutory NGO reporting. We never sell or share member data with third parties.'
                : 'Participation in riverbank cleanups and plantation drives is voluntary and follows safety guidelines issued by field coordinators. Donations and membership contributions directly fund ecological restoration along River Godavari.'}
            </p>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
