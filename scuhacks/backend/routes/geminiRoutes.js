import express from 'express';
import multer from 'multer';
import { uploadImageAndAnalyze } from '../api/gemini.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Route to analyze plant image
router.post('/analyze', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Make sure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const imageBuffer = req.file.buffer;
    const result = await uploadImageAndAnalyze(imageBuffer);

    res.json(result);
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ message: error.message || 'Error analyzing image' });
  }
});

export default router;
