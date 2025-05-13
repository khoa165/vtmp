import { z } from 'zod';
import { JobPostingRegion, LinkStatus } from '@vtmp/common/constants';

const DashBoardLinkSchema = z.object({
  _id: z.string(),
  url: z.string().url(),
  status: z.string(),
  submittedOn: z.string().optional(),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  location: z
    .nativeEnum(JobPostingRegion, {
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

export const JobPostingResponseSchema = z.object({
  message: z.string(),
  data: DashBoardLinkSchema.omit({
    status: true,
  }),
});

export const LinksCountByStatusSchema = z.object({
  message: z.string(),
  data: z.object({
    [LinkStatus.PENDING]: z.number(),
    [LinkStatus.APPROVED]: z.number(),
    [LinkStatus.REJECTED]: z.number(),
  }),
});

export type IDashBoardLink = z.infer<typeof DashBoardLinkSchema>;
