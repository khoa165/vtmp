import axios from 'axios';
import cron from 'node-cron';

import { LinkStatus } from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import { Environment } from '@/constants/enums';
import { ILink } from '@/models/link.model';
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
 * - local Lambda running with aws-lambda-runtime-interface-emulator: request body needs to be stirngified, it is the entire event object
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
      method: 'POST',
      data: { linksData },
    });
  }
};

cron.schedule('*/30 * * * * *', async () => {
  const links = await LinkRepository.getLinks(getRetryFilter());
  const domainLock = new Set<string>();
  const domainLockQueue: { lockedLink: ILink; nextTimeToExecute: Date }[] = [];

  // Process links in batches to avoid overloading the Lambda function and create 5s delay by lock between 2 links from the same domain
  while (links.length > 0 || domainLockQueue.length > 0) {
    // Release expired domain locks first
    const now = new Date();
    while (
      domainLockQueue.length > 0 &&
      domainLockQueue[0]!.nextTimeToExecute <= now
    ) {
      const { lockedLink } = domainLockQueue.shift()!;
      const domain = new URL(lockedLink.originalUrl).hostname;
      domainLock.delete(domain);
    }

    // Pick next batch of links to try processing
    const linkBatch = links.splice(0, 5);
    const linksToSubmit = [];

    for (const link of linkBatch) {
      const domain = new URL(link.originalUrl).hostname;

      if (!domainLock.has(domain)) {
        // Lock domain and add to submission list
        domainLock.add(domain);
        linksToSubmit.push({
          _id: link._id.toString(),
          originalUrl: link.originalUrl,
          attemptsCount: link.attemptsCount,
        });
      } else {
        // Domain locked, queue for retry after 5 seconds
        domainLockQueue.push({
          lockedLink: link,
          nextTimeToExecute: new Date(now.getTime() + 5 * 1000),
        });
      }
    }

    if (linksToSubmit.length > 0) {
      sendLinksToLambda(linksToSubmit);
    }

    // If no links to submit and domain locks still active, wait a bit to avoid busy loop
    if (linksToSubmit.length === 0 && domainLockQueue.length > 0) {
      const waitTimeMs =
        domainLockQueue[0]!.nextTimeToExecute.getTime() - new Date().getTime();
      await new Promise((resolve) =>
        setTimeout(resolve, Math.max(waitTimeMs, 1000))
      ); // wait at least 1s
    }
  }
});
