import mongoose from 'mongoose';
import { getConfig } from './config';

const CONFIG = getConfig();

const MONGO_URI = CONFIG.MONGO_URI;

const connectDB = async () => {
  if (!MONGO_URI) {
    return;
  }
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error);
    process.exit(1);
  }
};

export default connectDB;
