import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactToggleWidget from './components/ContactToggleWidget';
import MobileBottomNav from './components/MobileBottomNav';
import AdminRoute from './components/AdminRoute';
import MemberRoute from './components/MemberRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import AboutNGO from './pages/AboutNGO';
import AboutMission from './pages/AboutMission';
import AboutObjectives from './pages/AboutObjectives';
import Initiatives from './pages/Initiatives';
import Activities from './pages/Activities';
import ActivityCleanliness from './pages/activities/ActivityCleanliness';
import ActivityPlantation from './pages/activities/ActivityPlantation';
import ActivityConservation from './pages/activities/ActivityConservation';
import ActivityCommunity from './pages/activities/ActivityCommunity';
import AwarenessPrograms from './pages/AwarenessPrograms';
import AwarenessSchools from './pages/awareness/AwarenessSchools';
import AwarenessWorkshops from './pages/awareness/AwarenessWorkshops';
import AwarenessCampaigns from './pages/awareness/AwarenessCampaigns';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import EventsUpcoming from './pages/events/EventsUpcoming';
import EventsVolunteerMeetings from './pages/events/EventsVolunteerMeetings';
import EventsPastReports from './pages/events/EventsPastReports';
import Announcements from './pages/Announcements';
import AnnouncementDetails from './pages/AnnouncementDetails';
import AnnouncementsNews from './pages/announcements/AnnouncementsNews';
import AnnouncementsPress from './pages/announcements/AnnouncementsPress';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminMemberships from './pages/admin/AdminMemberships';
import AdminEvents from './pages/admin/AdminEvents';
import AdminMeetings from './pages/admin/AdminMeetings';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminWebsite from './pages/admin/AdminWebsite';
import AdminReports from './pages/admin/AdminReports';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSettings from './pages/admin/AdminSettings';
import AdminGallery from './pages/admin/AdminGallery';
import AdminContacts from './pages/admin/AdminContacts';
import AdminDonations from './pages/admin/AdminDonations';

// Member Pages
import MemberLayout from './pages/member/MemberLayout';
import MemberHome from './pages/member/MemberHome';
import MemberCard from './pages/member/MemberCard';
import MemberDrives from './pages/member/MemberDrives';
import MemberMeetings from './pages/member/MemberMeetings';
import MemberAnnouncements from './pages/member/MemberAnnouncements';
import MemberProfile from './pages/member/MemberProfile';

import './App.css';

// Public layout wrapper with Navbar & Footer
const PublicLayout = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: '#0f4a38', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }


  return (
    <div className="site-wrapper">
      <Navbar />
      <main className="main-content-flow">
        <Outlet />
      </main>
      <Footer />
      <ContactToggleWidget />
      <MobileBottomNav />
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutNGO />} />
            <Route path="/about/ngo" element={<AboutNGO />} />
            <Route path="/about/mission" element={<AboutMission />} />
            <Route path="/about/objectives" element={<AboutObjectives />} />
            <Route path="/initiatives" element={<Initiatives />} />
            <Route path="/activities" element={<Initiatives initialTab="activities" />} />
            <Route path="/activities/cleanliness" element={<ActivityCleanliness />} />
            <Route path="/activities/plantation" element={<ActivityPlantation />} />
            <Route path="/activities/conservation" element={<ActivityConservation />} />
            <Route path="/activities/community" element={<ActivityCommunity />} />
            <Route path="/awareness" element={<AwarenessPrograms />} />
            <Route path="/awareness/schools" element={<AwarenessSchools />} />
            <Route path="/awareness/workshops" element={<AwarenessWorkshops />} />
            <Route path="/awareness/campaigns" element={<AwarenessCampaigns />} />
            <Route path="/events" element={<Initiatives initialTab="events" />} />
            <Route path="/events/upcoming" element={<EventsUpcoming />} />
            <Route path="/events/volunteer-meetings" element={<EventsVolunteerMeetings />} />
            <Route path="/events/past-reports" element={<EventsPastReports />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/announcements/news" element={<AnnouncementsNews />} />
            <Route path="/announcements/press" element={<AnnouncementsPress />} />
            <Route path="/announcements/:id" element={<AnnouncementDetails />} />
            <Route path="/gallery" element={<Initiatives initialTab="gallery" />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Standalone Authentication - Split Screen Design matching User Requirement */}
          <Route path="/login" element={<Login />} />
          <Route path="/member/login" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Dashboard Protected Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="memberships" element={<Navigate to="/admin/members" replace />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="meetings" element={<AdminMeetings />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="website" element={<AdminWebsite />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Member Mobile Portal Protected Routes */}
          <Route
            path="/member"
            element={
              <MemberRoute>
                <MemberLayout />
              </MemberRoute>
            }
          >
            <Route index element={<MemberHome />} />
            <Route path="card" element={<MemberCard />} />
            <Route path="drives" element={<MemberDrives />} />
            <Route path="meetings" element={<MemberMeetings />} />
            <Route path="announcements" element={<MemberAnnouncements />} />
            <Route path="profile" element={<MemberProfile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
