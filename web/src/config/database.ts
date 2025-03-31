import mongoose from 'mongoose';
import { EnvConfig } from '@/config/env';

const CONFIG = EnvConfig.get();

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    console.log('Test environment');
    return;
  }
  try {
    await mongoose.connect(CONFIG.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error);
    process.exit(1);
  }
};

export default connectDB;
