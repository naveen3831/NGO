import express from 'express';
import { protect, requireMember } from '../middlewares/authMiddleware.js';
import { getMyMembership, updateMyProfile, requestMembershipTier } from '../controllers/memberController.js';
import { getMemberEvents, enrollInEvent } from '../controllers/eventController.js';
import { getMemberMeetings } from '../controllers/meetingController.js';
import { getMemberAnnouncements, createMemberAnnouncement } from '../controllers/announcementController.js';
import { getMyNotifications, markNotificationRead } from '../controllers/notificationController.js';
import { getMe } from '../controllers/authController.js';

const router = express.Router();

// Enforce member/authenticated protection
router.use(protect, requireMember);

const rejectReadOnlyMutation = (req, res) =>
  res.status(403).json({
    message: 'Read-only access: Member and volunteer dashboards cannot modify records.',
  });

// Member profile & membership (Read-Only)
router.get('/me', getMe);
router.patch('/profile', rejectReadOnlyMutation);
router.get('/membership', getMyMembership);
router.post('/membership/request-tier', rejectReadOnlyMutation);

// Member events & cleanliness drives (Read-Only)
router.get('/events', getMemberEvents);
router.post('/events/:id/enroll', rejectReadOnlyMutation);

// Member meetings (Read-Only)
router.get('/meetings', getMemberMeetings);

// Member announcements (Read-Only)
router.route('/announcements').get(getMemberAnnouncements).post(rejectReadOnlyMutation);

// Member notifications
router.get('/notifications', getMyNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

export default router;

