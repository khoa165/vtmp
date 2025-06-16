import {
  InterviewData,
  InterviewSchema,
} from '@/components/pages/application-tracker/applications/validation';
import z from 'zod';

const SharedInterviewSchema = InterviewSchema.extend({
  userName: z.string(),
});

export const SharedInterviewsResponseSchema = z.object({
  message: z.string(),
  data: z.array(SharedInterviewSchema),
});

export interface SharedInterviewData extends InterviewData {
  userName: string;
}
