import { GenerateContentResponse, GoogleGenAI } from '@google/genai';

import {
  JobFunction,
  JobType,
  LinkProcessingFailureStage,
  LinkRegion,
  LinkStatus,
} from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import {
  ExtractedLinkMetadata,
  ExtractedLinkMetadataSchema,
  RawAIResponseSchema,
  ScrapedLink,
  FailedProcessedLink,
  MetadataExtractedLink,
} from '@/types/link-processing.types';
import {
  AIExtractionError,
  AIResponseEmptyError,
  logError,
} from '@/utils/errors';
import { formatJobDescription, stringToEnumValue } from '@/utils/link.helpers';
import { buildPrompt } from '@/utils/prompts';
import { _determineProcessStatus } from '@/utils/retry';

const _getGoogleGenAI = async (): Promise<GoogleGenAI> => {
  const geminiApiKey = EnvConfig.get().GOOGLE_GEMINI_API_KEY;
  return new GoogleGenAI({ apiKey: geminiApiKey });
};

const _generateMetadata = async (
  text: string,
  url: string
): Promise<ExtractedLinkMetadata> => {
  const genAI = await _getGoogleGenAI();
  const prompt = await buildPrompt(text);

  const response: GenerateContentResponse = await genAI.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  // Get raw response from Gemini
  const rawAIResponse = response.text?.replace(/```json|```/g, '').trim();
  if (!rawAIResponse)
    throw new AIResponseEmptyError('AI response was empty', { url });

  const validatedAIResponse = RawAIResponseSchema.parse(
    JSON.parse(rawAIResponse)
  );

  // Convert from string to Typescript enum, had to use a separate helper stringToEnumValue
  const formattedLinkMetadata = {
    jobTitle: validatedAIResponse.jobTitle,
    companyName: validatedAIResponse.companyName,
    location: stringToEnumValue({
      stringValue: validatedAIResponse.location,
      enumObject: LinkRegion,
    }),
    jobFunction: stringToEnumValue({
      stringValue: validatedAIResponse.jobFunction,
      enumObject: JobFunction,
    }),
    jobType: stringToEnumValue({
      stringValue: validatedAIResponse.jobType,
      enumObject: JobType,
    }),
    datePosted: validatedAIResponse.datePosted,
    jobDescription: formatJobDescription(validatedAIResponse.jobDescription),
  };

  return ExtractedLinkMetadataSchema.parse(formattedLinkMetadata);
};

export const ExtractLinkMetadataService = {
  extractMetadata: async (
    scrapedLinks: ScrapedLink[]
  ): Promise<{
    metadataExtractedLinks: MetadataExtractedLink[];
    failedMetadataExtractionLinks: FailedProcessedLink[];
  }> => {
    const MAX_LONG_RETRY = 3;
    const metadataExtractedLinks: MetadataExtractedLink[] = [];
    const failedMetadataExtractionLinks: FailedProcessedLink[] = [];
    await Promise.all(
      scrapedLinks.map(async (link) => {
        try {
          const extractedMetadata = await _generateMetadata(
            link.scrapedText,
            link.url
          );
          metadataExtractedLinks.push({
            ...link,
            extractedMetadata,
            status: LinkStatus.PENDING_ADMIN_REVIEW,
            failureStage: null, // Update failureStage to null to clear any previous failureStage value
          });
        } catch (error: unknown) {
          logError(error);

          failedMetadataExtractionLinks.push({
            ...link,
            status: _determineProcessStatus(
              link.originalRequest,
              MAX_LONG_RETRY
            ),
            failureStage: LinkProcessingFailureStage.EXTRACTION_FAILED,
            error: new AIExtractionError(
              'Failed to extract metadata with AI',
              { url: link.url },
              { cause: error }
            ),
          });
        }
      })
    );

    return { metadataExtractedLinks, failedMetadataExtractionLinks };
  },
};
