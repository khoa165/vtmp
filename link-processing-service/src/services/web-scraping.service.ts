import chromium from '@sparticuz/chromium';
import pLimit from 'p-limit';
import puppeteer, { Browser, Page } from 'puppeteer-core';

import {
  FailedProcessedLink,
  SubmittedLink,
  LinkProcessingFailureStage,
  LinkStatus,
} from '@vtmp/common/constants';

import { ScrapedLink, ValidatedLink } from '@/types/link-processing.types';
import { logError, ScrapingError } from '@/utils/errors';

const _launchBrowserInstance = async (): Promise<Browser> => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  return browser;
};

export const WebScrapingService = {
  async getBodyText(page: Page, url: string): Promise<string> {
    // Instead of the default Puppeteer Chrominum browser, use the Chromium browser
    // supplied by @sparticuz/chromium library for compatibility with serverless Lambda
    await page.goto(url, { waitUntil: 'networkidle2' }); // Make sure the page is fully loaded before proceeding
    const bodyText: string = await page.$eval(
      'body',
      (el: HTMLBodyElement) => el.innerText
    );
    return bodyText;
  },
  /**
   * Decide on whether link should be long retried.
   * @param originalRequest
   * @param maxLongRetry
   */
  _determineProcessStatus(
    originalRequest: SubmittedLink,
    maxLongRetry: number
  ): LinkStatus {
    if (originalRequest.attemptsCount >= maxLongRetry) {
      return LinkStatus.PIPELINE_FAILED;
    }
    return LinkStatus.PENDING_RETRY;
  },
  async scrapeLinks(validatedLinks: ValidatedLink[]): Promise<{
    scrapedLinks: ScrapedLink[];
    failedScrapingLinks: FailedProcessedLink[];
  }> {
    const scrapedLinks: ScrapedLink[] = [];
    const failedScrapingLinks: FailedProcessedLink[] = [];

    // Early return
    if (validatedLinks.length === 0) {
      console.warn(
        '[WebScrapingServce] WARN: Empty validatedLinks. Will not scrape any links for this run.'
      );
      return { scrapedLinks, failedScrapingLinks };
    }

    // Create a limiter with CONCURRENCY_LIMIT
    const CONCURRENCY_LIMIT = 5;
    const limit = pLimit(CONCURRENCY_LIMIT);
    const MAX_LONG_RETRY = 4;

    // Open only 1 Chrominum browser process
    const browser = await _launchBrowserInstance();

    await Promise.all(
      validatedLinks.map((validatedLink) =>
        // Instead of calling async function directly, wrap it with the limiter
        // The limiter ensures that only CONCURRENCY_LIMIT promises are running at anytime
        // When one batch finises, the next queued tasks batch starts
        limit(async () => {
          // Open a new Chromium tab
          const page = await browser.newPage();
          try {
            const scrapedText = await this.getBodyText(page, validatedLink.url);
            scrapedLinks.push({ ...validatedLink, scrapedText });
          } catch (error: unknown) {
            logError(error);

            failedScrapingLinks.push({
              ...validatedLink,
              status: this._determineProcessStatus(
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
