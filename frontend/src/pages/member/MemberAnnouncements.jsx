import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Bell, AlertTriangle, Calendar } from 'lucide-react';

const MemberAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const [annRes, notifRes] = await Promise.all([
          API.get('/member/announcements'),
          API.get('/member/notifications').catch(() => ({ data: [] })),
        ]);
        const annList = Array.isArray(annRes.data) ? annRes.data : [];
        const notifList = Array.isArray(notifRes.data)
          ? notifRes.data.map((n) => ({
              _id: `notif-${n._id}`,
              title: n.title,
              content: n.message,
              category: n.type === 'Membership Update' ? 'General Update' : 'General Update',
              priority: n.type === 'Alert' ? 'Urgent' : 'Important',
              publishedAt: n.createdAt,
            }))
          : [];
        setAnnouncements([...notifList, ...annList]);
      } catch (err) {
        console.error('Failed to load member announcements:', err);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const categories = [
    { label: 'All', value: 'All' },
    { label: 'Cleanliness Alert', value: 'Cleanliness Alert' },
    { label: 'General', value: 'General Update' },
    { label: 'Event Notice', value: 'Event Notice' },
  ];

  const displayedAnnouncements =
    activeCategory === 'All'
      ? announcements
      : announcements.filter((a) => a.category === activeCategory);

  return (
    <div className="member-screen member-notices-screen">
      <div
        className="screen-header member-notices-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <h2 style={{ margin: '0 0 0.25rem' }}>Announcements &amp; Circulars</h2>
          <p className="text-muted text-sm" style={{ margin: 0 }}>
            Official communications, riverfront regulations, and committee updates.
          </p>
        </div>

        <div className="member-notices-pills" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.48rem 1.05rem',
                borderRadius: '9999px',
                border: activeCategory === cat.value ? '1px solid #006B3C' : '1px solid #cbd5e1',
                background: activeCategory === cat.value ? '#006B3C' : '#ffffff',
                color: activeCategory === cat.value ? '#ffffff' : '#173D2B',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading updates...</div>
      ) : displayedAnnouncements.length === 0 ? (
        <div className="app-card text-center p-4">No active announcements in this category.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {displayedAnnouncements.map((a) => {
            const isExpanded = expandedId === a._id;
            const isUrgent = a.priority === 'Urgent';
            const isImportant = a.priority === 'Important';
            const iconBg = isUrgent ? '#fee2e2' : isImportant ? '#fef3c7' : '#e8f5e9';
            const iconColor = isUrgent ? '#dc2626' : isImportant ? '#d97706' : '#006B3C';
            const accentColor = isUrgent ? '#ef4444' : isImportant ? '#f59e0b' : '#006B3C';

            return (
              <div
                key={a._id}
                onClick={() => setExpandedId(isExpanded ? null : a._id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setExpandedId(isExpanded ? null : a._id)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderLeft: `4px solid ${accentColor}`,
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: iconBg,
                    color: iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {isUrgent ? <AlertTriangle size={17} /> : <Bell size={17} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      marginBottom: '0.2rem',
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '0.94rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        lineHeight: 1.35,
                      }}
                    >
                      {a.title}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: '#64748b',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        marginTop: '2px',
                      }}
                    >
                      <Calendar size={11} />
                      {new Date(a.publishedAt || a.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: '0 0 0.45rem',
                      fontSize: '0.83rem',
                      color: '#475569',
                      lineHeight: 1.45,
                      ...(isExpanded
                        ? {}
                        : {
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }),
                    }}
                  >
                    {a.content}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span
                      className={`badge ${
                        isUrgent ? 'badge-danger' : isImportant ? 'badge-amber' : 'badge-blue'
                      }`}
                      style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}
                    >
                      {a.priority}
                    </span>
                    <span
                      className="badge badge-outline"
                      style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}
                    >
                      {a.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MemberAnnouncements;
