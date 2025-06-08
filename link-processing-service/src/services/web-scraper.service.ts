import puppeteer, { Browser, Page } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { ScrapingError } from '@/utils/errors';

export const ScraperService = {
  scrapeWebsite: async (url: string): Promise<string> => {
    let browser: Browser | null = null;
    try {
      // Instead of the default Puppeteer Chrominum browser, use the Chromium browser
      // supplied by @sparticuz/chromium libary for compatibility with serverless Lambda
      browser = await puppeteer.launch({
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

      // await browser.close();
      return bodyText;
    } catch (error) {
      throw new ScrapingError('Failed to scrap URL', { url }, { cause: error });
    } finally {
      // Make sure to clean up resources even if error occurs
      if (browser) {
        await browser.close();
      }
    }
  },
};
