import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  name: {
    type: String
  },
  category: {
    type: String
  },
  co2Reduced: {
    type: Number
  },
  image: {
    data: Buffer,
    contentType: String
  },
  plantedDate: {
    type: Date,
    default: Date.now
  }
});

const Plant = mongoose.model('Plant', plantSchema);

export default Plant;
