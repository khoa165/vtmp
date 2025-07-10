import { z } from 'zod';

import {
  ApplicationStatus,
  InterestLevel,
  InterviewShareStatus,
  InterviewStatus,
  InterviewType,
  JobPostingRegion,
} from '@vtmp/common/constants';

const ApplicationSchema = z.object({
  _id: z.string(),
  jobPostingId: z.string(),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  location: z.string().optional(),
  userId: z.string(),
  status: z.nativeEnum(ApplicationStatus, {
    message: 'Invalid application status',
  }),
  url: z.string().optional(),
  appliedOnDate: z.string(),
  note: z.string().optional(),
  referrer: z.string().optional(),
  portalLink: z.string().optional(),
  interest: z.nativeEnum(InterestLevel, {
    message: 'Invalid interest level',
  }),
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
  data: z
    .object({
      [ApplicationStatus.SUBMITTED]: z.number(),
      [ApplicationStatus.OA]: z.number(),
      [ApplicationStatus.INTERVIEWING]: z.number(),
      [ApplicationStatus.OFFERED]: z.number(),
      [ApplicationStatus.REJECTED]: z.number(),
      [ApplicationStatus.WITHDRAWN]: z.number(),
    })
    .strict(),
});

export interface ApplicationData {
  note?: string;
  referrer?: string;
  portalLink?: string;
  interest?: InterestLevel;
}

export const ApplicationFormSchema = z.object({
  note: z.string().optional(),
  referrer: z.string().optional(),
  portalLink: z.string().optional(),
  interest: z.nativeEnum(InterestLevel).optional(),
});

export type IApplications = z.infer<typeof ApplicationsResponseSchema>['data'];
export type IApplication = z.infer<typeof ApplicationSchema>;

export const InterviewSchema = z.object({
  _id: z.string(),
  applicationId: z.string(),
  userId: z.string(),
  types: z.array(
    z.nativeEnum(InterviewType, {
      message: 'Invalid interview type',
    })
  ),
  status: z.nativeEnum(InterviewStatus, {
    message: 'Invalid interview status',
  }),
  interviewOnDate: z.coerce.date(),
  companyName: z.string().optional(),
  note: z.string().optional(),
  shareStatus: z.nativeEnum(InterviewShareStatus, {
    message: 'Invalid interview share status',
  }),
});

export const InterviewsResponseSchema = z.object({
  message: z.string(),
  data: z.array(InterviewSchema),
});

export const InterviewResponseSchema = z.object({
  message: z.string(),
  data: InterviewSchema,
});

export interface InterviewData {
  types: InterviewType[];
  status: InterviewStatus;
  interviewOnDate: Date;
  note?: string;
  shareStatus?: InterviewShareStatus;
}

export const InterviewFormSchema = z.object({
  types: z.array(z.nativeEnum(InterviewType)),
  status: z.nativeEnum(InterviewStatus),
  interviewOnDate: z.coerce.date(),
  note: z.string().optional(),
});

export type IInterviews = z.infer<typeof InterviewsResponseSchema>['data'];

export interface SharedInterviewFilter {
  status?: InterviewStatus;
  types?: InterviewType[];
  interviewOnDate?: Date;
  companyName?: string;
}

const SharedInterviewSchema = InterviewSchema.extend({
  jobTitle: z.string(),
  location: z.nativeEnum(JobPostingRegion),
  companyName: z.string(),
  shareStatus: z.nativeEnum(InterviewShareStatus),
  user: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
});

export const SharedInterviewResponseSchema = z.object({
  message: z.string(),
  data: SharedInterviewSchema,
});

export const SharedInterviewsResponseSchema = z.object({
  message: z.string(),
  data: z.array(SharedInterviewSchema),
});

export interface SharedInterviewData extends InterviewData {
  jobTitle: string;
  location: string;
  companyName: string;
  shareStatus: InterviewShareStatus;
  user: {
    firstName: string;
    lastName: string;
  };
}
