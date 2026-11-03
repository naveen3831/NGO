import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Droplet } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="clean-page-wrapper">
      <div className="clean-page-header">
        <div className="container">
          <span className="clean-badge">CONNECT</span>
          <h1>Contact Our Secretariat</h1>
          <p className="clean-page-sub">
            Get in touch for volunteer group coordination, ghat cleanliness sponsorships, or student
            outreach.
          </p>
        </div>
      </div>

      <div className="container section-padding">
        <div className="grid-two-cards">
          {/* Secretariat Contact Information */}
          <div className="clean-content-box">
            <h2>Headquarters & Operations</h2>
            <p className="text-muted mb-4">
              Our central office is located on the Godavari Bund Road, directly opposite Kotilingala
              Ghat, serving as the gear hub and volunteer assembly station.
            </p>

            <div className="clean-contact-list">
              <div className="clean-contact-row">
                <div className="contact-bullet-icon bg-blue-tint">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <strong>Secretariat Office</strong>
                  <p>Godavari Bund Road, Opp. Kotilingala Ghat Temple, Rajahmundry, AP - 533101</p>
                </div>
              </div>

              <div className="clean-contact-row">
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
          </div>

          {/* Clean Inquiry Form */}
          <div className="clean-content-box form-card-box">
            <h3>Send an Inquiry</h3>
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

                <button type="submit" className="btn btn-primary btn-block">
                  <Send size={15} /> Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
