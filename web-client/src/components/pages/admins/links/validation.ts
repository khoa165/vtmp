import { z } from 'zod';
import { LinkRegion, LinkStatus } from '@vtmp/common/constants';

export const LinkResponseSchema = z.object({
  _id: z.string(),
  url: z.string().url(),
  status: z.nativeEnum(LinkStatus, {
    message: 'Invalid link status',
  }),
  submittedOn: z.string().optional(),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  location: z
    .nativeEnum(LinkRegion, {
      message: 'Invalid job location',
    })
    .optional(),
  datePosted: z.string().optional(),
  jobDescription: z.string().optional(),
});

export const LinksResponseSchema = z.object({
  message: z.string(),
  data: z.array(LinkResponseSchema),
});

export const SingleLinkResponseSchema = z.object({
  message: z.string(),
  data: LinkResponseSchema,
});

export const JobPostingResponseSchema = z.object({
  message: z.string(),
  data: LinkResponseSchema.omit({ status: true }),
});

export const LinksCountByStatusSchema = z.object({
  message: z.string(),
  data: z.object({
    [LinkStatus.PENDING_PROCESSING]: z.number(),
    [LinkStatus.PENDING_ADMIN_REVIEW]: z.number(),
    [LinkStatus.ADMIN_APPROVED]: z.number(),
    [LinkStatus.ADMIN_REJECTED]: z.number(),
    [LinkStatus.PENDING_RETRY]: z.number(),
    [LinkStatus.PIPELINE_FAILED]: z.number(),
    [LinkStatus.PIPELINE_REJECTED]: z.number(),
  }),
});

export type ILinkResponse = z.infer<typeof LinkResponseSchema>;
export interface JobPostingData {
  url?: string;
  companyName?: string;
  jobTitle?: string;
  location?: string;
  datePosted?: string;
  jobDescription?: string;
  adminNote?: string;
}
