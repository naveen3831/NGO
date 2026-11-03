import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Megaphone, AlertCircle, Calendar } from 'lucide-react';

const MemberAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await API.get('/member/announcements');
        setAnnouncements(data || []);
      } catch (err) {
        console.error('Failed to load member announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="member-screen member-notices-screen">
      <div className="screen-header">
        <h2>Announcements & Circulars</h2>
        <p className="text-muted text-sm">
          Official communications, riverfront regulations, and committee updates.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading updates...</div>
      ) : announcements.length === 0 ? (
        <div className="app-card text-center p-4">No active announcements.</div>
      ) : (
        <div className="notices-stack">
          {announcements.map((a) => (
            <div key={a._id} className="app-card notice-card">
              <div className="notice-header">
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

              <h3 className="notice-title">{a.title}</h3>
              <p className="notice-content">{a.content}</p>

              <div className="notice-footer">
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Calendar size={12} />
                  <span>
                    {new Date(a.publishedAt || a.createdAt).toLocaleDateString('en-IN', {
                      dateStyle: 'medium',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberAnnouncements;

