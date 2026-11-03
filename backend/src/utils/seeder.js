import User from '../models/User.js';
import Membership from '../models/Membership.js';
import Event from '../models/Event.js';
import Meeting from '../models/Meeting.js';
import Announcement from '../models/Announcement.js';
import Notification from '../models/Notification.js';
import WebsiteContent from '../models/WebsiteContent.js';

export const seedDatabase = async () => {
  try {
    console.log('Verifying & seeding Godhavari NGO data...');

    // 1. Ensure Admin exists with credentials: admin@gmail.com / admin123
    let admin = await User.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
      admin = await User.create({
        memberId: 'GNPP-2026-0001',
        name: 'Administrator',
        email: 'admin@gmail.com',
        phone: '+91 98480 12345',
        password: 'admin123',
        role: 'admin',
        designation: 'Chief Administrator',
        address: {
          street: 'Main Road',
          city: 'Rajahmundry',
          state: 'Andhra Pradesh',
          pincode: '533101',
        },
      });
      console.log('Created Admin account: admin@gmail.com / admin123');
    } else {
      // Ensure password is set to admin123
      admin.password = 'admin123';
      admin.role = 'admin';
      await admin.save();
      console.log('Updated existing admin password to: admin123');
    }

    // Also check for sample members
    let member1 = await User.findOne({ email: 'lakshmi@example.com' });
    if (!member1) {
      member1 = await User.create({
        memberId: 'GNPP-2026-1002',
        name: 'Smt. P. Lakshmi Devi',
        email: 'lakshmi@example.com',
        phone: '+91 94401 23456',
        password: 'password123',
        role: 'member',
        designation: 'General Secretary',
        bloodGroup: 'B+',
        address: { city: 'Rajahmundry', state: 'Andhra Pradesh' },
      });

      await Membership.create({
        user: member1._id,
        membershipNumber: 'MEM-GNPP-1002',
        membershipType: 'Life Member',
        status: 'Active',
        validFrom: new Date('2026-01-01'),
        validTo: new Date('2051-01-01'),
        feePaid: 5000,
        paymentStatus: 'Paid',
        approvedBy: admin._id,
      });
    }

    let member2 = await User.findOne({ email: 'ramu@example.com' });
    if (!member2) {
      member2 = await User.create({
        memberId: 'GNPP-2026-1003',
        name: 'Sri M. Ramu Naidu',
        email: 'ramu@example.com',
        phone: '+91 98850 34567',
        password: 'password123',
        role: 'volunteer',
        designation: 'Ghat Coordinator',
        bloodGroup: 'O+',
        address: { city: 'Kovvur', state: 'Andhra Pradesh' },
      });

      await Membership.create({
        user: member2._id,
        membershipNumber: 'MEM-GNPP-1003',
        membershipType: 'Volunteer Member',
        status: 'Active',
        validFrom: new Date('2026-01-01'),
        validTo: new Date('2027-01-01'),
        feePaid: 500,
        paymentStatus: 'Paid',
        approvedBy: admin._id,
      });
    }

    // Cleanliness drives
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      await Event.create([
        {
          title: 'Maha Godavari Ghat Cleanliness Drive - Phase IV',
          description: 'Comprehensive plastic and bio-waste eradication drive across Kotilingala and Pushkar Ghats.',
          eventType: 'Cleanliness Drive',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          time: '06:30 AM - 09:30 AM',
          location: {
            venue: 'Kotilingala Ghat Steps',
            city: 'Rajahmundry',
            riverGhat: 'Kotilingala Ghat',
          },
          isPublic: true,
          bannerImage: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800',
          targetVolunteers: 100,
          enrolledVolunteersCount: 42,
          createdBy: admin._id,
        },
        {
          title: 'Nadi Vandanam: Youth River Awareness Walk',
          description: 'Student and citizen awareness march along the Havelock Bridge promoting zero plastic dumping.',
          eventType: 'Awareness Program',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          time: '07:00 AM - 10:30 AM',
          location: {
            venue: 'Havelock Bridge Promenade',
            city: 'Rajahmundry',
          },
          isPublic: true,
          bannerImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
          targetVolunteers: 200,
          enrolledVolunteersCount: 88,
          createdBy: admin._id,
        },
      ]);
    }

    // Announcements
    const announcementCount = await Announcement.countDocuments();
    if (announcementCount === 0) {
      await Announcement.create([
        {
          title: 'Single-Use Plastic Ban Advisory Across River Ghats',
          content: 'Citizens and devotees are kindly requested to strictly avoid plastic bags and bottles during temple rituals. Biodegradable alternatives are available at NGO counters.',
          category: 'Cleanliness Alert',
          priority: 'Urgent',
          visibility: 'All',
          isPublished: true,
          createdBy: admin._id,
        },
        {
          title: 'Digital Membership Identity Cards Issued for 2026',
          content: 'Members can now access their digital ID cards with verifiable registration numbers via the Member Mobile Portal.',
          category: 'General Update',
          priority: 'Important',
          visibility: 'Members Only',
          isPublished: true,
          createdBy: admin._id,
        },
      ]);
    }

    console.log('Seeder check complete. Admin credentials: admin@gmail.com / admin123');
  } catch (err) {
    console.error('Error during seeding:', err.message);
  }
};
