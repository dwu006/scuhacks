import Plant from '../models/Plant.js';
import User from '../models/User.js';

// Create a new plant and add to user's garden
export const addPlant = async (req, res) => {
  try {
    const { name, category, co2Reduced, description } = req.body;
    const image = {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };

    // Create new plant
    const plant = await Plant.create({
      name,
      category,
      co2Reduced,
      description,
      image,
      plantedDate: new Date()
    });

    // Add plant to user's garden
    const user = await User.findById(req.user._id);
    user.garden.push(plant._id);
    await user.save();

    res.status(201).json(plant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all plants in user's garden
export const getUserGarden = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('garden');
    res.json(user.garden);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get plant details by ID
export const getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (plant) {
      res.json(plant);
    } else {
      res.status(404).json({ message: 'Plant not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update plant details
export const updatePlant = async (req, res) => {
  try {
    const { name, category, co2Reduced, description } = req.body;
    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Update fields
    plant.name = name || plant.name;
    plant.category = category || plant.category;
    plant.co2Reduced = co2Reduced || plant.co2Reduced;
    plant.description = description || plant.description;
    
    if (req.file) {
      plant.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const updatedPlant = await plant.save();
    res.json(updatedPlant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete plant
export const deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Remove plant from user's garden
    const user = await User.findById(req.user._id);
    user.garden = user.garden.filter(p => p.toString() !== req.params.id);
    await user.save();

    // Delete the plant
    await plant.deleteOne();
    res.json({ message: 'Plant removed from garden' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
