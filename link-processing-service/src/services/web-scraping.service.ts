import puppeteer, { Browser, Page } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { logError, ScrapingError } from '@/utils/errors';
import { LinkStatus, LinkProcessingFailureStage } from '@vtmp/common/constants';
import {
  FailedProcessedLink,
  ScrapedLink,
  ValidatedLink,
} from '@/services/link-metadata-validation';

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

const _shouldLongRetry = (attempsCount: number) => {
  if (attempsCount < 3) {
    return true;
  } else {
    return false;
  }
};

export const WebScrapingService = {
  scrapeLinks: async (
    validatedLinks: ValidatedLink[]
  ): Promise<{
    scrapedLinks: ScrapedLink[];
    failedScrapingLinks: FailedProcessedLink[];
  }> => {
    // Get all the urls for logging
    const urls = validatedLinks.map((linkData) => linkData.url);
    // Open only 1 Chrominum browser process
    const browser = await _launchBrowserInstance();
    try {
      const scrapedLinks: ScrapedLink[] = [];
      const failedScrapingLinks: FailedProcessedLink[] = [];
      const results = await Promise.all(
        validatedLinks.map(async (validatedLink) => {
          // Open a new tab
          const page = await browser.newPage();
          try {
            const scrapedText = await _scrapeWebpage(page, validatedLink.url);
            return { ...validatedLink, scrapedText };
          } catch (error: unknown) {
            logError(error);

            if (_shouldLongRetry(validatedLink.originalRequest.attemptsCount)) {
              return {
                ...validatedLink,
                status: LinkStatus.PENDING_RETRY,
                failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
                error,
              };
            }

            return {
              ...validatedLink,
              status: LinkStatus.PIPELINE_FAILED,
              failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
              error,
            };
          } finally {
            await page.close();
          }
        })
      );

      // Sort the results into scrapedLinks and failedScrapingLinks
      for (const result of results) {
        if ('error' in result) {
          failedScrapingLinks.push(result);
        } else {
          scrapedLinks.push(result);
        }
      }
      return { scrapedLinks, failedScrapingLinks };
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
