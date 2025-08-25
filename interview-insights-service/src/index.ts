import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

import { InterviewInsight } from '@vtmp/common/constants';

import { EventBodySchema } from '@/types/interview-insights.types';
import { createInterviewInsights } from '@/utils/api';
import { handleErrorMiddleware } from '@/utils/errors';

const lambdaHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const { interviewsData } = EventBodySchema.parse(event.body);

  // Mock interview insights generation
  const mockInterviewInsights: InterviewInsight[] = [
    {
      companyName: 'Mock Company',
      companyDetails: 'Details about Mock Company',
      companyProducts: 'Products offered by Mock Company',
      interviewInsights: {
        commonQuestions: [
          'What is your greatest strength?',
          'Tell me about a challenge you faced.',
        ],
        interviewProcess:
          'The interview process consists of 3 rounds: HR, Technical, and Managerial.',
        tips: 'Be confident and prepare well for technical questions.',
      },
    },
    {
      companyName: 'Another Mock Company',
      companyDetails: 'Details about Another Mock Company',
      companyProducts: 'Products offered by Another Mock Company',
      interviewInsights: {
        commonQuestions: [
          'What is your greatest weakness?',
          'Describe a time you faced a conflict at work.',
        ],
        interviewProcess:
          'The interview process consists of 4 rounds: HR, Technical, Managerial, and Final.',
        tips: 'Research the company thoroughly and prepare questions to ask the interviewer.',
      },
    },
  ];

  await createInterviewInsights(mockInterviewInsights);

  console.info('Interviews Data:\n' + JSON.stringify(interviewsData, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({ mockInterviewInsights }),
  };
};

export const handler = middy(lambdaHandler)
  .use(httpJsonBodyParser())
  .use(handleErrorMiddleware());
