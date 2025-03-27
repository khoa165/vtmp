import mongoose from 'mongoose';
import { getConfig } from './config';

const CONFIG = getConfig();

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    console.log('Test environment');
  } else {
    console.log('Not test environment');
  }
  // try {
  //   await mongoose.connect(CONFIG.MONGO_URI);
  //   console.log('✅ MongoDB Connected');
  // } catch (error) {
  //   console.error('❌ MongoDB Connection Failed:', error);
  //   process.exit(1);
  // }
};

export default connectDB;
