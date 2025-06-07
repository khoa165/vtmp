import puppeteer, { Browser, Page } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const ScraperService = {
  scrapeWebsite: async (url: string): Promise<string> => {
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
  },
};
