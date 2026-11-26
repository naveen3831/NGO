import express from 'express';
import { getWebsiteContent } from '../controllers/websiteController.js';
import { getPublicEvents, getEventById } from '../controllers/eventController.js';
import { getPublicAnnouncements } from '../controllers/announcementController.js';
import {
  submitContactMessage,
  getPublicGallery,
  createDonation,
  subscribeNewsletter,
  getPublicAnnouncementById,
} from '../controllers/communityController.js';
import { seedDatabase } from '../utils/seeder.js';

const router = express.Router();

router.get('/content', getWebsiteContent);
router.get('/events', getPublicEvents);
router.get('/events/:id', getEventById);
router.get('/announcements', getPublicAnnouncements);
router.get('/announcements/:id', getPublicAnnouncementById);
router.get('/gallery', getPublicGallery);
router.post('/contact', submitContactMessage);
router.post('/donations', createDonation);
router.post('/newsletter', subscribeNewsletter);

// Endpoint to quickly seed or reset initial NGO data
router.post('/seed', async (req, res, next) => {
  try {
    await seedDatabase();
    res.json({ message: 'Sample Godhavari NGO data seeded successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

