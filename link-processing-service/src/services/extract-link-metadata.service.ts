import { EnvConfig } from '@/config/env';
import { buildPrompt, formatJobDescription } from '@/helpers/link.helpers';
import {
  LinkMetaData,
  LinkMetaDataSchema,
  RawAIResponse,
  RawAIResponseSchema,
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
} from '@vtmp/common/constants';
import { mapStringToEnum } from '@/helpers/link.helpers';
import {
  IScrapedMetadata,
  MetadataPipelineResult,
} from '@/services/web-scraping.service';

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

const generateMetaData = async (
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

const ExtractLinkMetadataService = {
  // extractMetadata: async (
  //   url: string,
  //   extractedText: string
  // ): Promise<LinkMetaData> => {
  //   try {
  //     return generateMetaData(extractedText, url);
  //   } catch (error: unknown) {
  //     throw new AIExtractionError(
  //       'Failed to extract metadata with AI',
  //       { url },
  //       { cause: error }
  //     );
  //   }
  // },

  extractMetadata: async (
    inputs: IScrapedMetadata[]
  ): Promise<MetadataPipelineResult[]> => {
    try {
      const extractedMetadataResults = await Promise.all(
        inputs.map(async (input) => {
          if (input.data) {
            try {
              // If this object has data field, meaning it was "decorated" successfully from scraping stage
              // Call function generateMetaData async
              const newMetadataObject = await generateMetaData(
                input.data,
                input.url
              );
              // Now replace the data field from before (which is a string text) with this new object and return
              return { url: input.url, data: newMetadataObject };
            } catch (error: unknown) {
              logError(error);
              // If any error happens, remove the data field (string text from before), and attach processingSubStatus and error fields
              return {
                url: input.url,
                processingSubStatus: LinkProcessingSubStatus.EXTRACTION_FAILED,
                error: String(error),
              };
            }
          } else {
            // This means it does not have `data` field, meaning it error out from scraping stage
            // So just return the original object input
            return input;
          }
        })
      );
      return extractedMetadataResults;
    } catch (error: unknown) {
      const urls = inputs.map((input) => input.url);
      throw new AIExtractionError(
        'Failed to extract metadata with AI',
        { urls },
        { cause: error }
      );
    }
  },
};

export { ExtractLinkMetadataService };
