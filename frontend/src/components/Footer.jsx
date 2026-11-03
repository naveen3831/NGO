import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="clean-footer">
      <div className="container footer-main-grid">
        {/* Brand Information */}
        <div className="footer-brand-box">
          <div className="footer-brand-title">
            <Droplet size={20} className="footer-droplet-icon" />
            <div>
              <h3>Godhavari Nadhi</h3>
              <span className="footer-brand-sub">Paryavarana Parishubratha</span>
            </div>
          </div>
          <p className="footer-tagline">
            Dedicated non-governmental organization committed to preserving the divine purity,
            ecological health, and cleanliness of River Godavari through grassroots action.
          </p>
          <div className="footer-org-badge">
            <span>Regd. NGO • Rajahmundry, Andhra Pradesh</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="footer-nav-col">
          <h4>Organization</h4>
          <ul className="footer-link-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Mission</Link></li>
            <li><Link to="/activities">Cleanliness Drives</Link></li>
            <li><Link to="/awareness">Awareness Rallies</Link></li>
            <li><Link to="/events">Events Calendar</Link></li>
          </ul>
        </div>

        {/* Portals */}
        <div className="footer-nav-col">
          <h4>Digital Services</h4>
          <ul className="footer-link-list">
            <li><Link to="/member/login">Member Mobile Portal</Link></li>
            <li><Link to="/register">Volunteer Registration</Link></li>
            <li><Link to="/admin/login">Admin Dashboard</Link></li>
            <li><Link to="/announcements">Public Bulletins</Link></li>
            <li><Link to="/contact">Contact Secretariat</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-nav-col">
          <h4>Secretariat</h4>
          <div className="footer-contact-row">
            <MapPin size={15} className="text-primary mt-1 flex-shrink-0" />
            <span>Godavari Bund Road, Opp. Kotilingala Ghat, Rajahmundry - 533101</span>
          </div>
          <div className="footer-contact-row">
            <Phone size={15} className="text-primary mt-1 flex-shrink-0" />
            <span>+91 883 245 7890 / Helpline: +91 944 012 3456</span>
          </div>
          <div className="footer-contact-row">
            <Mail size={15} className="text-primary mt-1 flex-shrink-0" />
            <span>contact@godhavari.org</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="container bottom-bar-flex">
          <p>&copy; {new Date().getFullYear()} Godhavari Nadhi Paryavarana Parishubratha. All rights reserved.</p>
          <p className="footer-built-text">
            For the Sacred River Godavari <Heart size={13} className="inline text-danger ml-1" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
