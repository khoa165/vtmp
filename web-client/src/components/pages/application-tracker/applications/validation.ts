import {
  ApplicationStatus,
  InterestLevel,
  InterviewStatus,
  InterviewType,
} from '@vtmp/common/constants';
import { z } from 'zod';

const ApplicationSchema = z.object({
  _id: z.string(),
  jobPostingId: z.string(),
  companyName: z.string(),
  jobTitle: z.string(),
  location: z.string(),
  userId: z.string(),
  status: z.nativeEnum(ApplicationStatus, {
    message: 'Invalid application status',
  }),
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

export type IApplications = z.infer<typeof ApplicationsResponseSchema>['data'];
export type IApplication = z.infer<typeof ApplicationSchema>;

const InterviewSchema = z.object({
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
}

export type IInterviews = z.infer<typeof InterviewsResponseSchema>['data'];
