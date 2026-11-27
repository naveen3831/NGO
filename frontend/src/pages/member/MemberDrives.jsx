import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Shield,
  Search,
  X,
  Eye,
  RefreshCw,
} from 'lucide-react';

const MemberDrives = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await API.get('/member/events');
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load member events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const eventTypes = ['All', ...Array.from(new Set(events.map((e) => e.eventType).filter(Boolean)))];

  const filtered = events.filter((evt) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      evt.title?.toLowerCase().includes(q) ||
      evt.description?.toLowerCase().includes(q) ||
      evt.location?.venue?.toLowerCase().includes(q);
    const matchesType = typeFilter === 'All' || evt.eventType === typeFilter;
    return matchesSearch && matchesType;
  });

  const upcomingCount = events.filter((e) => (e.status || 'Upcoming') === 'Upcoming').length;
  const totalVolunteers = events.reduce((acc, e) => acc + (e.enrolledVolunteersCount || 0), 0);

  return (
    <div className="ref-members-page">
      {/* Header */}
      <div className="ref-header-section">
        <div className="ref-header-left">
          <div className="ref-header-icon-box">
            <Calendar size={24} className="text-emerald-700" />
          </div>
          <div>
            <h1 className="ref-page-title">Drives &amp; Events</h1>
            <p className="ref-page-subtitle">
              Read-only schedule of riverbank cleanups, plantation drives, and community awareness events.
            </p>
          </div>
        </div>
      </div>

      {/* Compact KPI Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div className="ref-kpi-card">
          <div className="ref-kpi-icon-bubble ref-bubble-green">
            <Calendar size={20} className="text-emerald-600" />
          </div>
          <div className="ref-kpi-details">
            <span className="ref-kpi-value">{events.length}</span>
            <span className="ref-kpi-label">Total Drives</span>
          </div>
        </div>

        <div className="ref-kpi-card">
          <div className="ref-kpi-icon-bubble ref-bubble-blue">
            <Clock size={20} className="text-blue-600" />
          </div>
          <div className="ref-kpi-details">
            <span className="ref-kpi-value">{upcomingCount}</span>
            <span className="ref-kpi-label">Upcoming Drives</span>
          </div>
        </div>

        <div className="ref-kpi-card">
          <div className="ref-kpi-icon-bubble ref-bubble-purple">
            <Users size={20} className="text-purple-600" />
          </div>
          <div className="ref-kpi-details">
            <span className="ref-kpi-value">{totalVolunteers}</span>
            <span className="ref-kpi-label">Total Volunteers</span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="ref-filter-card" style={{ marginBottom: '1.25rem' }}>
        <div className="ref-search-wrap">
          <Search size={16} className="ref-search-icon" />
          <input
            type="text"
            placeholder="Search drives by title, venue, or description..."
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
            <span className="ref-select-label">Category:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="ref-select-input"
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All Categories' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="ref-table-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          <RefreshCw size={24} className="animate-spin inline mb-2 text-emerald-700" />
          <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Loading scheduled drives...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="ref-table-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          No drives or events found matching your criteria.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: '1.15rem',
          }}
        >
          {filtered.map((evt) => {
            const d = new Date(evt.date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = d.toLocaleString('default', { month: 'short' });
            return (
              <div
                key={evt._id}
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
                          background: '#ecfdf5',
                          color: '#047857',
                          border: '1px solid #bbf7d0',
                          borderRadius: '9999px',
                          padding: '0.2rem 0.7rem',
                          fontSize: '0.73rem',
                          fontWeight: 700,
                        }}
                      >
                        {evt.eventType || 'Cleanliness Drive'}
                      </span>
                      {evt.isMemberOnly && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            background: '#fef3c7',
                            color: '#92400e',
                            border: '1px solid #fde68a',
                            borderRadius: '9999px',
                            padding: '0.2rem 0.65rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                          }}
                        >
                          <Shield size={11} /> Member Exclusive
                        </span>
                      )}
                    </div>

                    <div className="eco-event-date-badge" style={{ flexShrink: 0 }}>
                      <span className="date-badge-day">{day}</span>
                      <span className="date-badge-month">{month}</span>
                    </div>
                  </div>

                  <h3 style={{ margin: '0 0 0.45rem', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.35 }}>
                    {evt.title}
                  </h3>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#475569', lineHeight: 1.55 }}>
                    {evt.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', color: '#334155' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} color="#059669" style={{ flexShrink: 0 }} />
                      <span>
                        {d.toLocaleDateString('en-IN', { dateStyle: 'medium' })} • {evt.time}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={14} color="#059669" style={{ flexShrink: 0 }} />
                      <span>{evt.location?.venue || 'Kotilingala Ghat'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={14} color="#059669" style={{ flexShrink: 0 }} />
                      <span>{evt.enrolledVolunteersCount || 0} registered volunteers</span>
                    </div>
                  </div>
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
                    {evt.status || 'Upcoming'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MemberDrives;
