import express from 'express';
import {
  adminLogin,
  memberLogin,
  registerMember,
  getMe,
  updateMyAvatar,
} from '../controllers/authController.js';
import { uploadImage } from '../controllers/uploadController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/member/login', memberLogin);
router.post('/register', registerMember);
router.get('/me', protect, getMe);
router.patch('/avatar', protect, updateMyAvatar);
router.post('/upload-image', protect, uploadImage);

export default router;
