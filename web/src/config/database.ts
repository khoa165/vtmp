import mongoose from 'mongoose';

import { EnvConfig } from '@/config/env';
import { Environment } from '@/constants/enums';

export const connectDB = async () => {
  if (EnvConfig.get().NODE_ENV === Environment.TEST) {
    console.log('Test environment');
    return;
  }
  try {
    await mongoose.connect(EnvConfig.get().MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error);
    process.exit(1);
  }
};
