import axios from 'axios';
import cron from 'node-cron';

import { LinkStatus } from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import { LinkRepository } from '@/repositories/link.repository';

const getRetryFilter = () => ({
  $or: [
    { status: LinkStatus.PENDING_PROCESSING },
    {
      status: LinkStatus.PENDING_RETRY,
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

const api = axios.create({
  baseURL: `${EnvConfig.get().LAMBDA_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// export const sendLinksToLambda = async (
//   linksData: { _id: string; url: string; attemptsCount: number }[]
// ) => {
//   return api.request({
//     method: 'POST',
//     data: { linksData },
//   });
// };

export const sendLinksToLambda = async (
  linksData: {
    _id: string;
    originalUrl: string | undefined;
    attemptsCount: number;
  }[]
) => {
  return api.request({
    method: 'POST',
    data: {
      version: '2.0',
      routeKey: 'POST /',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ linksData }),
    },
  });
};

cron.schedule('*/30 * * * * *', async () => {
  const links = await LinkRepository.getLinks(getRetryFilter());
  console.log('PENDING links retrieved from database: ', links);
  // if (links.length === 0) return;
  // const linksData = links.map(({ _id, originalUrl, attemptsCount }) => ({
  //   _id: _id.toString(),
  //   originalUrl,
  //   attemptsCount,
  // }));
  // console.log('linksData payload before sending: ', linksData);
  // const results = await sendLinksToLambda(linksData);
  // console.log('Response from Lambda: ', results);
});
