import { LinkRepository } from '@/repositories/link.repository';
import cron from 'node-cron';

cron.schedule('0 0 * * * *', async () => {
  const links = await LinkRepository.getLinks({}, true);
  console.log(links);
});
