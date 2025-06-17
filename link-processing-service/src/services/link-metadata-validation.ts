import {
  LinkRegion,
  JobFunction,
  JobType,
  LinkStatus,
  LinkProcessingSubStatus,
} from '@vtmp/common/constants';
import { z } from 'zod';
export const LinkMetaDataSchema = z
  .object({
    // This should not have url field
    jobTitle: z.string(),
    companyName: z.string(),
    location: z.nativeEnum(LinkRegion, {
      message: 'Invalid location',
    }),
    jobFunction: z.nativeEnum(JobFunction, {
      message: 'Invalid job title',
    }),
    jobType: z.nativeEnum(JobType, {
      message: 'Invalid job type',
    }),
    datePosted: z.string(),
    jobDescription: z.string(),
  })
  .strict();

export const RawJobDescriptionSchema = z
  .object({
    responsibility: z.string(),
    requirement: z.string(),
    preferred: z.string(),
  })
  .strict();

export const RawAIResponseSchema = z
  .object({
    jobTitle: z.string(),
    companyName: z.string(),
    location: z.string(),
    jobFunction: z.string(),
    jobType: z.string(),
    datePosted: z.string(),
    jobDescription: RawJobDescriptionSchema,
  })
  .strict();

export type LinkMetaData = z.infer<typeof LinkMetaDataSchema>;
export type RawAIResponse = z.infer<typeof RawAIResponseSchema>;

export type ProcessingResult<T> = LinkType & {
  processedContent?: T;
  status?: LinkStatus;
  subStatus?: LinkProcessingSubStatus;
  error?: string;
};
export type ScrapedMetadata = ProcessingResult<string>;
export type ExtractedMetadata = ProcessingResult<LinkMetaData>;

const LinkSchema = z.object({
  _id: z.string(),
  url: z.string().url(),
  attemptsCount: z.number(),
});
export const EventBodySchema = z.object({
  linksData: z.array(LinkSchema).min(1),
});
export type LinkType = z.infer<typeof LinkSchema>;

export interface UpdateLinkPayload {
  lastProcessedAt: Date;
  jobTitle?: string;
  companyName?: string;
  location?: LinkRegion;
  jobFunction?: JobFunction;
  jobType?: JobType;
  datePosted?: string;
  jobDescription?: string;
  attemptsCount: number;
  status?: LinkStatus;
  subStatus?: LinkProcessingSubStatus;
}
