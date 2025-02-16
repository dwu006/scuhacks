import express from 'express';
import { registerUser, loginUser, getUserProfile, logoutUser, getAllUsersWithGardens, updateUserProfile} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.get('/community', getAllUsersWithGardens); 
router.put('/profile', protect, updateUserProfile);

export default router;
