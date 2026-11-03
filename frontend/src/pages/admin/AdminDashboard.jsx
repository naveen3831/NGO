import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  Users,
  Calendar,
  Megaphone,
  LayoutTemplate,
  BarChart3,
  ArrowRight,
  Clock,
  MapPin,
  Zap,
  UserPlus,
  CalendarPlus,
  Bell,
  ChevronDown,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('Last 6 Months');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error('Stats fetch error:', err);
        // Fall back gracefully with mock-aligned statistics
        setStats({
          counts: {
            totalMembers: 482,
            totalEvents: 24,
            totalAnnouncements: 18,
            websitePages: 12,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const counts = stats?.counts || {};
  const totalMembers = counts.totalMembers || 482;
  const totalEvents = counts.totalEvents || 24;
  const totalAnnouncements = counts.totalAnnouncements || 18;
  const websitePages = counts.websitePages || 12;

  // Chart data for Membership Growth (May to Oct)
  const chartPoints = [
    { month: 'May', value: 340, x: 50, y: 155 },
    { month: 'Jun', value: 372, x: 135, y: 128 },
    { month: 'Jul', value: 400, x: 220, y: 104 },
    { month: 'Aug', value: 426, x: 305, y: 82 },
    { month: 'Sep', value: 440, x: 390, y: 70 },
    { month: 'Oct', value: 482, x: 475, y: 35 },
  ];

  // SVG path definitions for the line and area gradient
  const svgLinePath = 'M 50 155 C 90 145, 105 132, 135 128 C 175 122, 190 108, 220 104 C 260 98, 275 86, 305 82 C 345 78, 360 72, 390 70 C 430 65, 445 42, 475 35';
  const svgAreaPath = `${svgLinePath} L 475 190 L 50 190 Z`;

  // Upcoming events
  const defaultEvents = [
    {
      id: 1,
      day: '02',
      month: 'Feb',
      title: 'Monthly Members Meeting',
      time: '10:00 AM',
      venue: 'Rajahmundry',
    },
    {
      id: 2,
      day: '26',
      month: 'Jan',
      title: 'Cleanliness Drive',
      time: '07:00 AM',
      venue: 'Godhavari River Bank',
    },
  ];

  const upcomingList = stats?.upcomingEventsList?.length > 0
    ? stats.upcomingEventsList.slice(0, 2).map((evt, idx) => {
        const d = new Date(evt.date);
        return {
          id: evt._id || idx,
          day: String(d.getDate()).padStart(2, '0'),
          month: d.toLocaleString('default', { month: 'short' }),
          title: evt.title,
          time: evt.time || '10:00 AM',
          venue: evt.location?.venue || 'Kotilingala Ghat',
        };
      })
    : defaultEvents;

  return (
    <div className="eco-admin-dashboard-page">
      {/* 1. Scenic Welcome Banner matching user reference image */}
      <section className="eco-welcome-banner-card">
        <div className="eco-banner-text-side">
          <div className="eco-accent-pill-bar"></div>
          <h2 className="eco-welcome-headline">Welcome Back, Admin 👋</h2>
          <p className="eco-welcome-subtext">
            Manage your NGO activities, members, events and updates from a single dashboard.
          </p>
        </div>

        {/* Scenic Godavari River Landscape Background Overlay */}
        <div className="eco-banner-scenic-overlay" aria-hidden="true"></div>
      </section>

      {/* 2. Four Pastel KPI Metric Cards */}
      <section className="eco-kpi-metric-strip">
        {/* Card 1: Total Members */}
        <div className="eco-stat-card eco-stat-green">
          <div className="eco-stat-icon-bubble bg-green-bubble">
            <Users size={22} className="text-green-icon" />
          </div>
          <div className="eco-stat-details">
            <span className="eco-stat-label">Total Members</span>
            <div className="eco-stat-number">{totalMembers}</div>
            <span className="eco-stat-trend text-trend-green">↑ +12 This Month</span>
          </div>
        </div>

        {/* Card 2: Total Events */}
        <div className="eco-stat-card eco-stat-blue">
          <div className="eco-stat-icon-bubble bg-blue-bubble">
            <Calendar size={22} className="text-blue-icon" />
          </div>
          <div className="eco-stat-details">
            <span className="eco-stat-label">Total Events</span>
            <div className="eco-stat-number">{totalEvents}</div>
            <span className="eco-stat-trend text-trend-green">↑ +3 This Month</span>
          </div>
        </div>

        {/* Card 3: Announcements */}
        <div className="eco-stat-card eco-stat-orange">
          <div className="eco-stat-icon-bubble bg-orange-bubble">
            <Megaphone size={22} className="text-orange-icon" />
          </div>
          <div className="eco-stat-details">
            <span className="eco-stat-label">Announcements</span>
            <div className="eco-stat-number">{totalAnnouncements}</div>
            <span className="eco-stat-trend text-trend-green">↑ +4 This Month</span>
          </div>
        </div>

        {/* Card 4: Website Pages */}
        <div className="eco-stat-card eco-stat-purple">
          <div className="eco-stat-icon-bubble bg-purple-bubble">
            <LayoutTemplate size={22} className="text-purple-icon" />
          </div>
          <div className="eco-stat-details">
            <span className="eco-stat-label">Website Pages</span>
            <div className="eco-stat-number">{websitePages}</div>
            <span className="eco-stat-status-badge">
              <span className="status-green-dot"></span> Active
            </span>
          </div>
        </div>
      </section>

      {/* 3. Middle Two-Column Grid: Membership Growth Chart & Upcoming Events */}
      <section className="eco-mid-dashboard-grid">
        {/* Left Column: Membership Growth Chart */}
        <div className="eco-card eco-chart-card">
          <div className="eco-card-header">
            <div className="eco-card-title-lockup">
              <BarChart3 size={18} className="text-emerald-icon" />
              <h3>Membership Growth</h3>
            </div>
            <div className="eco-period-select-wrap">
              <select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value)}
                className="eco-period-dropdown"
              >
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="This Year">This Year</option>
                <option value="All Time">All Time</option>
              </select>
            </div>
          </div>

          <div className="eco-card-body eco-chart-body">
            <svg
              className="eco-growth-chart-svg"
              viewBox="0 0 520 220"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="growthAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="45" y1="35" x2="495" y2="35" stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1="45" y1="70" x2="495" y2="70" stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1="45" y1="105" x2="495" y2="105" stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1="45" y1="140" x2="495" y2="140" stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1="45" y1="175" x2="495" y2="175" stroke="#e2e8f0" strokeDasharray="3 3" />

              {/* Y Axis Labels */}
              <text x="32" y="40" className="chart-axis-label">500</text>
              <text x="32" y="75" className="chart-axis-label">450</text>
              <text x="32" y="110" className="chart-axis-label">400</text>
              <text x="32" y="145" className="chart-axis-label">350</text>
              <text x="32" y="180" className="chart-axis-label">300</text>

              {/* Filled Area Gradient */}
              <path d={svgAreaPath} fill="url(#growthAreaGradient)" />

              {/* Trend Curve Line */}
              <path
                d={svgLinePath}
                fill="none"
                stroke="#16a34a"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {chartPoints.map((pt) => (
                <g key={pt.month}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#15803d"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                  {/* X Axis Month Labels */}
                  <text x={pt.x} y="205" textAnchor="middle" className="chart-month-label">
                    {pt.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Right Column: Upcoming Events */}
        <div className="eco-card eco-events-card">
          <div className="eco-card-header">
            <div className="eco-card-title-lockup">
              <Calendar size={18} className="text-emerald-icon" />
              <h3>Upcoming Events</h3>
            </div>
            <Link to="/admin/events" className="eco-card-view-all-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="eco-card-body eco-events-list">
            {upcomingList.map((evt) => (
              <div key={evt.id} className="eco-event-card-item">
                <div className="eco-event-date-badge">
                  <span className="date-badge-day">{evt.day}</span>
                  <span className="date-badge-month">{evt.month}</span>
                </div>
                <div className="eco-event-info">
                  <h4 className="eco-event-heading">{evt.title}</h4>
                  <div className="eco-event-meta-line">
                    <span className="meta-item">
                      <Clock size={13} className="meta-icon" /> {evt.time}
                    </span>
                    <span className="meta-item">
                      <MapPin size={13} className="meta-icon" /> {evt.venue}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Quick Actions Bar */}
      <section className="eco-quick-actions-section">
        <div className="eco-section-heading-row">
          <Zap size={18} className="text-emerald-icon" />
          <h3 className="eco-section-title">Quick Actions</h3>
        </div>

        <div className="eco-quick-actions-grid">
          <Link to="/admin/members" className="eco-quick-action-tile">
            <UserPlus size={22} className="tile-icon" />
            <span className="tile-text">Add Member</span>
          </Link>

          <Link to="/admin/events" className="eco-quick-action-tile">
            <CalendarPlus size={22} className="tile-icon" />
            <span className="tile-text">Create Event</span>
          </Link>

          <Link to="/admin/announcements" className="eco-quick-action-tile">
            <Megaphone size={22} className="tile-icon" />
            <span className="tile-text">New Announcement</span>
          </Link>

          <Link to="/admin/notifications" className="eco-quick-action-tile">
            <Bell size={22} className="tile-icon" />
            <span className="tile-text">Send Notification</span>
          </Link>

          <Link to="/admin/website" className="eco-quick-action-tile">
            <LayoutTemplate size={22} className="tile-icon" />
            <span className="tile-text">Update Website</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
