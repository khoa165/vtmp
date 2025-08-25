import z from 'zod';

import { InterviewDataSchema } from '@vtmp/common/constants';

export const EventBodySchema = z.object({
  interviewsData: z.array(InterviewDataSchema).min(1),
});

export const InterviewInsightsResponseSchema = z.object({
  companyDetails: z.string(),
  companyProducts: z.string(),
  interviewInsights: z.object({
    commonQuestions: z.array(z.string()),
    interviewProcess: z.string(),
    tips: z.string(),
  }),
});
