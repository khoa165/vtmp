import { Environment } from '@vtmp/server-common/constants';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { exit } from 'process';

import { connectDB } from '@/config/database';
import { EnvConfig } from '@/config/env';
import { loadApplications } from '@/seeds/applications';
import { loadInterviews } from '@/seeds/interviews';
import { loadInvitations } from '@/seeds/invitations';
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
  invitationsCount: number;
}

const defaultConfiguration: SeedCountConfiguration = {
  usersCount: 10,
  linksCount: 30,
  minApplicationsCountPerUser: 10,
  maxApplicationsCountPerUser: 30,
  invitationsCount: 20,
};

const allConfigurations: Partial<Record<Environment, SeedCountConfiguration>> =
  {
    [Environment.STAGING]: {
      usersCount: 50,
      linksCount: 500,
      minApplicationsCountPerUser: 100,
      maxApplicationsCountPerUser: 300,
      invitationsCount: 100,
    },
  };

const LINKS_WITHOUT_APPLICATIONS_RATIO = 0.5;

const runSeeds = async () => {
  await mongoose.connection.dropDatabase();
  console.log('Successfully clear database before seeding.');

  const {
    usersCount,
    linksCount,
    minApplicationsCountPerUser,
    maxApplicationsCountPerUser,
    invitationsCount,
  } = allConfigurations[EnvConfig.get().SEED_ENV] ?? defaultConfiguration;

  const users = await loadUsers(usersCount);

  const numLinksWithoutApplications = Math.floor(
    linksCount * LINKS_WITHOUT_APPLICATIONS_RATIO
  );
  const numLinksWithApplications = linksCount - numLinksWithoutApplications;

  const linksWithoutApplications = await loadLinks(
    numLinksWithoutApplications,
    { seedRealLinks: true }
  );
  const linksWithApplications = await loadLinks(numLinksWithApplications);

  await loadJobPostings(linksWithoutApplications);
  const jobPostings = await loadJobPostings(linksWithApplications);

  const applications = await loadApplications({
    users,
    jobPostings,
    minApplicationsCountPerUser,
    maxApplicationsCountPerUser,
  });
  await loadInterviews(users, applications);
  await loadInvitations(invitationsCount);
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
