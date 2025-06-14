import { LinkStatus, FAILEDREASON } from '@vtmp/common/constants';
import { LinkRepository } from '@/repositories/link.repository';
import cron from 'node-cron';

const getRetryFilter = () => ({
  $or: [
    { status: LinkStatus.PENDING },
    {
      status: LinkStatus.FAILED,
      subStatus: FAILEDREASON.UNKNOWN_FAILED,
      attemptsCount: { $lt: 4 },
      $expr: {
        $gt: [
          {
            $dateDiff: {
              startDate: '$lastProcessedAt',
              endDate: '$$NOW',
              unit: 'minute',
            },
          },
          30,
        ],
      },
    },
  ],
});

cron.schedule('0 0 * * * *', async () => {
  const links = await LinkRepository.getLinks(getRetryFilter());
  console.log(links);
});
