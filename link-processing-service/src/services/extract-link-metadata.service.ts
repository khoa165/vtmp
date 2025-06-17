import { EnvConfig } from '@/config/env';
import { buildPrompt, formatJobDescription } from '@/helpers/link.helpers';
import {
  LinkMetaData,
  LinkMetaDataSchema,
  RawAIResponse,
  RawAIResponseSchema,
  ScrapedMetadata,
  ExtractedMetadata,
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
  LinkProcessingSubStatus,
  LinkRegion,
  LinkStatus,
} from '@vtmp/common/constants';
import { mapStringToEnum } from '@/helpers/link.helpers';

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
): Promise<LinkMetaData> => {
  const genAI = await getGoogleGenAI();
  const prompt = await buildPrompt(text);

  const response: GenerateContentResponse = await genAI.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  // Get raw response from AI
  const rawAIResponse = response.text?.replace(/```json|```/g, '').trim();
  if (!rawAIResponse)
    throw new AIResponseEmptyError('AI response was empty', { urls: [url] });

  // JSON.parse it to convert to JS object if it is not null/undefined
  const parsedAIResponse = parseJson(rawAIResponse, url);

  // Validate it against zod schema
  const validatedAIResponse = RawAIResponseSchema.parse(parsedAIResponse);

  // Convert from string to Typescript enum, had to use a separate helper function
  const formattedLinkMetaData: LinkMetaData = {
    jobTitle: validatedAIResponse.jobTitle,
    companyName: validatedAIResponse.companyName,
    location: mapStringToEnum({
      enumObject: LinkRegion,
      value: validatedAIResponse.location,
      fallback: LinkRegion.OTHER,
    }),
    jobFunction: mapStringToEnum({
      enumObject: JobFunction,
      value: validatedAIResponse.jobFunction,
      fallback: JobFunction.SOFTWARE_ENGINEER,
    }),
    jobType: mapStringToEnum({
      enumObject: JobType,
      value: validatedAIResponse.jobType,
      fallback: JobType.INDUSTRY,
    }),
    datePosted: validatedAIResponse.datePosted,
    jobDescription: formatJobDescription(validatedAIResponse.jobDescription),
  };

  return LinkMetaDataSchema.parse(formattedLinkMetaData);
};

export const ExtractLinkMetadataService = {
  extractMetadata: async (
    scrapedLinksMetadata: ScrapedMetadata[]
  ): Promise<ExtractedMetadata[]> => {
    const urls = scrapedLinksMetadata.map((metadata) => metadata.url);
    try {
      const extractedMetadataResults = await Promise.all(
        scrapedLinksMetadata.map(async (metadata) => {
          if (!metadata.processedContent) {
            // Scraping stage failed
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { processedContent, ...rest } = metadata;
            return {
              ...rest,
            };
          }
          try {
            // If this object has processedContent field, meaning it was "decorated" successfully from scraping stage
            // Call function generateMetadata async
            const extractedMetadata = await generateMetadata(
              metadata.processedContent,
              metadata.url
            );
            // Now replace the data field from before (which is a string text) with this new object and return
            return { ...metadata, processedContent: extractedMetadata };
          } catch (error: unknown) {
            logError(error);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { processedContent, ...rest } = metadata;
            // If any error happens, remove the data field (string text from before), and attach processingSubStatus and error fields
            return {
              ...rest,
              status: LinkStatus.FAILED,
              subStatus: LinkProcessingSubStatus.EXTRACTION_FAILED,
              error: String(error),
            };
          }
        })
      );
      return extractedMetadataResults;
    } catch (error: unknown) {
      throw new AIExtractionError(
        'Failed to extract metadata with AI',
        { urls },
        { cause: error }
      );
    }
  },
};
