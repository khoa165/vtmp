import {
  LinkRegion,
  JobFunction,
  JobType,
  LinkStatus,
  LinkProcessingFailureStage,
} from '@vtmp/common/constants';
import { z } from 'zod';
export const LinkMetaDataSchema = z
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

export type LinkMetaData = z.infer<typeof LinkMetaDataSchema>;

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

const SubmittedLinkSchema = z.object({
  _id: z.string(),
  originalUrl: z.string().url(),
  attemptsCount: z.number(),
});
export const EventBodySchema = z.object({
  linksData: z.array(SubmittedLinkSchema).min(1),
});

// Input into LinkProcessingService.proceesLink & LinkValidator
export interface ISubmittedLink {
  _id: string;
  originalUrl: string;
  attemptsCount: number;
}

// const validatedLinks: ProcessedLink[];
// const failedLinks: LinkProcessingError[];

/**
 * ENTRYPOINT: links
 * const {validatedLinks,failedLinks} = await LinkValidatorServie.validateLinks(links);
 * const metadatas = await LinkScrapingService.scrapeLinks(validatedLinks);
 *
 */

// Output/return from ValidationService , input/param into ScrapingService

export type ScrapedLink = ISubmittedLink & {
  metadata: string[];
};

export type AIExtractedMetadataLink = ISubmittedLink & {
  metadata: string[];
  abc: string;
  xyz: string;
};

export type LinkProcessingError = ISubmittedLink & {
  status: LinkStatus;
  failureStage: LinkProcessingFailureStage;
  error: Error;
};

// scraping failed
// const scrapingFailedRetry: LinkProcessingError = {
//   status: LinkStatus.PENDING_RETRY
//   failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
//   shouldLongRetry: true,
//   error: new ScrapingError("Failed to asdasdasd")
// }

// const scrapingFailedNoRetry: LinkProcessingError = {
//   status: LinkStatus.PIPELINE_FAILED
//   failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
//   shouldLongRetry: false,
//   error: new ScrapingError("Failed to asdasdasd")
// }

export interface IValidatedLink {
  originalUrl: string;
  url: string;
  attemptsCount: number;
}

export type LinkProcessingResult<T> = IValidatedLink & {
  processedContent?: T;
  status?: LinkStatus;
  subStatus?: LinkProcessingFailureStage;
  error?: string;
};
export type ScrapedMetadataResult = LinkProcessingResult<string>;
export type ExtractedMetadataResult = LinkProcessingResult<LinkMetaData>;

export interface UpdateLinkPayload {
  url?: string;
  originalUrl?: string;
  jobTitle?: string | undefined;
  companyName?: string | undefined;
  location?: LinkRegion | undefined;
  jobFunction?: JobFunction | undefined;
  jobType?: JobType | undefined;
  datePosted?: string | undefined;
  jobDescription?: string | undefined;
  status?: LinkStatus;
  subStatus?: LinkProcessingFailureStage;
  attemptsCount: number;
  lastProcessedAt: string;
}
