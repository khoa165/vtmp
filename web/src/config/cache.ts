import { createClient } from 'redis';

import { EnvConfig } from '@/config/env';

export const connectRedis = async () => {
  try {
    const redisClient = createClient({ url: EnvConfig.get().REDIS_URL });
    await redisClient.connect();
    console.log('✅ Redis Connected');
    return redisClient;
  } catch (error) {
    console.error('❌ Redis Connection Failed:', error);
    process.exit(1);
  }
};
