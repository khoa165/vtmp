import dotenv from 'dotenv';
import { connectDB } from '@/config/database';
import { exit } from 'process';
import { loadUsers } from '@/seeds/users';

dotenv.config();
connectDB();

const runSeeds = async () => {
  await loadUsers(10);
};

runSeeds()
  .then(() => {
    console.log('Seeding completed!');
    exit(0);
  })
  .catch((error) => {
    console.error('Error seeding data:', error);
  });
