import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config(); 

const uri = "mongodb+srv://dwu28:scuhacks@cluster0.7tvgx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!uri) {
  throw new Error('Missing API Key: "MONGODB_URI"');
}

const db = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise();
    }
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default db;