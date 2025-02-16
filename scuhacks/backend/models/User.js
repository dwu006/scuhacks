import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true // Add index for email lookups
  },
  password: {
    type: String,
    required: true
  },
  garden: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    index: true // Add index for garden lookups
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Add index for date-based queries
  }
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
