import { LinkRepository } from '@/repositories/link.repository';
import { LinkProcessStage, LinkStatus } from '@vtmp/common/constants';
import cron from 'node-cron';

cron.schedule('0 0 * * * *', async () => {
  const links = await LinkRepository.getLinks({
    status: LinkStatus.PENDING,
    processStage: LinkProcessStage.NOT_PROCESSED,
  });
  links.forEach(async (link) => {
    await LinkRepository.updateLinkMetaData(link._id.toString(), {
      processStage: LinkProcessStage.SUCCESS,
    });
  });
});
