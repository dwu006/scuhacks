import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true // Add index for name searches
  },
  category: {
    type: String,
    index: true // Add index for category filtering
  },
  description: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
    index: true // Add index for quantity queries
  },
  co2Reduced: {
    type: Number,
    index: true // Add index for CO2 calculations
  },
  image: {
    data: Buffer,
    contentType: String
  },
  plantedDate: {
    type: Date,
    default: Date.now,
    index: true // Add index for date-based queries
  }
});

// Add compound index for common query patterns
plantSchema.index({ category: 1, co2Reduced: -1 });
plantSchema.index({ plantedDate: -1, quantity: -1 });

const Plant = mongoose.model('Plant', plantSchema);

export default Plant;
