import { LinkRegion, JobFunction, JobType } from '@vtmp/common/constants';
import { z } from 'zod';
export const LinkMetaDataSchema = z.object({
  url: z.string().url({ message: 'Invalid URL' }),
  jobTitle: z.string(),
  companyName: z.string(),
  location: z.nativeEnum(LinkRegion, {
    message: 'Invalid location',
  }),
  jobFunction: z.nativeEnum(JobFunction, {
    message: 'Invalid job title',
  }),
  jobType: z.nativeEnum(JobType, {
    message: 'Invalid job type',
  }),
  datePosted: z.string(),
  jobDescription: z.string(),
});
export type LinkMetaData = z.infer<typeof LinkMetaDataSchema>;
