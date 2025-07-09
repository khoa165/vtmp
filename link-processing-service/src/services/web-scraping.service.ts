import chromium from '@sparticuz/chromium';
import {
  SubmittedLink,
  FailedProcessedLink,
} from '@vtmp/server-common/constants';
import pLimit from 'p-limit';
import puppeteer, { Browser, Page } from 'puppeteer-core';
import retry from 'retry';

import { LinkProcessingFailureStage, LinkStatus } from '@vtmp/common/constants';

import {
  executeWithRetry,
  httpErrorNoShortRetry,
} from '@/helpers/retry.helper';
import { ScrapedLink } from '@/types/link-processing.types';
import { LinkAccessError, logError, ScrapingError } from '@/utils/errors';

const _launchBrowserInstance = async (): Promise<Browser> => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  return browser;
};

export const WebScrapingService = {
  config: {
    scrapeLinkRetryConfig: {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 15 * 1000,
    } as retry.WrapOptions,
    scrapingConfig: {
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
      timeout: 10_000,
    },
    concurrencyLimit: 5,
    maxLongRetry: 4,
  },
  /**
   * Navigates the given Puppeteer `page` to the specified `url`, retrying on certain errors according to configuration.
   * After successful navigation, extracts and returns the inner text of the `<body>` element and the final URL.
   *
   * @param page - The Puppeteer `Page` instance to use for navigation.
   * @param url - The URL to navigate to.
   * @returns An object containing the extracted `bodyText` and the `finalUrl` after navigation.
   * @throws {LinkAccessError} If navigation fails due to HTTP error status after all retries.
   * @throws Generic Puppetteer error
   */
  async accessWebPage(
    page: Page,
    url: string
  ): Promise<{ bodyText: string; finalUrl: string }> {
    await executeWithRetry(
      () => _navigateToUrl(page, url),
      this.config.scrapeLinkRetryConfig,
      (err) => {
        if (err instanceof LinkAccessError && err.statusCode !== undefined) {
          return !httpErrorNoShortRetry.includes(err.statusCode);
        }
        return true;
      }
    );
    const bodyText: string = await page.$eval(
      'body',
      (el: HTMLBodyElement) => el.innerText
    );
    const finalUrl = page.url();
    return { bodyText, finalUrl };
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
  async scrapeLinks(submittedLinks: SubmittedLink[]): Promise<{
    scrapedLinks: ScrapedLink[];
    failedScrapingLinks: FailedProcessedLink[];
  }> {
    const scrapedLinks: ScrapedLink[] = [];
    const failedScrapingLinks: FailedProcessedLink[] = [];

    // Early return
    if (submittedLinks.length === 0) {
      console.warn(
        '[WebScrapingServce] WARN: Empty validatedLinks. Will not scrape any links for this run.'
      );
      return { scrapedLinks, failedScrapingLinks };
    }

    // Create a limiter with CONCURRENCY_LIMIT
    const limit = pLimit(this.config.concurrencyLimit);

    // Open only 1 Chrominum browser process
    const browser = await _launchBrowserInstance();

    await Promise.all(
      submittedLinks.map((submittedLink) =>
        // Instead of calling async function directly, wrap it with the limiter
        // The limiter ensures that only CONCURRENCY_LIMIT promises are running at anytime
        // When one batch finishes, the next queued tasks batch starts
        limit(async () => {
          const { userAgent, timeout } = this.config.scrapingConfig;
          // Open a new Chromium tab
          const page = await browser.newPage();
          page.setUserAgent(userAgent);
          page.setDefaultNavigationTimeout(timeout);
          try {
            const { bodyText, finalUrl } = await this.accessWebPage(
              page,
              submittedLink.originalUrl
            );
            scrapedLinks.push({
              originalRequest: submittedLink,
              url: finalUrl,
              scrapedText: bodyText,
            });
          } catch (error: unknown) {
            // At failure stage, need to add fields like status, failureStage
            // For `status`, it is particularly important because we need to determine whether it is:
            // LinkStatus.PENDING_RETRY => if attemptsCount < 3 (or some const number)
            // LinkStatus.PIPELINE_FAILED => if attemptsCount == 3 (or some const number)

            logError(error);
            const errMessage = error instanceof Error ? error.message : '';

            failedScrapingLinks.push({
              originalRequest: submittedLink,
              status: this._determineProcessStatus(
                submittedLink,
                this.config.maxLongRetry
              ),

              failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
              error: new ScrapingError(
                `Failed to scrape URL. ${errMessage}`,
                {
                  url: submittedLink.originalUrl,
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

/**
 * A void function that navigates the given Puppeteer page to the specified URL and waits until the network is idle.
 * Throws a {@link LinkAccessError} if the HTTP response status code is not in the 200–399 range.
 *
 * @param page - The Puppeteer {@link Page} instance to use for navigation.
 * @param url - The URL to navigate to.
 * @throws {LinkAccessError} If the HTTP response status code is outside the 200–399 range.
 */
async function _navigateToUrl(page: Page, url: string) {
  const response = await page.goto(url, { waitUntil: 'networkidle2' }); // Make sure the page is fully loaded before proceeding
  if (
    response?.status() &&
    (response?.status() < 200 || response?.status() > 399)
  ) {
    throw new LinkAccessError(
      `Unable to access link. HTTP Error: ${response?.statusText()}`,
      { url },
      {
        statusCode: response?.status(),
      }
    );
  }
}
