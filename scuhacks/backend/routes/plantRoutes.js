import express from 'express';
import { addPlant, getUserGarden, getPlantById, updatePlant, deletePlant } from '../controllers/plantController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected with authentication
router.use(protect);

// CRUD operations
router.route('/')
  .post(addPlant)
  .get(getUserGarden);

router.route('/:id')
  .get(getPlantById)
  .put(updatePlant)
  .delete(deletePlant);

export default router;
