import { creator } from '@/app';

creator.syncCommands().then(() => {
  console.log('Slash commands synced!');
  process.exit(0); // Immediate stop the Node process and exits with status codde 0
});
