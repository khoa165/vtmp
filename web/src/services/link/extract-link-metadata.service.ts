import {
  extractLinkMetaDatPrompt,
  formatJobDescription,
} from '@/services/link/link.helpers';
import {
  LinkMetaData,
  LinkMetaDataSchema,
} from '@/services/link/link-metadata-validation';
import { GenerateContentResponse, GoogleGenAI } from '@google/genai';
import { ResourceNotFoundError } from '@/utils/errors';
import puppeteer, { Browser, Page } from 'puppeteer';
import { NotRetryableError } from 'ts-retry-promise';
import { EnvConfig } from '@/config/env';

const getGoogleGenAI = async (): Promise<GoogleGenAI> => {
  const geminiApiKey = EnvConfig.get().GOOGLE_GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new ResourceNotFoundError('GOOGLE_GEMINI_API_KEY is not set', {
      key: geminiApiKey,
    });
  }
  return new GoogleGenAI({ apiKey: geminiApiKey });
};

const generateMetaData = async (
  extractedText: string,
  url: string
): Promise<LinkMetaData> => {
  const genAI = await getGoogleGenAI();
  const prompt = await extractLinkMetaDatPrompt(extractedText);

  const response: GenerateContentResponse = await genAI.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  const text = response.text?.replace(/```json|```/g, '').trim();
  if (!text) return { url };

  const parsedResponse = JSON.parse(text);

  const formattedLinkMetaData: LinkMetaData = {
    url,
    ...parsedResponse,
    jobDescription: formatJobDescription(parsedResponse.jobDescription),
  };

  if (
    !formattedLinkMetaData.jobTitle ||
    !formattedLinkMetaData.companyName ||
    !formattedLinkMetaData.jobDescription
  ) {
    return { url };
  }

  return LinkMetaDataSchema.parse(formattedLinkMetaData);
};

const scrapeWebsite = async (url: string): Promise<string> => {
  const browser: Browser = await puppeteer.launch({ headless: true });
  const page: Page = await browser.newPage();

  const response = await page.goto(url, { waitUntil: 'networkidle2' });
  if (response?.status() === 403) {
    throw new NotRetryableError('Forbidden');
  }

  const bodyText: string = await page.$eval(
    'body',
    (el: HTMLBodyElement) => el.innerText
  );

  await browser.close();
  return bodyText;
};

const ExtractLinkMetadataService = {
  extractMetadata: async (
    url: string
  ): Promise<LinkMetaData | { url: string }> => {
    const extractedText = await scrapeWebsite(url);
    return await generateMetaData(extractedText, url);
  },
};

export { scrapeWebsite, generateMetaData, ExtractLinkMetadataService };
