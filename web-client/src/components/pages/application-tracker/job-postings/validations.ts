import { z } from 'zod';

import {
  JobFunction,
  JobType,
  JobPostingSortField,
  SortOrder,
} from '@vtmp/common/constants';

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
  data: z.object({
    data: z.array(JobPostingSchema),
    cursor: z.string().optional(),
  }),
});

export type IJobPostings = z.infer<
  typeof JobPostingsResponseSchema
>['data']['data'];
export type IJobPosting = z.infer<typeof JobPostingSchema>;

export interface JobPostingFilters {
  limit: number;
  cursor?: string;
  sortField?: JobPostingSortField;
  sortOrder?: SortOrder;
  companyName?: string;
  jobTitle?: string;
  location?: string;
  jobFunction?: string;
  jobType?: string;
  postingDateRangeStart?: Date;
  postingDateRangeEnd?: Date;
}
