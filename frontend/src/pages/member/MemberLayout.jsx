import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import MobileBottomNav from '../../components/MobileBottomNav';

const MemberLayout = () => {
  return (
    <div className="site-wrapper">
      <Navbar />

      <main className="main-content-flow" style={{ backgroundColor: '#F7FBF7' }}>
        <div className="member-app-body">
          <Outlet />
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default MemberLayout;
