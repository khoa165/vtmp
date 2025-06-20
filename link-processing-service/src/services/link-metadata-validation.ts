import {
  LinkRegion,
  JobFunction,
  JobType,
  LinkStatus,
  LinkProcessingFailureStage,
} from '@vtmp/common/constants';
import { z } from 'zod';

/**
 * These schema are specifically for zod validation at AI metadata extraction stage
 */
export const ExtractedLinkMetadataSchema = z
  .object({
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
    datePosted: z.string().optional(),
    jobDescription: z.string().optional(),
  })
  .strict();

export type ExtractedLinkMetadata = z.infer<typeof ExtractedLinkMetadataSchema>;

export const RawJobDescriptionSchema = z
  .object({
    responsibility: z.string().optional(),
    requirement: z.string().optional(),
    preferred: z.string().optional(),
  })
  .strict();

export const RawAIResponseSchema = z
  .object({
    jobTitle: z.string().optional(),
    companyName: z.string().optional(),
    location: z.string().optional(),
    jobFunction: z.string().optional(),
    jobType: z.string().optional(),
    datePosted: z.string().optional(),
    jobDescription: RawJobDescriptionSchema,
  })
  .strict();

export type RawAIResponse = z.infer<typeof RawAIResponseSchema>;

/**
 * These schemas and types are to check link object that was just sent to Lambda
 * SubmittedLink[] is type of input param into LinkProcessorService.processLink()
 * SubmittedLink[] is also the type of input param into LinkValidatorService.validateLinks()
 */
const SubmittedLinkSchema = z.object({
  _id: z.string(),
  originalUrl: z.string().url(),
  attemptsCount: z.number(),
});
export const EventBodySchema = z.object({
  linksData: z.array(SubmittedLinkSchema).min(1),
});
export type SubmittedLink = z.infer<typeof SubmittedLinkSchema>;

/**
 * Output from link validator service are 2 arrays: validatedLinks[] and failedLinks[]
 * Type of each element of validatedLinks is: ValidatedLink
 * Type of each element of failedValidationLinks is: FailedProcessedLink
 * At all stage, in the failedValidationLinks, failedScrapingLinks, failedMetadataExtractionLinks, each element have type FailedProcessedLink
 * The type ValidatedLink is also type of each element in the input array to the next WebScrapingService.scrapeLinks
 */

export interface ValidatedLink {
  originalRequest: SubmittedLink;
  url: string;
}
export interface FailedProcessedLink {
  originalRequest: SubmittedLink;
  url?: string;
  scrapedText?: string;
  status: LinkStatus;
  failureStage: LinkProcessingFailureStage;
  error: unknown;
}

/**
 * WebScrapingService.scrapeLinks receive and array named validatedLinks: ValidatedLink[]
 * WebScrapingService.scrapeLinks returns an object of 2 fields:
 * - scrapedLinks: ScrapedLink[]
 * - failedScrapingLinks: FailedProcessedLink[]
 * The type ScrapedLink is also type of each element in the input array to the next ExtractLinkMetadataService.extractMetadata
 */

export interface ScrapedLink {
  originalRequest: SubmittedLink;
  url: string;
  scrapedText: string;
}

/**
 * ExtractLinkMetadataService.extractMetadata receive and array named scrapedLinks: ScrapedLink[]
 * ExtractLinkMetadataService.extractMetadata returns an object of 2 fields:
 * - metadataExtractedLinks: MetadataExtractedLink[]
 * - failedMetadataExtractionLinks: FailedProcessedLink[]
 */

export interface MetadataExtractedLink {
  originalRequest: SubmittedLink;
  url: string;
  extractedMetadata: ExtractedLinkMetadata;
  status: LinkStatus;
  failureStage: null;
}

export interface UpdateLinkPayload {
  attemptsCount: number;
  lastProcessedAt: string;
  url?: string;
  status: LinkStatus;
  failureStage?: LinkProcessingFailureStage | null;
  jobTitle?: string | undefined;
  companyName?: string | undefined;
  location?: LinkRegion | undefined;
  jobFunction?: JobFunction | undefined;
  jobType?: JobType | undefined;
  datePosted?: string | undefined;
  jobDescription?: string | undefined;
}
