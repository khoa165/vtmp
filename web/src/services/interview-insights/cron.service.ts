import axios from 'axios';
import { EnvConfig } from '@/config/env';
import { Environment } from '@vtmp/server-common/constants';

import cron from 'node-cron';
import { InterviewRepository } from '@/repositories/interview.repository';
import { InterviewData, InterviewStatus } from '@vtmp/common/constants';

export const cronService = {
  async _sendInterviewsToLambda(interviewsData: InterviewData[]) {
    const api = axios.create({
      baseURL: `${EnvConfig.get().INTERVIEW_INSIGHTS_ENDPOINT}`,
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
          body: JSON.stringify({ interviewsData }),
        },
      });
    } else {
      return api.request({
        // PROD or STAGING
        method: 'POST',
        data: { interviewsData },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  },

  trigger: async () => {
    console.log('Triggering interview insights generation...');
    try {
      console.log('Triggering interview insights generation...');

      const interviews = await InterviewRepository.getInterviews({
        isShared: true,
      });

      const interviewsData: InterviewData[] = interviews.map(
        ({
          _id,
          companyName,
          types,
          status,
          interviewOnDate,
          jobTitle,
          note,
        }) => ({
          _id: _id.toString(),
          companyName: companyName ?? '',
          types: types ?? [],
          status: status ?? InterviewStatus.PENDING,
          interviewOnDate: interviewOnDate ? interviewOnDate.toISOString() : '',
          jobTitle: jobTitle ?? '',
          note: note ?? '',
        })
      );

      await cronService._sendInterviewsToLambda(interviewsData);
      return [];
    } catch (error: unknown) {
      console.error('Error triggering interview insights generation:', error);
      return [];
    }
  },

  scheduleCronjob() {
    cron.schedule('* * * * *', this.trigger);
  },
};
