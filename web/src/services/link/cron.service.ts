import { Environment } from '@vtmp/server-common/constants';
import axios from 'axios';
import cron from 'node-cron';

import {
  FailedProcessedLink,
  MetadataExtractedLink,
  SubmittedLink,
  LinkStatus,
} from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import { ILink } from '@/models/link.model';
import { LinkRepository } from '@/repositories/link.repository';
import { BadRequest, InternalServerError } from '@/utils/errors';

const ENABLE_LINK_PROCESSING = false;
const MAX_LONG_RETRY_ATTEMPTS = 4;
const MAX_DURATION_BETWEEN_RETRIES = 30; // in minutes
export let PIPELINE_IN_PROCESS = false;
export const CronService = {
  _getRetryFilter() {
    return {
      $or: [
        { status: LinkStatus.PENDING_PROCESSING },
        {
          status: LinkStatus.PENDING_RETRY,
          attemptsCount: { $lt: MAX_LONG_RETRY_ATTEMPTS },
          $expr: {
            $gte: [
              {
                $dateDiff: {
                  startDate: '$lastProcessedAt',
                  endDate: '$$NOW',
                  unit: 'minute',
                },
              },
              MAX_DURATION_BETWEEN_RETRIES,
            ],
          },
        },
      ],
    };
  },
  /**
   *
   * @param linksData
   * @returns
   *
   * Switch the request format based on an env var
   * - local Lambda running with aws-lambda-runtime-interface-emulator: request body needs to be stringified, it is the entire event object
   * - cloud lambda on AWS: request body is sent as normal JSON body
   */

  async _sendLinksToLambda(linksData: SubmittedLink[]) {
    const api = axios.create({
      baseURL: `${EnvConfig.get().LINK_PROCESSING_ENDPOINT}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const NODE_ENV = EnvConfig.get().NODE_ENV;

    if (NODE_ENV === Environment.DEV || NODE_ENV === Environment.TEST) {
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
        // PROD or STAGING
        method: 'POST',
        data: { linksData },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  },
  async trigger(): Promise<{
    successfulLinks: MetadataExtractedLink[];
    failedLinks: FailedProcessedLink[];
  }> {
    console.log('Cron wakes up...');
    if (PIPELINE_IN_PROCESS) {
      throw new BadRequest('Pipeline is processing', {});
    }
    PIPELINE_IN_PROCESS = true;
    try {
      const links = await LinkRepository.getLinks(this._getRetryFilter());
      console.log('PENDING links retrieved from database: ', links);

      // Return early if no links matches the getRetryFilter() filter
      if (links.length === 0) {
        PIPELINE_IN_PROCESS = false;
        return { successfulLinks: [], failedLinks: [] };
      }

      const linksData: SubmittedLink[] = links.map(
        ({ _id, originalUrl, attemptsCount }) => ({
          _id: _id.toString(),
          originalUrl,
          attemptsCount,
        })
      );
      console.log('linksData payload before sending: ', linksData);

      const response = await this._sendLinksToLambda(linksData);
      console.log('Response from Lambda: ', response);

      let result: {
        successfulLinks: MetadataExtractedLink[];
        failedLinks: FailedProcessedLink[];
      };

      if (
        EnvConfig.get().NODE_ENV === Environment.STAGING ||
        EnvConfig.get().NODE_ENV === Environment.PROD
      ) {
        result = response.data;
      } else {
        result = JSON.parse(response.data.body);
      }

      PIPELINE_IN_PROCESS = false;
      return result;
    } catch (error: unknown) {
      PIPELINE_IN_PROCESS = false;
      console.error('Cron error: ', error);
      throw new InternalServerError('Failed to process links', { error });
    }
  },

  async requestTriggerOneLink(links: ILink[]): Promise<{
    successfulLinks: MetadataExtractedLink[];
    failedLinks: FailedProcessedLink[];
  }> {
    console.log('Cron wakes up...');
    if (PIPELINE_IN_PROCESS) {
      throw new BadRequest('Pipeline is processing', {});
    }
    PIPELINE_IN_PROCESS = true;
    try {
      const linksData: SubmittedLink[] = links.map(
        ({ _id, originalUrl, attemptsCount }) => ({
          _id: _id.toString(),
          originalUrl,
          attemptsCount,
        })
      );

      if (links.length === 0) {
        PIPELINE_IN_PROCESS = false;
        return { successfulLinks: [], failedLinks: [] };
      }

      const response = await this._sendLinksToLambda(linksData);
      let result: {
        successfulLinks: MetadataExtractedLink[];
        failedLinks: FailedProcessedLink[];
      };

      if (
        EnvConfig.get().NODE_ENV === Environment.STAGING ||
        EnvConfig.get().NODE_ENV === Environment.PROD
      ) {
        result = response.data;
      } else {
        result = JSON.parse(response.data.body);
      }

      PIPELINE_IN_PROCESS = false;
      return result;
    } catch (error: unknown) {
      PIPELINE_IN_PROCESS = false;
      console.error('Cron error: ', error);
      throw new InternalServerError('Failed to process links', { error });
    }
  },

  scheduleCronjob() {
    if (ENABLE_LINK_PROCESSING) {
      cron.schedule('0 0 0 * * *', this.trigger);
      console.log('Cron job scheduled for link processing.');
    } else {
      console.log('Cron job for link processing is disabled.');
    }
  },
};
