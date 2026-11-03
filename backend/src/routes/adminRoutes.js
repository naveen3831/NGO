import express from 'express';
import { protect, requireAdmin } from '../middlewares/authMiddleware.js';
import {
  getAllMembers,
  createMemberByAdmin,
  getMemberById,
  updateMemberById,
  updateMembershipStatus,
  deleteMemberById,
} from '../controllers/memberController.js';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getMemberEvents,
} from '../controllers/eventController.js';
import {
  getAllMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from '../controllers/meetingController.js';
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import {
  sendNotification,
  getAllNotifications,
} from '../controllers/notificationController.js';
import {
  getAdminStats,
  updateWebsiteContent,
} from '../controllers/websiteController.js';

const router = express.Router();

// Enforce Admin protection on all routes in this file
router.use(protect, requireAdmin);

// Dashboard Metrics
router.get('/stats', getAdminStats);
router.patch('/content', updateWebsiteContent);

// Members CRUD
router.route('/members').get(getAllMembers).post(createMemberByAdmin);
router
  .route('/members/:id')
  .get(getMemberById)
  .patch(updateMemberById)
  .delete(deleteMemberById);
router.patch('/members/:id/membership', updateMembershipStatus);

// Events CRUD
router.route('/events').get(getMemberEvents).post(createEvent);
router.route('/events/:id').patch(updateEvent).delete(deleteEvent);

// Meetings CRUD
router.route('/meetings').get(getAllMeetings).post(createMeeting);
router.route('/meetings/:id').patch(updateMeeting).delete(deleteMeeting);

// Announcements CRUD
router.route('/announcements').get(getAllAnnouncements).post(createAnnouncement);
router.route('/announcements/:id').patch(updateAnnouncement).delete(deleteAnnouncement);

// Notifications
router.route('/notifications').get(getAllNotifications).post(sendNotification);

export default router;

