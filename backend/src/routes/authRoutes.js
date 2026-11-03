import express from 'express';
import {
  adminLogin,
  memberLogin,
  registerMember,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/member/login', memberLogin);
router.post('/register', registerMember);
router.get('/me', protect, getMe);

export default router;
