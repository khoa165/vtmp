import { EnvConfig } from '@/config/env';
import { buildPrompt, formatJobDescription } from '@/helpers/link.helpers';
import {
  ExtractedLinkMetadata,
  ExtractedLinkMetadataSchema,
  RawAIResponse,
  RawAIResponseSchema,
  ScrapedLink,
  FailedProcessedLink,
  MetadataExtractedLink,
} from '@/services/link-metadata-validation';
import {
  AIExtractionError,
  AIResponseEmptyError,
  InvalidJsonError,
  logError,
} from '@/utils/errors';
import { GenerateContentResponse, GoogleGenAI } from '@google/genai';
import {
  JobFunction,
  JobType,
  LinkProcessingFailureStage,
  LinkRegion,
  LinkStatus,
} from '@vtmp/common/constants';
import { stringToEnumValue } from '@/helpers/link.helpers';

const getGoogleGenAI = async (): Promise<GoogleGenAI> => {
  const geminiApiKey = EnvConfig.get().GOOGLE_GEMINI_API_KEY;
  return new GoogleGenAI({ apiKey: geminiApiKey });
};

const parseJson = (text: string, url: string): RawAIResponse => {
  try {
    return JSON.parse(text);
  } catch {
    throw new InvalidJsonError('Invalid JSON format in AI response', {
      urls: [url],
    });
  }
};

const generateMetadata = async (
  text: string,
  url: string
): Promise<ExtractedLinkMetadata> => {
  const genAI = await getGoogleGenAI();
  // const prompt = await buildPrompt(text);
  const prompt = await buildPrompt(text);

  const response: GenerateContentResponse = await genAI.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  // Get raw response from Gemini
  const rawAIResponse = response.text?.replace(/```json|```/g, '').trim();
  if (!rawAIResponse)
    throw new AIResponseEmptyError('AI response was empty', { urls: [url] });
  // JSON.parse it to convert to JS object
  const parsedAIResponse = parseJson(rawAIResponse, url);
  // Validate against zod schema
  const validatedAIResponse = RawAIResponseSchema.parse(parsedAIResponse);

  // Convert from string to Typescript enum, had to use a separate helper function
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

const _shouldLongRetry = (attempsCount: number) => {
  if (attempsCount < 3) {
    return true;
  } else {
    return false;
  }
};

export const ExtractLinkMetadataService = {
  extractMetadata: async (
    scrapedLinks: ScrapedLink[]
  ): Promise<{
    metadataExtractedLinks: MetadataExtractedLink[];
    failedMetadataExtractionLinks: FailedProcessedLink[];
  }> => {
    // Get all the urls for logging
    const urls = scrapedLinks.map((scrapedLink) => scrapedLink.url);
    try {
      const metadataExtractedLinks: MetadataExtractedLink[] = [];
      const failedMetadataExtractionLinks: FailedProcessedLink[] = [];
      const results = await Promise.all(
        scrapedLinks.map(async (link) => {
          try {
            const extractedMetadata = await generateMetadata(
              link.scrapedText,
              link.url
            );
            return {
              ...link,
              extractedMetadata,
              status: LinkStatus.PENDING_ADMIN_REVIEW,
              failureStage: null, // Update failureStage to null to clear any previous failureStage value
            };
          } catch (error: unknown) {
            logError(error);

            if (_shouldLongRetry(link.originalRequest.attemptsCount)) {
              return {
                ...link,
                status: LinkStatus.PENDING_RETRY,
                failureStage: LinkProcessingFailureStage.EXTRACTION_FAILED,
                error,
              };
            }

            return {
              ...link,
              status: LinkStatus.PIPELINE_FAILED,
              failureStage: LinkProcessingFailureStage.EXTRACTION_FAILED,
              error,
            };
          }
        })
      );

      // Sort results into metadataExtractedLinks and failedMetadataExtractionLinks
      for (const result of results) {
        if ('error' in result) {
          failedMetadataExtractionLinks.push(result);
        } else {
          metadataExtractedLinks.push(result);
        }
      }
      return { metadataExtractedLinks, failedMetadataExtractionLinks };
    } catch (error: unknown) {
      throw new AIExtractionError(
        'Failed to extract metadata with AI',
        { urls },
        { cause: error }
      );
    }
  },
};
