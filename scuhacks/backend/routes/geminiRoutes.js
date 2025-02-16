import express from 'express';
import multer from 'multer';
import { uploadImageAndAnalyze } from '../api/gemini.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for memory storage with file size limit and file filter
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
}).single('image');

// Route to analyze plant image
router.post('/analyze', protect, (req, res) => {
  upload(req, res, async (err) => {
    console.log('🚀 Received request to /api/gemini/analyze');
    
    // Handle multer errors
    if (err instanceof multer.MulterError) {
      console.error('❌ Multer error:', err);
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      console.error('❌ Other upload error:', err);
      return res.status(400).json({ message: err.message });
    }

    try {
      // Log request details
      console.log('📦 Request file:', req.file ? {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : 'Missing');
      
      console.log('👤 User authentication:', req.user ? 'Authenticated' : 'Not authenticated');
      
      if (!req.file) {
        console.log('❌ Error: No image file provided');
        return res.status(400).json({ message: 'No image file provided' });
      }

      if (!req.user) {
        console.log('❌ Error: User not authorized');
        return res.status(401).json({ message: 'Not authorized' });
      }

      console.log('🖼️ Processing image buffer of size:', req.file.size);
      const imageBuffer = req.file.buffer;
      console.log('📤 Sending to Gemini API...');
      const result = await uploadImageAndAnalyze(imageBuffer);
      console.log('✅ Gemini API response received');

      res.json(result);
    } catch (error) {
      console.error('❌ Error in route handler:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ message: error.message || 'Error analyzing image' });
    }
  });
});

export default router;
