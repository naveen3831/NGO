import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Megaphone,
  Calendar,
  AlertTriangle,
  Search,
  X,
  Eye,
  RefreshCw,
} from 'lucide-react';

const MemberAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

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
              category: 'General Update',
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
    { label: 'General Update', value: 'General Update' },
    { label: 'Event Notice', value: 'Event Notice' },
  ];

  const displayed = announcements.filter((a) => {
    const matchesCat = activeCategory === 'All' || a.category === activeCategory;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      a.title?.toLowerCase().includes(q) ||
      a.content?.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="ref-members-page">
      {/* Header */}
      <div className="ref-header-section">
        <div className="ref-header-left">
          <div className="ref-header-icon-box">
            <Megaphone size={24} className="text-emerald-700" />
          </div>
          <div>
            <h1 className="ref-page-title">Announcements &amp; Circulars</h1>
            <p className="ref-page-subtitle">
              Official communications, riverfront notices, and personal account notifications.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Category Pills */}
      <div className="ref-filter-card" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div className="ref-search-wrap" style={{ minWidth: '220px' }}>
          <Search size={16} className="ref-search-icon" />
          <input
            type="text"
            placeholder="Search announcements and updates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="ref-search-clear"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {categories.map((cat) => {
            const active = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setActiveCategory(cat.value)}
                style={{
                  padding: '0.42rem 0.9rem',
                  borderRadius: '9999px',
                  border: active ? '1px solid #006B3C' : '1px solid #cbd5e1',
                  background: active ? '#006B3C' : '#ffffff',
                  color: active ? '#ffffff' : '#334155',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="ref-table-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          <RefreshCw size={24} className="animate-spin inline mb-2 text-emerald-700" />
          <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Loading announcements...</div>
        </div>
      ) : displayed.length === 0 ? (
        <div className="ref-table-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          No announcements or notifications found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {displayed.map((item) => {
            const isUrgent = item.priority === 'Urgent';
            const d = new Date(item.publishedAt || item.createdAt || Date.now());
            return (
              <div
                key={item._id}
                style={{
                  background: '#ffffff',
                  border: isUrgent ? '1px solid #fecaca' : '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.25rem 1.4rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        background: isUrgent ? '#fef2f2' : '#ecfdf5',
                        color: isUrgent ? '#b91c1c' : '#047857',
                        border: isUrgent ? '1px solid #fecaca' : '1px solid #bbf7d0',
                        borderRadius: '9999px',
                        padding: '0.2rem 0.7rem',
                        fontSize: '0.73rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      {isUrgent && <AlertTriangle size={11} />}
                      {item.category || 'Official Notice'}
                    </span>
                    {item.priority && (
                      <span
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          borderRadius: '9999px',
                          padding: '0.2rem 0.65rem',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                        }}
                      >
                        {item.priority}
                      </span>
                    )}
                  </div>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.78rem',
                      color: '#64748b',
                    }}
                  >
                    <Calendar size={13} />
                    {d.toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 0.45rem', fontSize: '1.02rem', fontWeight: 700, color: '#0f172a' }}>
                  {item.title}
                </h3>
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.87rem', color: '#475569', lineHeight: 1.6 }}>
                  {item.content}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>
                  <Eye size={12} /> Read-Only Notice
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
