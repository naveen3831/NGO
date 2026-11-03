import express from 'express';
import { protect, requireMember } from '../middlewares/authMiddleware.js';
import { getMyMembership, updateMyProfile } from '../controllers/memberController.js';
import { getMemberEvents, enrollInEvent } from '../controllers/eventController.js';
import { getMemberMeetings } from '../controllers/meetingController.js';
import { getMemberAnnouncements } from '../controllers/announcementController.js';
import { getMyNotifications, markNotificationRead } from '../controllers/notificationController.js';
import { getMe } from '../controllers/authController.js';

const router = express.Router();

// Enforce member/authenticated protection
router.use(protect, requireMember);

// Member profile & membership
router.get('/me', getMe);
router.patch('/profile', updateMyProfile);
router.get('/membership', getMyMembership);

// Member events & cleanliness drives
router.get('/events', getMemberEvents);
router.post('/events/:id/enroll', enrollInEvent);

// Member meetings
router.get('/meetings', getMemberMeetings);

// Member announcements
router.get('/announcements', getMemberAnnouncements);

// Member notifications
router.get('/notifications', getMyNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

export default router;

