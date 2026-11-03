import express from 'express';
import { getWebsiteContent } from '../controllers/websiteController.js';
import { getPublicEvents, getEventById } from '../controllers/eventController.js';
import { getPublicAnnouncements } from '../controllers/announcementController.js';
import { seedDatabase } from '../utils/seeder.js';

const router = express.Router();

router.get('/content', getWebsiteContent);
router.get('/events', getPublicEvents);
router.get('/events/:id', getEventById);
router.get('/announcements', getPublicAnnouncements);

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

