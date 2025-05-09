import { z } from 'zod';
import { LinkStatus, JobPostingLocation } from '@vtmp/common/constants';

const DashBoardLinkSchema = z.object({
  _id: z.string(),
  url: z.string().url(),
  status: z.nativeEnum(LinkStatus, {
    message: 'Invalid link status',
  }),
  submittedOn: z.string().optional(),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  location: z
    .nativeEnum(JobPostingLocation, {
      message: 'Invalid job location',
    })
    .optional(),
  datePosted: z.string().optional(),
  jobDescription: z.string().optional(),
});

export const DashBoardLinksResponseSchema = z.object({
  message: z.string(),
  data: z.array(DashBoardLinkSchema),
});

export const DashBoardLinkResponseSchema = z.object({
  message: z.string(),
  data: DashBoardLinkSchema,
});

export type IDashBoardLink = z.infer<typeof DashBoardLinkSchema>;
