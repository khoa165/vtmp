import { ApplicationStatus, InterestLevel } from '@vtmp/common/constants';
import { z } from 'zod';

const ApplicationSchema = z.object({
  _id: z.string(),
  jobPostingId: z.string(),
  companyName: z.string(),
  userId: z.string(),
  status: z.nativeEnum(ApplicationStatus, {
    message: 'Invalid application status',
  }),
  appliedOnDate: z.string(),
  note: z.string().optional(),
  referrer: z.string().optional(),
  portalLink: z.string().optional(),
  interest: z
    .nativeEnum(InterestLevel, {
      message: 'Invalid interest level',
    })
    .optional(),
});

export const ApplicationsResponseSchema = z.object({
  message: z.string(),
  data: z.array(ApplicationSchema),
});

export const ApplicationResponseSchema = z.object({
  message: z.string(),
  data: ApplicationSchema,
});

export const ApplicationsCountByStatusSchema = z.object({
  message: z.string(),
  data: z.object({
    [ApplicationStatus.SUBMITTED]: z.number().optional(),
    [ApplicationStatus.OA]: z.number().optional(),
    [ApplicationStatus.INTERVIEWING]: z.number().optional(),
    [ApplicationStatus.OFFERED]: z.number().optional(),
    [ApplicationStatus.REJECTED]: z.number().optional(),
    [ApplicationStatus.WITHDRAWN]: z.number().optional(),
  }),
});

export type IApplications = z.infer<typeof ApplicationsResponseSchema>['data'];
export type IApplication = z.infer<typeof ApplicationSchema>;
