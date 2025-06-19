import { z } from 'zod';
import {
  LinkProcessingSubStatus,
  JobFunction,
  JobPostingRegion,
  JobType,
  LinkRegion,
  LinkStatus,
} from '@vtmp/common/constants';
import { filterUndefinedAttributes } from '@/utils/helpers';
import { MONGO_OBJECT_ID_REGEX } from '@/constants/validations';

export const LinkMetaDataSchema = z.object({
  url: z
    .string({ required_error: 'URL is required' })
    .transform((val) => {
      if (!/^https?:\/\//i.test(val)) {
        return `https://${val}`;
      }
      return val;
    })
    .refine(
      (val) => {
        try {
          new URL(val); // Native URL constructor
          return true;
        } catch {
          return false;
        }
      },
      { message: 'Invalid url' }
    ),
});

export type LinkMetaDataType = z.infer<typeof LinkMetaDataSchema>;

export const ExtractionLinkMetaDataSchema = z
  .object({
    url: z.string().optional(),
    status: z
      .nativeEnum(LinkStatus, {
        message: 'Invalid link status',
      })
      .optional(),
    subStatus: z
      .nativeEnum(LinkProcessingSubStatus, {
        message: 'Invalid sub status',
      })
      .optional(),
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
    datePosted: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    jobDescription: z.string().optional(),
    attemptsCount: z.number(),
    lastProcessedAt: z.string().transform((str) => new Date(str)),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'FAILED' && !data.subStatus) {
      ctx.addIssue({
        path: ['subStatus'], // Which field the error is for
        code: z.ZodIssueCode.custom, // Custom validation
        message: 'subStatus is required when status is failed',
      });
    } else if (data.status !== 'FAILED' && data.subStatus) {
      ctx.addIssue({
        path: ['subStatus'], // Which field the error is for
        code: z.ZodIssueCode.custom, // Custom validation
        message: 'subStatus is not allowed when status is not failed',
      });
    }
  });

export type ExtractionLinkMetaDataType = z.infer<
  typeof ExtractionLinkMetaDataSchema
>;

export const JobPostingDataSchema = z
  .object({
    jobTitle: z
      .string({ required_error: 'Job title is required' })
      .min(1, { message: 'Job title cannot be empty' }),

    companyName: z
      .string({ required_error: 'Company name is required' })
      .min(1, { message: 'Company name cannot be empty' }),
    location: z.nativeEnum(JobPostingRegion, {
      message: 'Invalid location',
    }),
    jobFunction: z.nativeEnum(JobFunction, {
      message: 'Invalid job title',
    }),
    jobType: z.nativeEnum(JobType, {
      message: 'Invalid job type',
    }),
    datePosted: z
      .string()
      .transform((str) => new Date(str))
      .refine(
        (date) => {
          const now = new Date();
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return date >= threeMonthsAgo && date <= now;
        },
        {
          message: 'Date must be within the last 3 months',
        }
      )
      .optional(),
    jobDescription: z.string().optional(),
    adminNote: z.string().optional(),
  })
  .transform(filterUndefinedAttributes);

export const LinkIdSchema = z.object({
  linkId: z.string().regex(MONGO_OBJECT_ID_REGEX, 'Invalid job ID format'),
});

export const LinkFilterSchema = z
  .object({
    status: z
      .nativeEnum(LinkStatus, {
        message: 'Invalid link status',
      })
      .optional(),
  })
  .strict({
    message: 'Only allow filtering by given fields',
  })
  .transform(filterUndefinedAttributes);
