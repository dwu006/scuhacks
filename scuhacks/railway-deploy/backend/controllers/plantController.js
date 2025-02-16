import Plant from '../models/Plant.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Function to calculate Levenshtein distance between two strings
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1,
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1
        );
      }
    }
  }

  return dp[m][n];
}

// Function to calculate similarity percentage
function calculateSimilarity(str1, str2) {
  const maxLength = Math.max(str1.length, str2.length);
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return ((maxLength - distance) / maxLength) * 100;
}

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

    // Get user's garden
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all plants in user's garden
    const userPlants = await Plant.find({
      _id: { $in: user.garden }
    });

    // Find the most similar plant
    let mostSimilarPlant = null;
    let highestSimilarity = 0;

    for (const plant of userPlants) {
      const similarity = calculateSimilarity(name, plant.name);
      console.log(`Comparing "${name}" with "${plant.name}": ${similarity}%`);
      
      // Consider plants with similarity > 80% as matches
      if (similarity > 80 && similarity > highestSimilarity) {
        highestSimilarity = similarity;
        mostSimilarPlant = plant;
      }
    }

    if (mostSimilarPlant) {
      console.log(`Found similar plant: "${mostSimilarPlant.name}" (${highestSimilarity}% match)`);
      
      // Update existing plant's quantity and CO2
      const newQuantity = mostSimilarPlant.quantity + quantity;
      const updatedPlant = await Plant.findByIdAndUpdate(
        mostSimilarPlant._id,
        {
          $set: {
            quantity: newQuantity,
            co2Reduced: parseFloat(co2Reduced) * newQuantity
          }
        },
        { new: true }
      );

      // Convert image to base64 for response
      const plantObj = updatedPlant.toObject();
      if (plantObj.image && plantObj.image.data) {
        plantObj.image.data = plantObj.image.data.toString('base64');
      }

      return res.status(200).json(plantObj);
    }

    // If no similar plant found, create new plant
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
