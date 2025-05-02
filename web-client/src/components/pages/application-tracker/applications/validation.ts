import { ApplicationStatus, InterestLevel } from '@vtmp/common/constants';
import { z } from 'zod';

export const ApplicationsResponseSchema = z.object({
  message: z.string(),
  data: z.array(
    z.object({
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
    })
  ),
});

export const ApplicationResponseSchema = z.object({
  message: z.string(),
  data: z.object({
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
  }),
});

export const CountApplicationsByStatusSchema = z.object({
  message: z.string(),
  data: z.object({
    submittedCount: z.number().optional(),
    oaCount: z.number().optional(),
    interviewingCount: z.number().optional(),
    offeredCount: z.number().optional(),
    rejectedCount: z.number().optional(),
    withdrawalCount: z.number().optional(),
  }),
});

export type IApplications = z.infer<typeof ApplicationsResponseSchema>['data'];
export type IApplication = IApplications[number];
