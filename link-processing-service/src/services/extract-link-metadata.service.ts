import { EnvConfig } from '@/config/env';
import {
  extractLinkMetaDatPrompt,
  formatJobDescription,
} from '@/helpers/link.helpers';
import {
  LinkMetaData,
  LinkMetaDataSchema,
} from '@/services/link-metadata-validation';
import { GenerateContentResponse } from '@google/genai';
import { GoogleGenAI } from '@google/genai';
// import { ResourceNotFoundError } from '@/utils/errors';
// import puppeteer, { Browser, Page } from 'puppeteer';
import puppeteer, { Browser, Page } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const getGoogleGenAI = async (): Promise<GoogleGenAI> => {
  const geminiApiKey = EnvConfig.get().GOOGLE_GEMINI_API_KEY;
  // if (!geminiApiKey) {
  //   throw new ResourceNotFoundError('GOOGLE_GEMINI_API_KEY is not set', {
  //     key: geminiApiKey,
  //   });
  // }
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
  // const browser: Browser = await puppeteer.launch({ headless: true });
  // Instead of the default Puppeteer Chrominum browser, use the Chromium browser
  // supplied by @sparticuz/chromium libary for compatibility with serverless Lambda
  const browser: Browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
  const page: Page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' }); // Make sure the page is fully loaded before proceeding

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
