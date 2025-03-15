import { stopMongoDB } from '@/config/mongo.testutils';

export const mochaGlobalTeardown = async () => {
  try {
    await stopMongoDB();
  } catch (e) {
    console.error('Error in mochaGlobalTeardown:', e);
    throw e;
  }
};
