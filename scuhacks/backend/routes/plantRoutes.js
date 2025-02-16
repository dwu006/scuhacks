import express from 'express';
import multer from 'multer';
import { addPlant, getUserGarden, getPlantById, updatePlant, deletePlant } from '../controllers/plantController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// All routes require authentication
router.use(protect);

// Plant routes
router.route('/')
  .get(getUserGarden)  // Protected: Only get plants from user's garden array
  .post(upload.single('image'), addPlant);

router.route('/:id')
  .get(getPlantById)
  .put(upload.single('image'), updatePlant)
  .delete(deletePlant);

export default router;
