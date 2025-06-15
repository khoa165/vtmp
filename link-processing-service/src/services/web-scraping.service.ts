import puppeteer, { Browser, Page } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { logError, ScrapingError } from '@/utils/errors';
import { LinkProcessingSubStatus } from '@vtmp/common/constants';
import { LinkMetaData } from '@/services/link-metadata-validation';

const launchBrowserInstance = async (): Promise<Browser> => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  return browser;
};

const scrapeWebsite = async (page: Page, url: string): Promise<string> => {
  // Instead of the default Puppeteer Chrominum browser, use the Chromium browser
  // supplied by @sparticuz/chromium library for compatibility with serverless Lambda
  await page.goto(url, { waitUntil: 'networkidle2' }); // Make sure the page is fully loaded before proceeding
  const bodyText: string = await page.$eval(
    'body',
    (el: HTMLBodyElement) => el.innerText
  );
  return bodyText;
};

export interface IProcessingResult<T> {
  url: string;
  processingSubStatus?: LinkProcessingSubStatus;
  data?: T;
  error?: string;
}
export type IScrapedMetadata = IProcessingResult<string>;
export type IExtractedMetadata = IProcessingResult<LinkMetaData>;
export type MetadataPipelineResult = IExtractedMetadata | IScrapedMetadata;

export const WebScrapingService = {
  // scrapeWebsite: async (url: string): Promise<string> => {
  //   let browser: Browser | null = null;
  //   try {
  //     // Instead of the default Puppeteer Chrominum browser, use the Chromium browser
  //     // supplied by @sparticuz/chromium library for compatibility with serverless Lambda
  //     browser = await puppeteer.launch({
  //       args: chromium.args,
  //       executablePath: await chromium.executablePath(),
  //       headless: true,
  //     });
  //     const page: Page = await browser.newPage();
  //     await page.goto(url, { waitUntil: 'networkidle2' }); // Make sure the page is fully loaded before proceeding
  //     const bodyText: string = await page.$eval(
  //       'body',
  //       (el: HTMLBodyElement) => el.innerText
  //     );
  //     return bodyText;
  //   } catch (error: unknown) {
  //     throw new ScrapingError('Failed to scrap URL', { url }, { cause: error });
  //   } finally {
  //     // Make sure to clean up resources even if error occurs
  //     if (browser) {
  //       await browser.close();
  //     }
  //   }
  // },

  entryPoint: async (urls: string[]): Promise<IScrapedMetadata[]> => {
    const browser = await launchBrowserInstance();
    try {
      const results = await Promise.all(
        urls.map(async (url) => {
          const page = await browser.newPage();
          try {
            const data = await scrapeWebsite(page, url);
            return { url, data };
          } catch (error: unknown) {
            logError(error);
            return {
              url,
              status: LinkProcessingSubStatus.SCRAPING_FAILED,
              error: String(error),
            };
          } finally {
            await page.close();
          }
        })
      );
      return results;
    } catch (error: unknown) {
      throw new ScrapingError(
        'Failed to scrap URLs',
        { urls },
        { cause: error }
      );
    } finally {
      await browser.close();
    }
  },
};
