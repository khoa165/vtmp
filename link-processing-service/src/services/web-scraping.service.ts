import chromium from '@sparticuz/chromium';
import pLimit from 'p-limit';
import puppeteer, { Browser, Page } from 'puppeteer-core';

import { LinkProcessingFailureStage } from '@vtmp/common/constants';

import {
  FailedProcessedLink,
  ScrapedLink,
  ValidatedLink,
} from '@/types/link-processing.types';
import { logError, ScrapingError } from '@/utils/errors';
import { _determineProcessStatus } from '@/utils/retry';

const _launchBrowserInstance = async (): Promise<Browser> => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  return browser;
};

const _scrapeWebpage = async (page: Page, url: string): Promise<string> => {
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
  scrapeLinks: async (
    validatedLinks: ValidatedLink[]
  ): Promise<{
    scrapedLinks: ScrapedLink[];
    failedScrapingLinks: FailedProcessedLink[];
  }> => {
    // Create a limiter with CONCURRENCY_LIMIT
    const CONCURRENCY_LIMIT = 5;
    const limit = pLimit(CONCURRENCY_LIMIT);
    const MAX_LONG_RETRY = 3;

    // Open only 1 Chrominum browser process
    const browser = await _launchBrowserInstance();

    const scrapedLinks: ScrapedLink[] = [];
    const failedScrapingLinks: FailedProcessedLink[] = [];

    await Promise.all(
      validatedLinks.map((validatedLink) =>
        // Instead of calling async function directly, wrap it with the limiter
        // The limiter ensures that only CONCURRENCY_LIMIT promises are running at anytime
        // When one batch finises, the next queued tasks batch starts
        limit(async () => {
          // Open a new Chromium tab
          const page = await browser.newPage();
          try {
            const scrapedText = await _scrapeWebpage(page, validatedLink.url);
            scrapedLinks.push({ ...validatedLink, scrapedText });
          } catch (error: unknown) {
            logError(error);

            failedScrapingLinks.push({
              ...validatedLink,
              status: _determineProcessStatus(
                validatedLink.originalRequest,
                MAX_LONG_RETRY
              ),
              failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
              error: new ScrapingError(
                'Failed to scrap url',
                {
                  url: validatedLink.url,
                },
                { cause: error }
              ),
            });
          } finally {
            await page.close();
          }
        })
      )
    );

    await browser.close();
    return { scrapedLinks, failedScrapingLinks };
  },
};
