import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import MemberRoute from './components/MemberRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Activities from './pages/Activities';
import AwarenessPrograms from './pages/AwarenessPrograms';
import Events from './pages/Events';
import Announcements from './pages/Announcements';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminEvents from './pages/admin/AdminEvents';
import AdminMeetings from './pages/admin/AdminMeetings';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminNotifications from './pages/admin/AdminNotifications';

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
const PublicLayout = () => (
  <div className="site-wrapper">
    <Navbar />
    <main className="main-content-flow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/awareness" element={<AwarenessPrograms />} />
            <Route path="/events" element={<Events />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/member/login" element={<Login initialRole="member" />} />
            <Route path="/admin/login" element={<Login initialRole="admin" />} />
            <Route path="/register" element={<Register />} />
          </Route>

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
            <Route path="events" element={<AdminEvents />} />
            <Route path="meetings" element={<AdminMeetings />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="notifications" element={<AdminNotifications />} />
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
