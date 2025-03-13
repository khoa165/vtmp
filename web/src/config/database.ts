import mongoose from 'mongoose';
import { z } from 'zod';

const envSchema = z.object({
  MONGO_URI: z.string().url(),
});

const env = envSchema.parse(process.env);

const MONGO_URI = env.MONGO_URI;

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
