import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Heart } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="eco-footer">
      <div className="container footer-main-grid">
        {/* Brand Information */}
        <div className="footer-brand-box">
          <div className="footer-brand-title mb-3">
            <Logo variant="light" size={40} />
          </div>
          <p className="footer-tagline">
            Dedicated non-governmental organization committed to preserving the divine purity,
            ecological health, and cleanliness of River Godavari through grassroots citizen action.
          </p>
          <div className="footer-org-badge">
            <span>Regd. Environmental NGO • Rajahmundry, Andhra Pradesh</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="footer-nav-col">
          <h4>Navigation</h4>
          <ul className="footer-link-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/activities">Activities</Link></li>
            <li><Link to="/awareness">Awareness Programs</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/announcements">Announcements</Link></li>
            <li><Link to="/gallery">Photo Gallery</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Portals */}
        <div className="footer-nav-col">
          <h4>Member & Volunteer</h4>
          <ul className="footer-link-list">
            <li><Link to="/login">Member Login</Link></li>
            <li><Link to="/register">Volunteer Registration</Link></li>
            <li><Link to="/events">Join Upcoming Drives</Link></li>
            <li><Link to="/login">Official Portal Access</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-nav-col">
          <h4>Secretariat</h4>
          <div className="footer-contact-row">
            <MapPin size={15} className="text-emerald-400 mt-1 flex-shrink-0" />
            <span>Godavari Bund Road, Opp. Kotilingala Ghat, Rajahmundry - 533101</span>
          </div>
          <div className="footer-contact-row">
            <Phone size={15} className="text-emerald-400 mt-1 flex-shrink-0" />
            <span>+91 883 245 7890 / Helpline: +91 944 012 3456</span>
          </div>
          <div className="footer-contact-row">
            <Mail size={15} className="text-emerald-400 mt-1 flex-shrink-0" />
            <span>contact@godhavari.org</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="container bottom-bar-flex">
          <p>&copy; {new Date().getFullYear()} Godhavari Nadhi Paryavarana Parishubratha. All rights reserved.</p>
          <p className="footer-built-text">
            For the Sacred River Godavari <Heart size={13} className="inline text-emerald-400 ml-1" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
