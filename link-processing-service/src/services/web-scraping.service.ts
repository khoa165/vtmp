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
    linksData: ValidatedLink[]
  ): Promise<{
    scrapedLinks: ScrapedLink[];
    failedScrapingLinks: FailedProcessedLink[];
  }> => {
    // Get all the validated urls
    const urls = linksData.map((linkData) => linkData.url);
    // Launch a browser instance
    const browser = await _launchBrowserInstance();
    try {
      const scrapedLinks: ScrapedLink[] = [];
      const failedScrapingLinks: FailedProcessedLink[] = [];
      const results = await Promise.all(
        linksData.map(async (linkData) => {
          // Open a new tab
          const page = await browser.newPage();
          try {
            const scrapedText = await _scrapeWebpage(page, linkData.url);
            return { ...linkData, scrapedText };
          } catch (error: unknown) {
            // At failfure stage, need to add fields like status, failureStage
            // For `status`, it is particularly important because we need to determine whether it is:
            // LinkStatus.PENDING_RETRY => if attemptsCount < 3 (or some const number)
            // LinkStatus.PIPELINE_FAILED => if attemptsCount == 3 (or some const number)

            logError(error);

            if (_shouldLongRetry(linkData.originalRequest.attemptsCount)) {
              return {
                ...linkData,
                status: LinkStatus.PENDING_RETRY,
                failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
                error,
              };
            }

            return {
              ...linkData,
              status: LinkStatus.PIPELINE_FAILED,
              failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
              error,
            };
          } finally {
            await page.close();
          }
        })
      );

      // Now, split the results into scrapedLinks and failedScrapingLinks
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
