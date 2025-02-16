import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import plantRoutes from './routes/plantRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
db();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/plants', plantRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Virtual Garden API' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
