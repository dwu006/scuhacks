import Plant from '../models/Plant.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Create a new plant and add to user's garden
export const addPlant = async (req, res) => {
  try {
    const { name, category, co2Reduced, description } = req.body;
    let quantity = parseInt(req.body.quantity) || 1;

    // Ensure quantity is at least 1
    if (quantity < 1) quantity = 1;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Create new plant with quantity
    const plant = await Plant.create({
      name,
      category,
      description,
      quantity,
      co2Reduced: parseFloat(co2Reduced) * quantity,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      user: req.user._id
    });

    // Add the plant to user's garden array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { garden: plant._id } }
    );

    console.log('Added plant to garden:', plant._id); // Debug log

    // Convert image to base64 for response
    const plantObj = plant.toObject();
    if (plantObj.image && plantObj.image.data) {
      plantObj.image.data = plantObj.image.data.toString('base64');
    }

    res.status(201).json(plantObj);
  } catch (error) {
    console.error('Error adding plant:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get all plants in user's garden
export const getUserGarden = async (req, res) => {
  try {
    // Get the logged in user's garden array
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User garden array:', user.garden); // Debug log

    // Get only the plants that are in the user's garden array
    const userPlants = await Plant.find({
      '_id': { $in: user.garden }
    });

    console.log('Found plants:', userPlants.length); // Debug log

    // Convert image buffers to base64
    const plantsWithBase64 = userPlants.map(plant => {
      const plantObj = plant.toObject();
      if (plantObj.image && plantObj.image.data) {
        plantObj.image.data = plantObj.image.data.toString('base64');
      }
      return plantObj;
    });

    res.json(plantsWithBase64);
  } catch (error) {
    console.error('Error in getUserGarden:', error); // Debug log
    res.status(400).json({ message: error.message });
  }
};

export const getPlants = async (req, res) => {
  try {
    // First get the user's garden array
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Then get the full plant details for each plant in the garden
    const plants = await Plant.find({
      '_id': { $in: user.garden }
    });
    
    // Convert image buffers to base64 strings
    const plantsWithBase64 = plants.map(plant => {
      const plantObj = plant.toObject();
      if (plantObj.image && plantObj.image.data) {
        plantObj.image.data = plantObj.image.data.toString('base64');
      }
      return plantObj;
    });
    
    res.json(plantsWithBase64);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get plant details by ID
export const getPlantById = async (req, res) => {
  try {
    // Validate that the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid plant ID format' });
    }

    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Verify that this plant belongs to the user
    const user = await User.findById(req.user._id);
    if (!user.garden.includes(plant._id)) {
      return res.status(403).json({ message: 'Not authorized to view this plant' });
    }

    // Convert image to base64 for response
    const plantObj = plant.toObject();
    if (plantObj.image && plantObj.image.data) {
      plantObj.image.data = plantObj.image.data.toString('base64');
    }

    res.json(plantObj);
  } catch (error) {
    console.error('Error getting plant by ID:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update plant details
export const updatePlant = async (req, res) => {
  try {
    // Validate that the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid plant ID format' });
    }

    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Verify that this plant belongs to the user
    const user = await User.findById(req.user._id);
    if (!user.garden.includes(plant._id)) {
      return res.status(403).json({ message: 'Not authorized to update this plant' });
    }

    const { name, category, quantity, co2Reduced, description } = req.body;

    plant.name = name || plant.name;
    plant.category = category || plant.category;
    plant.quantity = quantity || plant.quantity;
    plant.co2Reduced = co2Reduced || plant.co2Reduced;
    plant.description = description || plant.description;

    if (req.file) {
      plant.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const updatedPlant = await plant.save();
    const plantObj = updatedPlant.toObject();
    if (plantObj.image && plantObj.image.data) {
      plantObj.image.data = plantObj.image.data.toString('base64');
    }

    res.json(plantObj);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete plant
export const deletePlant = async (req, res) => {
  try {
    // Validate that the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid plant ID format' });
    }

    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Remove plant from user's garden array
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { garden: plant._id } }
    );

    // Delete the plant
    await Plant.findByIdAndDelete(req.params.id);

    res.json({ message: 'Plant removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
