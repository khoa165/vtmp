import { stopMongoDB } from '@/config/mongo.testutils';

export async function mochaGlobalTeardown() {
  try {
    await stopMongoDB();
  } catch (e) {
    console.error('Error in mochaGlobalTeardown:', e);
    throw e;
  }
}
