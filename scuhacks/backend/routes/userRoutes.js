import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  getAllUsersWithGardens,
  getUserById
} from '../controllers/userController.js';
import {
  getUserProfile,
  getUserProfileWithImages
} from '../controllers/optimizedUserController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);
router.get('/profile/images', protect, getUserProfileWithImages);
router.put('/profile', protect, updateUserProfile);
router.get('/community', getAllUsersWithGardens);
router.get('/:id', protect, getUserById);

export default router;
