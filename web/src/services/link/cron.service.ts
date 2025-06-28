import axios from 'axios';
import cron from 'node-cron';

import { LinkStatus } from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import { Environment } from '@/constants/enums';
import { LinkRepository } from '@/repositories/link.repository';

const ENABLE_LINK_PROCESSING = false;

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
  baseURL: `${EnvConfig.get().LINK_PROCESSING_ENDPOINT}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 *
 * @param linksData
 * @returns
 *
 * Switch the request format based on an env var
 * - local Lambda running with aws-lambda-runtime-interface-emulator: request body needs to be stringified, it is the entire event object
 * - cloud lambda on AWS: request body is sent as normal JSON body
 */

export const sendLinksToLambda = async (
  linksData: {
    _id: string;
    originalUrl: string;
    attemptsCount: number;
  }[]
) => {
  const NODE_ENV = EnvConfig.get().NODE_ENV;
  if (NODE_ENV === Environment.DEV) {
    return api.request({
      method: 'POST',
      data: {
        version: '2.0',
        routeKey: 'POST /',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ linksData }),
      },
    });
  } else {
    return api.request({
      // prod,
      method: 'POST',
      data: { linksData },
    });
  }
};

const linkProcessingJob = async () => {
  console.log('Cron wakes up...');
  try {
    const links = await LinkRepository.getLinks(getRetryFilter());
    console.log('PENDING links retrieved from database: ', links);

    // Return early if no links matches the getRetryFilter() filter
    if (links.length === 0) return;

    const linksData = links.map(({ _id, originalUrl, attemptsCount }) => ({
      _id: _id.toString(),
      originalUrl,
      attemptsCount,
    }));
    console.log('linksData payload before sending: ', linksData);

    const results = await sendLinksToLambda(linksData);
    console.log('Response from Lambda: ', results);
  } catch (error: unknown) {
    console.error('Cron error: ', error);
  }
};
// Disable cron-worker so that web is not able to trigger lambda
if (ENABLE_LINK_PROCESSING) {
  cron.schedule('0 0 * * * *', linkProcessingJob);
}

export const CronService = {
  runImmediately: async () => {
    await linkProcessingJob();
  },
};
