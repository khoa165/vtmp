import { z } from 'zod';

import { SubmittedLinkSchema, SubmittedLink } from '@vtmp/common/constants';

/**
 * These schema are specifically for zod validation at AI metadata extraction stage
 */
const JobDescriptionSchema = z
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
    jobDescription: JobDescriptionSchema.optional(),
    aiNote: z.string().optional(),
    aiScore: z.number().min(0).max(100),
  })
  .strict();

export const EventBodySchema = z.object({
  linksData: z.array(SubmittedLinkSchema).min(1),
});

/**
 * Output from link validator service are 2 arrays: `validatedLinks[]` and `failedLinks[]`
 *
 * Type of each element of validatedLinks is: ValidatedLink
 *
 * Type of each element of failedValidationLinks is: FailedProcessedLink
 *
 * At all stage, in the failedValidationLinks, failedScrapingLinks, failedMetadataExtractionLinks, each element have type FailedProcessedLink

 * The type ValidatedLink is also type of each element in the input array to the next WebScrapingService.scrapeLinks()
 */

export interface ValidatedLink {
  originalRequest: SubmittedLink;
  url: string;
}

/**
 * WebScrapingService.scrapeLinks receive and array named validatedLinks: `ValidatedLink[]`
 *
 * WebScrapingService.scrapeLinks returns an object of 2 fields:
 *
 * - scrapedLinks: ScrapedLink[]
 * - failedScrapingLinks: FailedProcessedLink[]
 *
 * The type ScrapedLink is also type of each element in the input array to the next ExtractLinkMetadataService.extractMetadata
 */

export interface ScrapedLink {
  originalRequest: SubmittedLink;
  url: string;
  scrapedText: string;
}
