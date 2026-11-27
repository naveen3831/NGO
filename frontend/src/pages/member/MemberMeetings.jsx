import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Users,
  Clock,
  Calendar,
  MapPin,
  Video,
  Search,
  X,
  Eye,
  RefreshCw,
} from 'lucide-react';

const MemberMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('All');

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const { data } = await API.get('/member/meetings');
        setMeetings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching member meetings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const filtered = meetings.filter((m) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      m.title?.toLowerCase().includes(q) ||
      m.agenda?.toLowerCase().includes(q) ||
      m.location?.toLowerCase().includes(q);
    const matchesMode =
      modeFilter === 'All' ||
      (modeFilter === 'Virtual' && m.isVirtual) ||
      (modeFilter === 'In-Person' && !m.isVirtual);
    return matchesSearch && matchesMode;
  });

  return (
    <div className="ref-members-page">
      {/* Header */}
      <div className="ref-header-section">
        <div className="ref-header-left">
          <div className="ref-header-icon-box">
            <Users size={24} className="text-emerald-700" />
          </div>
          <div>
            <h1 className="ref-page-title">Organizational Meetings</h1>
            <p className="ref-page-subtitle">
              Read-only schedule of executive sessions, volunteer briefings, and community assemblies.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="ref-filter-card" style={{ marginBottom: '1.25rem' }}>
        <div className="ref-search-wrap">
          <Search size={16} className="ref-search-icon" />
          <input
            type="text"
            placeholder="Search meetings by title, agenda, or venue..."
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

        <div className="ref-filter-actions">
          <div className="ref-select-item">
            <span className="ref-select-label">Format:</span>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="ref-select-input"
            >
              <option value="All">All Formats</option>
              <option value="In-Person">In-Person</option>
              <option value="Virtual">Virtual / Online</option>
            </select>
          </div>
        </div>
      </div>

      {/* Meetings Grid */}
      {loading ? (
        <div className="ref-table-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          <RefreshCw size={24} className="animate-spin inline mb-2 text-emerald-700" />
          <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Loading scheduled meetings...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="ref-table-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          No meetings currently scheduled.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: '1.15rem',
          }}
        >
          {filtered.map((m) => {
            const d = new Date(m.date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = d.toLocaleString('default', { month: 'short' });
            return (
              <div
                key={m._id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          background: '#fef3c7',
                          color: '#92400e',
                          border: '1px solid #fde68a',
                          borderRadius: '9999px',
                          padding: '0.2rem 0.7rem',
                          fontSize: '0.73rem',
                          fontWeight: 700,
                        }}
                      >
                        {m.meetingType || 'General Meeting'}
                      </span>
                      <span
                        style={{
                          background: '#f1f5f9',
                          color: '#334155',
                          border: '1px solid #e2e8f0',
                          borderRadius: '9999px',
                          padding: '0.2rem 0.65rem',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                        }}
                      >
                        {m.targetAudience || 'All Members'}
                      </span>
                    </div>

                    <div className="eco-event-date-badge" style={{ flexShrink: 0 }}>
                      <span className="date-badge-day">{day}</span>
                      <span className="date-badge-month">{month}</span>
                    </div>
                  </div>

                  <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.35 }}>
                    {m.title}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', color: '#334155', marginBottom: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} color="#059669" style={{ flexShrink: 0 }} />
                      <span>{d.toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} color="#059669" style={{ flexShrink: 0 }} />
                      <span>{m.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {m.isVirtual ? (
                        <Video size={14} color="#059669" style={{ flexShrink: 0 }} />
                      ) : (
                        <MapPin size={14} color="#059669" style={{ flexShrink: 0 }} />
                      )}
                      <span>{m.location || 'NGO Secretariat Hall'}</span>
                    </div>
                  </div>

                  {m.agenda && (
                    <div
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #f1f5f9',
                        borderRadius: '10px',
                        padding: '0.75rem 0.9rem',
                        fontSize: '0.82rem',
                        color: '#475569',
                        lineHeight: 1.5,
                      }}
                    >
                      <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.2rem', fontSize: '0.78rem' }}>
                        Discussion Agenda
                      </strong>
                      {m.agenda}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    paddingTop: '0.85rem',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      color: '#64748b',
                    }}
                  >
                    <Eye size={13} /> Read-Only
                  </span>

                  {m.isVirtual && m.meetingLink ? (
                    <a
                      href={m.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#008C4A',
                        color: '#ffffff',
                        borderRadius: '8px',
                        padding: '0.38rem 0.85rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      Join Video Link
                    </a>
                  ) : (
                    <span
                      style={{
                        background: '#f0fdf4',
                        color: '#047857',
                        border: '1px solid #bbf7d0',
                        borderRadius: '9999px',
                        padding: '0.2rem 0.7rem',
                        fontSize: '0.73rem',
                        fontWeight: 700,
                      }}
                    >
                      {m.status || 'Scheduled'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MemberMeetings;
