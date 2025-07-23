import { useMongoDB } from '@vtmp/mongo/utils';
// import mongoose from 'mongoose';

import { exit } from 'process';

import { createAdmins } from '@vtmp/mongo-migrations/create-admins';
import { EnvConfig } from '@vtmp/mongo-migrations/env';
import { migratePeople } from '@vtmp/mongo-migrations/migrate-people';

const runScripts = async () => {
  await useMongoDB(EnvConfig.get().MONGO_URI);
  // await mongoose.connection.dropDatabase();
  await migratePeople();
  await createAdmins();
};

runScripts()
  .then(() => {
    console.log('Migration completed!');
    exit(0);
  })
  .catch((error) => {
    console.error('Error migrating data:', error);
    exit(1);
  });
