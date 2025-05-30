import {
  extractLinkMetaDatPrompt,
  formatJobDescription,
} from 'helpers/link.helpers';
import { LinkMetaData } from '@/types/link.types';
import { Builder, Browser, By } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { GoogleGenAI } from '@google/genai';
import { ResourceNotFoundError } from '@/utils/errors';
export const ExtractLinkMetadataService = {
  generateMetaData: async (
    extractedText: string,
    url: string
  ): Promise<LinkMetaData | { url: string }> => {
    const geminiApiKey = process.env.Google_Gemini_API_KEY;
    if (!geminiApiKey) {
      throw new ResourceNotFoundError('Google_Gemini_API_KEY is not set', {
        key: process.env.Google_Gemini_API_KEY,
      });
    }
    const genAI: GoogleGenAI = new GoogleGenAI({
      apiKey: geminiApiKey,
    });

    const prompt = await extractLinkMetaDatPrompt(extractedText);

    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    // console.log(response.text);
    // return { url };
    if (!response.text) {
      return { url };
    } else {
      try {
        const parsedResponse = JSON.parse(
          response.text.replace(/```json|```/g, '').trim()
        );
        console.log(response.text);
        console.log({
          ...parsedResponse,
          jobDescription: formatJobDescription(parsedResponse.jobDescription),
          url,
        });
        // return { ...parsedResponse, url };
        return { url };
      } catch (error) {
        console.log(response.text.replace(/```json|```/g, '').trim());
        console.log(error);
        return { url };
      }
    }
    return { url };
  },

  scrapeWebsite: async (url: string): Promise<string> => {
    const options = new chrome.Options();
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    const driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(options)
      .build();
    try {
      await driver.get(url);
      await driver.sleep(3000);
      const jobPostingText = await driver.findElement(By.css('body')).getText();
      console.log(jobPostingText);
      return jobPostingText;
    } finally {
      await driver.quit();
    }
  },

  extractMetadata: async (url: string): Promise<LinkMetaData | null> => {
    //const extractedText = await ExtractLinkMetadataService.scrapeWebsite(url);
    //return ExtractLinkMetadataService.generateMetaData(extractedText, url);
    return null;
  },
};
