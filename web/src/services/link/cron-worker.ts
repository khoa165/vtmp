import { LinkRepository } from '@/repositories/link.repository';
import { LinkStatus } from '@vtmp/common/constants';
import cron from 'node-cron';

cron.schedule('0 0 * * * *', async () => {
  const links = await LinkRepository.getLinks({
    status: LinkStatus.PENDING,
  });
  console.log(links);
});
