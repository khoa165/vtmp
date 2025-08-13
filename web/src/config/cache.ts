import { createClient, SCHEMA_FIELD_TYPE } from 'redis';

import { EnvConfig } from '@/config/env';

const redisClient = createClient({ url: EnvConfig.get().REDIS_URL });

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

export const createInterviewInsightIndex = async () => {
  try {
    await redisClient.ft.create(
      'idx:companies',
      {
        '$.companyName': { type: SCHEMA_FIELD_TYPE.TEXT, AS: 'companyName' },
      },
      {
        ON: 'JSON',
        PREFIX: 'companyName',
      }
    );
    console.log('Redis index created: idx:companies');
  } catch (err) {
    console.error('Error creating Redis index:', err);
  }
};

export const redisClient;
