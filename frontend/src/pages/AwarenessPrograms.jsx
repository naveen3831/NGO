import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users, Award, BookOpen, Droplet, ArrowRight } from 'lucide-react';

const AwarenessPrograms = () => {
  const programs = [
    {
      title: 'Nadi Vandanam: Student River Conservation Rallies',
      description:
        'Mobilizing school and college youth across Rajahmundry, Kovvur, and neighboring mandals through morning rallies, street theater, and youth pledges against plastic dumping into river water.',
      tag: 'Youth Outreach',
      impact: 'Over 5,000+ student participants engaged',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
    },
    {
      title: 'Plastic-Free Riverbank & Merchant Capacity Building',
      description:
        'Engaging with tea stalls, flower merchants, and ritual item vendors along river steps to replace single-use plastic carry bags and thermocol bowls with biodegradable leaf plates.',
      tag: 'Ghat Commerce',
      impact: '200+ riverbank vendors transitioned to eco-alternatives',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600',
    },
    {
      title: 'Water Quality Monitoring & Citizen Science Labs',
      description:
        'Training volunteer citizen teams to test dissolved oxygen, pH, and bacterial levels at multiple ghat locations, making monthly river health indices public and transparent.',
      tag: 'Citizen Science',
      impact: 'Monthly public water quality reports published',
      image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600',
    },
  ];

  return (
    <div className="clean-page-wrapper">
      <div className="clean-page-header">
        <div className="container">
          <span className="clean-badge">EDUCATION & MOBILIZATION</span>
          <h1>Community Awareness Programs</h1>
          <p className="clean-page-sub">
            Empowering students, devotees, and citizens with practical environmental knowledge to
            protect River Godavari.
          </p>
        </div>
      </div>

      <div className="container section-padding">
        <div className="clean-editorial-list">
          {programs.map((prog, idx) => (
            <div key={idx} className="clean-editorial-card">
              <div className="editorial-img-box">
                <img src={prog.image} alt={prog.title} />
              </div>
              <div className="editorial-content-box">
                <span className="badge badge-green mb-2">{prog.tag}</span>
                <h2>{prog.title}</h2>
                <p>{prog.description}</p>
                <div className="editorial-impact-strip">
                  <span className="impact-check">✓</span>
                  <span>{prog.impact}</span>
                </div>
                <div className="mt-3">
                  <Link to="/register" className="btn btn-outline btn-sm">
                    Host or Participate in this Program <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AwarenessPrograms;
