import puppeteer, { Browser, Page } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { logError, ScrapingError } from '@/utils/errors';
import { LinkProcessingSubStatus, LinkStatus } from '@vtmp/common/constants';
import { LinkType, ScrapedMetadata } from '@/services/link-metadata-validation';

const launchBrowserInstance = async (): Promise<Browser> => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  return browser;
};

const scrapeWebpage = async (page: Page, url: string): Promise<string> => {
  // Instead of the default Puppeteer Chrominum browser, use the Chromium browser
  // supplied by @sparticuz/chromium library for compatibility with serverless Lambda
  await page.goto(url, { waitUntil: 'networkidle2' }); // Make sure the page is fully loaded before proceeding
  const bodyText: string = await page.$eval(
    'body',
    (el: HTMLBodyElement) => el.innerText
  );
  return bodyText;
};

export const WebScrapingService = {
  scrapeLinks: async (linksData: LinkType[]): Promise<ScrapedMetadata[]> => {
    const urls = linksData.map((linkData) => linkData.url);
    const browser = await launchBrowserInstance();
    try {
      const results = await Promise.all(
        linksData.map(async (linkData) => {
          const page = await browser.newPage();
          try {
            const processedContent = await scrapeWebpage(page, linkData.url);
            return { ...linkData, processedContent };
          } catch (error: unknown) {
            logError(error);
            return {
              ...linkData,
              status: LinkStatus.FAILED,
              subStatus: LinkProcessingSubStatus.SCRAPING_FAILED,
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
