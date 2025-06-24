import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { exit } from 'process';

import { connectDB } from '@/config/database';
import { EnvConfig } from '@/config/env';
import { Environment } from '@/constants/enums';
import { loadApplications } from '@/seeds/applications';
import { loadInterviews } from '@/seeds/interviews';
import { loadJobPostings } from '@/seeds/job-postings';
import { loadLinks } from '@/seeds/links';
import { loadUsers } from '@/seeds/users';

dotenv.config();
connectDB();

interface SeedCountConfiguration {
  usersCount: number;
  linksCount: number;
  minApplicationsCountPerUser: number;
  maxApplicationsCountPerUser: number;
}

const defaultConfiguration: SeedCountConfiguration = {
  usersCount: 10,
  linksCount: 30,
  minApplicationsCountPerUser: 10,
  maxApplicationsCountPerUser: 30,
};

const allConfigurations: Partial<Record<Environment, SeedCountConfiguration>> =
  {
    [Environment.STAGING]: {
      usersCount: 50,
      linksCount: 500,
      minApplicationsCountPerUser: 100,
      maxApplicationsCountPerUser: 300,
    },
  };

const runSeeds = async () => {
  await mongoose.connection.dropDatabase();
  console.log('Successfully clear database before seeding.');

  const {
    usersCount,
    linksCount,
    minApplicationsCountPerUser,
    maxApplicationsCountPerUser,
  } = allConfigurations[EnvConfig.get().SEED_ENV] ?? defaultConfiguration;

  const users = await loadUsers(usersCount);
  const numLinksWithoutApplications = Math.floor(linksCount / 2);
  const numLinksWithApplications = linksCount - numLinksWithoutApplications;

  // const linksWithoutApplications = await loadLinks(numLinksWithoutApplications);
  const linksWithApplications = await loadLinks(numLinksWithApplications);

  // await loadJobPostings(linksWithoutApplications);
  const jobPostings = await loadJobPostings(linksWithApplications);

  const applications = await loadApplications({
    users,
    jobPostings,
    minApplicationsCountPerUser,
    maxApplicationsCountPerUser,
  });
  await loadInterviews(users, applications);
};

runSeeds()
  .then(() => {
    console.log('Seeding completed!');
    exit(0);
  })
  .catch((error) => {
    console.error('Error seeding data:', error);
    exit(1);
  });
