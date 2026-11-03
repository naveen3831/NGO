import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Target, Eye, Users, TreeDeciduous, Award, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="clean-page-wrapper">
      {/* Page Header */}
      <div className="clean-page-header">
        <div className="container">
          <span className="clean-badge">ABOUT OUR WORK</span>
          <h1>Protecting & Rejuvenating River Godavari</h1>
          <p className="clean-page-sub">
            The background, founding mission, and core committee behind Godhavari Nadhi Paryavarana
            Parishubratha in Rajahmundry, Andhra Pradesh.
          </p>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <section className="section-padding">
        <div className="container">
          <div className="grid-two-cards">
            <div className="clean-content-box">
              <div className="icon-badge bg-blue-tint">
                <Target size={24} className="text-primary" />
              </div>
              <h2>Our Mission</h2>
              <p>
                To systematically mobilize citizens, youth, and riverfront merchants to maintain
                uncompromising cleanliness across all Godavari ghats, eliminate plastic pollution from
                the riverbed, and safeguard the ecological purity of our sacred waters through
                sustainable community stewardship.
              </p>
            </div>

            <div className="clean-content-box">
              <div className="icon-badge bg-green-tint">
                <Eye size={24} className="text-green" />
              </div>
              <h2>Our Vision</h2>
              <p>
                A pristine, free-flowing, and pollution-free River Godavari celebrated for its biological
                splendor, clean bathing ghats, and deep cultural reverence, guarded vigilantly by every
                riverbank community for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Focus */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="section-title-wrap text-center">
            <span className="sub-tag">AREAS OF ACTION</span>
            <h2>Our Operational Focus</h2>
            <p className="section-lead">Four defined pillars through which we create long-term impact.</p>
          </div>

          <div className="focus-grid-four mt-4">
            <div className="focus-card">
              <span className="focus-step">01</span>
              <h3>Ghat Sanitation</h3>
              <p>
                Routine weekend cleanups across Kotilingala, Pushkar, and Saraswati Ghats collecting and
                segregating temple waste, plastics, and discarded synthetic garments.
              </p>
            </div>

            <div className="focus-card">
              <span className="focus-step">02</span>
              <h3>Canal Plastic Traps</h3>
              <p>
                Installing and servicing river-inlet netting barriers to intercept floating plastic
                bottles and carry bags before they disperse into the mainstream water.
              </p>
            </div>

            <div className="focus-card">
              <span className="focus-step">03</span>
              <h3>Bund Afforestation</h3>
              <p>
                Planting indigenous shade and soil-binding trees (Neem, Peepal, Pongamia) along the river
                embankment to stabilize bunds and restore natural habitats.
              </p>
            </div>

            <div className="focus-card">
              <span className="focus-step">04</span>
              <h3>Eco-Friendly Offerings</h3>
              <p>
                Educating pilgrims and providing leaf bowls and unbaked natural clay immersion
                alternatives to prevent heavy metal and chemical contamination in water.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-padding">
        <div className="container">
          <div className="section-title-wrap text-center">
            <span className="sub-tag">COMMITTEE</span>
            <h2>Executive Leadership</h2>
          </div>

          <div className="clean-team-grid mt-4">
            <div className="clean-team-card">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"
                alt="Dr. K.V. Subba Rao"
                className="team-avatar"
              />
              <h3>Dr. K. V. Subba Rao</h3>
              <span className="team-role">President & Chief Coordinator</span>
              <p className="team-desc">
                Environmental researcher and retired water resources engineer leading river conservation
                strategies in the Godavari delta.
              </p>
            </div>

            <div className="clean-team-card">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200"
                alt="Smt. P. Lakshmi Devi"
                className="team-avatar"
              />
              <h3>Smt. P. Lakshmi Devi</h3>
              <span className="team-role">General Secretary</span>
              <p className="team-desc">
                Pioneering social organizer coordinating volunteer recruitment, youth participation, and
                community awareness initiatives.
              </p>
            </div>

            <div className="clean-team-card">
              <img
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200"
                alt="Sri M. Ramu Naidu"
                className="team-avatar"
              />
              <h3>Sri M. Ramu Naidu</h3>
              <span className="team-role">Field & Ghat Coordinator</span>
              <p className="team-desc">
                Directs on-ground cleanup logistics, safety equipment distribution, and biohazard containment
                during Sunday drives.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
