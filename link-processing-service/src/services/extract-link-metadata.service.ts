import { GoogleGenAI } from '@google/genai';

import {
  ExtractedLinkMetadataSchema,
  ExtractedLinkMetadata,
  FailedProcessedLink,
  MetadataExtractedLink,
  SubmittedLink,
  JobFunction,
  JobType,
  LinkProcessingFailureStage,
  LinkRegion,
  LinkStatus,
} from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import {
  RawAIResponseSchema,
  ScrapedLink,
} from '@/types/link-processing.types';
import { AIExtractionError, logError } from '@/utils/errors';
import { formatJobDescription, stringToEnumValue } from '@/utils/link.helpers';
import { buildPrompt } from '@/utils/prompts';

const MAX_LONG_RETRY = 4;
export const ExtractLinkMetadataService = {
  async _generateContent(prompt: string): Promise<{ text: string }> {
    const geminiApiKey = EnvConfig.get().GOOGLE_GEMINI_API_KEY;
    const genAI = new GoogleGenAI({ apiKey: geminiApiKey });
    const MODEL_NAME = 'gemini-2.0-flash';
    const response = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return { text: response.text ? response.text : '' };
  },
  async _generateMetadata(
    text: string,
    url: string
  ): Promise<ExtractedLinkMetadata> {
    const prompt = await buildPrompt(text);
    const response = await this._generateContent(prompt);
    // Get raw response from Gemini
    const rawAIResponse = response.text?.replace(/```json|```/g, '').trim();
    if (!rawAIResponse)
      throw new AIExtractionError('AI response was empty', { url });

    const {
      jobTitle,
      companyName,
      location,
      jobFunction,
      jobType,
      datePosted,
      jobDescription,
    } = RawAIResponseSchema.parse(JSON.parse(rawAIResponse));

    // Convert from string to Typescript enum, had to use a separate helper stringToEnumValue
    const formattedLinkMetadata = {
      jobTitle,
      companyName,
      location: stringToEnumValue({
        stringValue: location,
        enumObject: LinkRegion,
      }),
      jobFunction: stringToEnumValue({
        stringValue: jobFunction,
        enumObject: JobFunction,
      }),
      jobType: stringToEnumValue({
        stringValue: jobType,
        enumObject: JobType,
      }),
      datePosted,
      jobDescription: formatJobDescription(jobDescription),
    };

    return ExtractedLinkMetadataSchema.parse(formattedLinkMetadata);
  },
  /**
   * Decide on whether link should be long retried.
   * @param originalRequest
   * @param maxLongRetry
   */
  _determineProcessStatus(
    originalRequest: SubmittedLink,
    maxLongRetry: number
  ): LinkStatus {
    if (originalRequest.attemptsCount >= maxLongRetry) {
      return LinkStatus.PIPELINE_FAILED;
    }
    return LinkStatus.PENDING_RETRY;
  },

  async extractMetadata(scrapedLinks: ScrapedLink[]): Promise<{
    metadataExtractedLinks: MetadataExtractedLink[];
    failedMetadataExtractionLinks: FailedProcessedLink[];
  }> {
    const metadataExtractedLinks: MetadataExtractedLink[] = [];
    const failedMetadataExtractionLinks: FailedProcessedLink[] = [];

    if (scrapedLinks.length === 0) {
      console.warn(
        '[ExtractLinkMetadataService] WARN: Empty scrapedLinks. Will not extract metadata for any links for this run.'
      );
      return { metadataExtractedLinks, failedMetadataExtractionLinks };
    }

    await Promise.all(
      scrapedLinks.map(async (link) => {
        try {
          const extractedMetadata = await this._generateMetadata(
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
            status: this._determineProcessStatus(
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
