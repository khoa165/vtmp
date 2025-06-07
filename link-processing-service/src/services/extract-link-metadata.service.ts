import { EnvConfig } from '@/config/env';
import { buildPrompt, formatJobDescription } from '@/helpers/link.helpers';
import {
  LinkMetaData,
  LinkMetaDataSchema,
  RawAIResponse,
  RawAIResponseSchema,
} from '@/services/link-metadata-validation';
import { GenerateContentResponse } from '@google/genai';
import { GoogleGenAI } from '@google/genai';
// import { ResourceNotFoundError } from '@/utils/errors';
import { JobFunction, JobType, LinkRegion } from '@vtmp/common/constants';

const getGoogleGenAI = async (): Promise<GoogleGenAI> => {
  const geminiApiKey = EnvConfig.get().GOOGLE_GEMINI_API_KEY;
  // if (!geminiApiKey) {
  //   throw new ResourceNotFoundError('GOOGLE_GEMINI_API_KEY is not set', {
  //     key: geminiApiKey,
  //   });
  // }
  return new GoogleGenAI({ apiKey: geminiApiKey });
};

const parseJson = (text: string): RawAIResponse | null => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const mapStringToEnum = <T extends Record<string, string>>({
  enumObject,
  value,
  fallback,
}: {
  enumObject: T;
  value: string;
  fallback: T[keyof T];
}): T[keyof T] => {
  const match = Object.values(enumObject).find((v) => v === value);
  if (!match) {
    return fallback;
  }
  return match as T[keyof T];
};

const generateMetaData = async (
  extractedText: string,
  url: string
): Promise<LinkMetaData | { url: string }> => {
  const genAI = await getGoogleGenAI();
  const prompt = await buildPrompt(extractedText);

  const response: GenerateContentResponse = await genAI.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  // Get raw response from AI
  const rawAIResponse = response.text?.replace(/```json|```/g, '').trim();
  if (!rawAIResponse) return { url };

  // JSON.parse it to convert to JS object if it is not null/undefined
  const parsedAIResponse = parseJson(rawAIResponse);

  // Validate it against zod schema
  const validated = RawAIResponseSchema.safeParse(parsedAIResponse);
  if (!validated.success) {
    return { url };
  }

  const validatedAIResponse = validated.data;

  // Convert from string to Typescript enum, had to use a separate helper function
  const formattedLinkMetaData: LinkMetaData = {
    url,
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

  const result = LinkMetaDataSchema.safeParse(formattedLinkMetaData);
  return result.success ? result.data : { url };
};

const ExtractLinkMetadataService = {
  extractMetadata: async (
    url: string,
    extractedText: string
  ): Promise<LinkMetaData | { url: string }> => {
    try {
      return generateMetaData(extractedText, url);
    } catch {
      return { url };
    }
  },
};

export { generateMetaData, ExtractLinkMetadataService };
