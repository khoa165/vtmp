import { RedisMemoryServer } from 'redis-memory-server';

import { connectRedis, redisClient } from '@/config/cache';

let redisAlreadyStarted = false;

let redisMemoryServer: RedisMemoryServer | undefined;

export const useRedis = async () => {
  before(async function () {
    if (redisAlreadyStarted) {
      return;
    }
    redisAlreadyStarted = true;
    this.timeout(600000);
    await startRedis();
  });

  beforeEach(async function () {
    await redisClient.flushAll();
  });

  after(async () => {
    if (redisClient) await redisClient.quit();
    if (redisMemoryServer) await redisMemoryServer.stop();
  });
};

const startRedis = async () => {
  try {
    const redisRunning =
      redisMemoryServer && (await redisMemoryServer.getInstanceInfo()) != null;

    if (!redisRunning) {
      redisMemoryServer = await RedisMemoryServer.create();
      const host = await redisMemoryServer.getHost();
      const port = await redisMemoryServer.getPort();

      connectRedis(`redis://${host}:${port}`);
    }
  } catch (error) {
    console.error('Error starting Redis:', error);
    throw error;
  }
};
