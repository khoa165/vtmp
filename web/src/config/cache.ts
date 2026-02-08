import { createClient, RedisClientType } from 'redis';

import { EnvConfig } from '@/config/env';

export let redisClient: RedisClientType;

export const connectCache = async () => {
  try {
    await connectRedis(EnvConfig.get().REDIS_URL);
    console.log('✅ Redis Connected');
  } catch (error) {
    console.error('❌ Redis Connection Failed:', error);
    process.exit(1);
  }
};

export const connectRedis = async (url: string) => {
  redisClient = createClient({ url });
  await redisClient.connect();
};
