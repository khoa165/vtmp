import { LinkRegion, JobFunction, JobType } from '@vtmp/common/constants';
import { z } from 'zod';
export const LinkMetaDataSchema = z.object({
  url: z.string().url({ message: 'Invalid URL' }),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  location: z
    .nativeEnum(LinkRegion, {
      message: 'Invalid location',
    })
    .optional(),
  jobFunction: z
    .nativeEnum(JobFunction, {
      message: 'Invalid job title',
    })
    .optional(),
  jobType: z
    .nativeEnum(JobType, {
      message: 'Invalid job type',
    })
    .optional(),
  datePosted: z.string().optional(),
  jobDescription: z.string().optional(),
});
export type LinkMetaData = z.infer<typeof LinkMetaDataSchema>;
