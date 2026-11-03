import express from 'express';
import {
  getCauses,
  getCauseById,
  createCause,
} from '../controllers/causeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCauses).post(protect, createCause);
router.route('/:id').get(getCauseById);

export default router;

