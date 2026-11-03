import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Megaphone, Calendar, AlertCircle } from 'lucide-react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await API.get('/public/announcements');
        setAnnouncements(data || []);
      } catch (err) {
        console.error('Failed to load public announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="clean-page-wrapper">
      <div className="clean-page-header">
        <div className="container">
          <span className="clean-badge">OFFICIAL COMMUNICATIONS</span>
          <h1>Announcements & Circulars</h1>
          <p className="clean-page-sub">
            Verified circulars, river cleanliness advisories, and administrative notices from the NGO.
          </p>
        </div>
      </div>

      <div className="container section-padding">
        {loading ? (
          <div className="text-center py-5">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="empty-state-box">
            <Megaphone size={36} className="text-muted mb-2" />
            <h3>No public announcements at this time</h3>
          </div>
        ) : (
          <div className="clean-bulletin-stack">
            {announcements.map((a) => (
              <div key={a._id} className="clean-bulletin-card">
                <div className="bulletin-top-strip">
                  <div className="bulletin-badges">
                    <span
                      className={`badge ${
                        a.priority === 'Urgent'
                          ? 'badge-danger'
                          : a.priority === 'Important'
                          ? 'badge-amber'
                          : 'badge-blue'
                      }`}
                    >
                      {a.priority}
                    </span>
                    <span className="badge badge-outline">{a.category}</span>
                  </div>
                  <span className="bulletin-date">
                    <Calendar size={13} className="inline mr-1" />
                    {new Date(a.publishedAt || a.createdAt).toLocaleDateString('en-IN', {
                      dateStyle: 'medium',
                    })}
                  </span>
                </div>
                <h2 className="bulletin-title">{a.title}</h2>
                <p className="bulletin-content">{a.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
