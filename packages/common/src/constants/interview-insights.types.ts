import { InterviewStatus, InterviewType } from '#vtmp/common/constants';
import z from 'zod';

export const InterviewDataSchema = z.object({
  _id: z.string(),
  companyName: z.string(),
  types: z.array(z.nativeEnum(InterviewType)),
  status: z.nativeEnum(InterviewStatus),
  interviewOnDate: z.string(),
  jobTitle: z.string(),
  note: z.string(),
});

export type InterviewData = z.infer<typeof InterviewDataSchema>;

export const InterviewInsightSchema = z.object({
  companyName: z.string(),
  companyDetails: z.string(),
  companyProducts: z.string(),
  interviewInsights: z.object({
    commonQuestions: z.array(z.string()),
    interviewProcess: z.string(),
    tips: z.string(),
  }),
});

export type InterviewInsight = z.infer<typeof InterviewInsightSchema>;
