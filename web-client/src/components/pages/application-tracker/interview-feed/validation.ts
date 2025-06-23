import z from 'zod';

import {
  InterviewData,
  InterviewSchema,
} from '@/components/pages/application-tracker/applications/validation';

const SharedInterviewSchema = InterviewSchema.extend({
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
  sharedAt: Date;
  isDisclosed: boolean;
  user: {
    firstName: string;
    lastName: string;
  };
}
