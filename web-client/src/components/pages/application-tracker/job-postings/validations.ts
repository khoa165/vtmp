import { z } from 'zod';

import { JobFunction, JobType } from '@vtmp/common/constants';

const JobPostingSchema = z.object({
  _id: z.string(),
  url: z.string(),
  jobTitle: z.string(),
  jobFunction: z.nativeEnum(JobFunction),
  jobType: z.nativeEnum(JobType),
  companyName: z.string(),
  location: z.string(),
  datePosted: z.string().optional(),
  jobDescription: z.string().optional(),
  adminNotes: z.string().optional(),
});

export const JobPostingsResponseSchema = z.object({
  message: z.string(),
  data: z.array(JobPostingSchema),
});

export type IJobPostings = z.infer<typeof JobPostingsResponseSchema>['data'];
export type IJobPosting = z.infer<typeof JobPostingSchema>;
