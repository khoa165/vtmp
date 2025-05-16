import dotenv from 'dotenv';
import { connectDB } from '@/config/database';
import { exit } from 'process';
import { loadUsers } from '@/seeds/users';
import { loadLinks } from '@/seeds/links';
import { loadJobPostings } from '@/seeds/job-postings';
import { loadApplications } from '@/seeds/applications';

import mongoose from 'mongoose';
import { loadInterviews } from '@/seeds/interviews';

dotenv.config();
connectDB();

const runSeeds = async () => {
  await mongoose.connection.dropDatabase();
  console.log('Successfully clear database before seeding.');

  const users = await loadUsers(10);
  const links = await loadLinks(30);
  const jobPostings = await loadJobPostings(links);
  const applications = await loadApplications(users, jobPostings);
  await loadInterviews(users, applications);
};

runSeeds()
  .then(() => {
    console.log('Seeding completed!');
    exit(0);
  })
  .catch((error) => {
    console.error('Error seeding data:', error);
  });
