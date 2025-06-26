import z from 'zod';

import { JobPostingRegion } from '@vtmp/common/constants';

import {
  InterviewData,
  InterviewSchema,
} from '@/components/pages/application-tracker/applications/validation';

const SharedInterviewSchema = InterviewSchema.extend({
  jobTitle: z.string(),
  location: z.nativeEnum(JobPostingRegion),
  companyName: z.string(),
  sharedAt: z.coerce.date(),
  isDisclosed: z.boolean(),
  user: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
});

export const SharedInterviewResponseSchema = z.object({
  message: z.string(),
  data: SharedInterviewSchema,
});

export const SharedInterviewsResponseSchema = z.object({
  message: z.string(),
  data: z.array(SharedInterviewSchema),
});

export interface SharedInterviewData extends InterviewData {
  jobTitle: string;
  location: JobPostingRegion;
  companyName: string;
  sharedAt: Date;
  isDisclosed: boolean;
  user: {
    firstName: string;
    lastName: string;
  };
}
