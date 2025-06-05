import {
  extractLinkMetaDatPrompt,
  formatJobDescription,
} from '@/helpers/link.helpers';
import { LinkMetaData } from '@/types/link.types';
import { GenerateContentResponse } from '@google/genai';
import { GoogleGenAI } from '@google/genai';
import { ResourceNotFoundError } from '@/utils/errors';
import puppeteer, { Browser, Page } from 'puppeteer';

const getGoogleGenAI = async (): Promise<GoogleGenAI> => {
  const geminiApiKey = process.env.Google_Gemini_API_KEY;
  if (!geminiApiKey) {
    throw new ResourceNotFoundError('Google_Gemini_API_KEY is not set', {
      key: geminiApiKey,
    });
  }
  return new GoogleGenAI({ apiKey: geminiApiKey });
};

const generateMetaData = async (
  extractedText: string,
  url: string
): Promise<LinkMetaData | { url: string }> => {
  const genAI = await getGoogleGenAI();
  const prompt = await extractLinkMetaDatPrompt(extractedText);

  const response: GenerateContentResponse = await genAI.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  const text = response.text?.replace(/```json|```/g, '').trim();
  console.log('Response from AI:', text);
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

  return formattedLinkMetaData;
};

const scrapeWebsite = async (url: string): Promise<string> => {
  const browser: Browser = await puppeteer.launch({ headless: true });
  const page: Page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

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
    try {
      const extractedText = await scrapeWebsite(url);
      return generateMetaData(extractedText, url);
    } catch {
      return { url };
    }
  },
};

export { scrapeWebsite, generateMetaData, ExtractLinkMetadataService };
