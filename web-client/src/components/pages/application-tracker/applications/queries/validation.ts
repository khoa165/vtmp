import { ApplicationStatus, InterestLevel } from '@vtmp/common/constants';
import { z } from 'zod';

export const ApplicationTrackerSchema = z.object({
  message: z.string(),
  data: z.array(
    z.object({
      _id: z.string(),
      jobPostingId: z.string(),
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

export type IApplications = z.infer<typeof ApplicationTrackerSchema>['data'];
export type IApplication = IApplications[number];
