import { z } from 'zod';

import {
  LinkProcessingFailureStage,
  JobFunction,
  JobType,
  LinkRegion,
  LinkStatus,
} from '@vtmp/common/constants';

export const ExtractedLinkMetadataSchema = z
  .object({
    jobTitle: z.string().optional(),
    companyName: z.string().optional(),
    location: z
      .nativeEnum(LinkRegion, {
        message: 'Invalid AI generated location',
      })
      .optional(),
    jobFunction: z
      .nativeEnum(JobFunction, {
        message: 'Invalid AI generated job title',
      })
      .optional(),
    jobType: z
      .nativeEnum(JobType, {
        message: 'Invalid AI generated job type',
      })
      .optional(),
    datePosted: z.string().optional(),
    jobDescription: z.string().optional(),
    aiNote: z.string().optional(),
  })
  .strict();

export type ExtractedLinkMetadata = z.infer<typeof ExtractedLinkMetadataSchema>;

export const UpdateLinkPayloadSchema = ExtractedLinkMetadataSchema.extend({
  attemptsCount: z.number(),
  lastProcessedAt: z.string(),
  url: z.string().optional(),
  status: z.nativeEnum(LinkStatus),
  failureStage: z.nativeEnum(LinkProcessingFailureStage).nullable().optional(),
});

export type UpdateLinkPayload = z.infer<typeof UpdateLinkPayloadSchema>;

/**
 * These schemas and types are to check link object that was sent to Lambda
 * SubmittedLink[] is type of input param into LinkProcessorService.processLink()
 * SubmittedLink[] is also the type of input param into LinkValidatorService.validateLinks()
 */
export const SubmittedLinkSchema = z.object({
  _id: z.string(),
  originalUrl: z.string().url(),
  attemptsCount: z.number(),
});

export type SubmittedLink = z.infer<typeof SubmittedLinkSchema>;

export interface MetadataExtractedLink {
  originalRequest: SubmittedLink;
  url: string;
  scrapedText: string;
  extractedMetadata: ExtractedLinkMetadata;
  status: LinkStatus;
  failureStage: null;
}

export const MetadataExtractedLinkSchema = z.object({
  originalRequest: SubmittedLinkSchema,
  url: z.string().url(),
  scrapedText: z.string(),
  extractedMetadata: ExtractedLinkMetadataSchema,
  status: z.nativeEnum(LinkStatus, { message: 'Invalid LinkStatus' }),
  failureStage: z.null(), // always null
});

export interface FailedProcessedLink {
  originalRequest: SubmittedLink;
  url?: string;
  scrapedText?: string;
  status: LinkStatus;
  failureStage: LinkProcessingFailureStage;
  error: unknown;
}

export const FailedProcessedLinkSchema = z.object({
  originalRequest: SubmittedLinkSchema,
  url: z.string().url().optional(),
  scrapedText: z.string().optional(),
  status: z.nativeEnum(LinkStatus, { message: 'Invalid LinkStatus' }),
  failureStage: z.nativeEnum(LinkProcessingFailureStage, {
    message: 'Invalid failure stage',
  }),
  error: z.unknown(), // since error is type `unknown`
});
