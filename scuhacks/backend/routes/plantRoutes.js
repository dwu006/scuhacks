import express from 'express';
import multer from 'multer';
import { addPlant, getUserGarden, getPlantById, updatePlant, deletePlant } from '../controllers/plantController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// CRUD operations
router.route('/')
  .post(protect, upload.single('image'), addPlant)  // Protected: Only authenticated users can add plants
  .get(getUserGarden);  // Public: Anyone can view the garden

router.route('/:id')
  .get(getPlantById)  // Public: Anyone can view plant details
  .put(protect, updatePlant)  // Protected: Only authenticated users can update
  .delete(protect, deletePlant);  // Protected: Only authenticated users can delete

export default router;
