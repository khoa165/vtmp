import { exit } from 'process';

import { migratePeople } from '@vtmp/mongo-migrations/migrate-people';

migratePeople()
  .then(() => {
    console.log('Migration completed!');
    exit(0);
  })
  .catch((error) => {
    console.error('Error migrating data:', error);
    exit(1);
  });
