import { createClient } from 'redis';

import { EnvConfig } from '@/config/env';

export const redisClient = createClient({ url: EnvConfig.get().REDIS_URL });

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis Connected');
    return;
  } catch (error) {
    console.error('❌ Redis Connection Failed:', error);
    process.exit(1);
  }
};
