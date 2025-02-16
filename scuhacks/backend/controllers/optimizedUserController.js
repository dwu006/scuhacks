import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};

// Calculate garden statistics
const calculateGardenStats = (garden) => {
  const stats = {
    totalPlants: 0,
    uniquePlants: garden.length,
    totalCO2: 0,
    popularPlants: [],
    topCO2Plants: []
  };

  // Calculate totals
  stats.totalPlants = garden.reduce((total, plant) => {
    const quantity = Number(plant.quantity) || 1;
    const co2Value = Number(plant.co2Reduced) || 0;
    stats.totalCO2 += co2Value * quantity;
    return total + quantity;
  }, 0);

  // Calculate popular plants
  stats.popularPlants = [...garden]
    .sort((a, b) => (b.quantity || 1) - (a.quantity || 1))
    .slice(0, 3)
    .map(plant => ({
      name: plant.name.match(/\((.*?)\)/)?.[1] || plant.name,
      quantity: plant.quantity || 1
    }));

  // Calculate top CO2 reducing plants
  stats.topCO2Plants = [...garden]
    .sort((a, b) => {
      const aCO2 = (a.co2Reduced || 0) * (a.quantity || 1);
      const bCO2 = (b.co2Reduced || 0) * (b.quantity || 1);
      return bCO2 - aCO2;
    })
    .slice(0, 3)
    .map(plant => ({
      name: plant.name.match(/\((.*?)\)/)?.[1] || plant.name,
      co2Reduced: (plant.co2Reduced || 0) * (plant.quantity || 1)
    }));

  return stats;
};

// Get user profile with optimized garden population
export const getUserProfile = async (req, res) => {
  try {
    // Use lean() for faster query execution
    const user = await User.findById(req.user._id)
      .select('_id name email createdAt garden') // Only select needed fields
      .populate({
        path: 'garden',
        select: '-image.data', // Exclude image data from initial query
        options: { lean: true } // Use lean for faster query
      })
      .lean(); // Convert to plain JS object

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Process garden data
    const garden = user.garden.map(plant => ({
      ...plant,
      image: plant.image ? {
        ...plant.image,
        data: undefined // Remove image data from response
      } : null
    }));

    // Calculate garden statistics
    const stats = calculateGardenStats(garden);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      garden: garden,
      createdAt: user.createdAt,
      stats: stats
    });
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get user profile with images (separate endpoint)
export const getUserProfileWithImages = async (req, res) => {
  try {
    const { plantIds } = req.query;
    if (!plantIds) {
      return res.status(400).json({ message: 'Plant IDs are required' });
    }

    const plantIdsArray = plantIds.split(',');
    
    const user = await User.findById(req.user._id)
      .populate({
        path: 'garden',
        match: { _id: { $in: plantIdsArray } },
        select: 'image.data image.contentType' // Only get image data for requested plants
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      garden: user.garden.map(plant => ({
        _id: plant._id,
        image: plant.image
      }))
    });
  } catch (error) {
    console.error('Error in getUserProfileWithImages:', error);
    res.status(400).json({ message: error.message });
  }
};
