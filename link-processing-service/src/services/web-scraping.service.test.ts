import { expect } from 'chai';
import puppeteer, { Browser } from 'puppeteer-core';
import sinon from 'sinon';

import { LinkProcessingFailureStage, LinkStatus } from '@vtmp/common/constants';

import {
  ScrapingWebPage,
  WebScrapingService,
} from '@/services/web-scraping.service';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { ValidatedLink } from '@/types/link-processing.types';
import { ScrapingError } from '@/utils/errors';

describe('WebScrapingService', () => {
  const sandbox = useSandbox();
  let browserMock;
  let pageMock;

  let stubGetBodyTextFunction: sinon.SinonStub;
  const validatedLinkMock: ValidatedLink[] = [
    {
      originalRequest: {
        _id: '123',
        originalUrl: 'https://example1.com',
        attemptsCount: 0,
      },
      url: 'https://example1.com',
    },
    {
      originalRequest: {
        _id: '123',
        originalUrl: 'https://example2.com',
        attemptsCount: 1,
      },
      url: 'https://example2.com',
    },
  ];
  beforeEach(() => {
    // Create mock for page
    pageMock = {
      goto: sandbox.stub(),
      evaluate: sandbox.stub(),
      close: sandbox.stub(),
    };

    // Create mock for browser
    browserMock = {
      newPage: sandbox.stub().resolves(pageMock),
      close: sandbox.stub(),
    };

    // Stub puppeteer.launch to return our browser mock
    sandbox
      .stub(puppeteer, 'launch')
      .resolves(browserMock as Partial<Browser> as Browser);

    stubGetBodyTextFunction = sandbox.stub(ScrapingWebPage, 'getBodyText');
    sandbox.stub(console, 'error');
  });

  it('should return 2 successes when both link scraping successfully', async () => {
    stubGetBodyTextFunction.resolves('Scraped content');

    const { scrapedLinks, failedScrapingLinks } =
      await WebScrapingService.scrapeLinks(validatedLinkMock);

    expect(scrapedLinks).to.have.lengthOf(2);
    expect(failedScrapingLinks).to.have.lengthOf(0);

    expect(scrapedLinks[0]?.url).to.equal('https://example1.com');
    expect(scrapedLinks[1]?.url).to.equal('https://example2.com');
    expect(scrapedLinks[0]?.scrapedText).to.equal('Scraped content');
    expect(scrapedLinks[1]?.scrapedText).to.equal('Scraped content');
  });

  it('should return 1 success and 1 failure when one link scraping fails', async () => {
    stubGetBodyTextFunction
      .onFirstCall()
      .resolves('Scraped content')
      .onSecondCall()
      .rejects(new Error('Failed to scrape'));

    const { scrapedLinks, failedScrapingLinks } =
      await WebScrapingService.scrapeLinks(validatedLinkMock);

    expect(scrapedLinks).to.have.lengthOf(1);
    expect(failedScrapingLinks).to.have.lengthOf(1);

    expect(scrapedLinks[0]?.url).to.equal('https://example1.com');
    expect(scrapedLinks[0]?.scrapedText).to.equal('Scraped content');
    expect(failedScrapingLinks[0]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedScrapingLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.SCRAPING_FAILED
    );
    expect(failedScrapingLinks[0]?.error).to.be.instanceOf(ScrapingError);
  });

  it('should return 2 failures when both link scraping fails', async () => {
    stubGetBodyTextFunction.throws();

    const { scrapedLinks, failedScrapingLinks } =
      await WebScrapingService.scrapeLinks(validatedLinkMock);

    expect(scrapedLinks).to.have.lengthOf(0);
    expect(failedScrapingLinks).to.have.lengthOf(2);

    expect(failedScrapingLinks[0]?.url).to.equal('https://example1.com');
    expect(failedScrapingLinks[1]?.url).to.equal('https://example2.com');
    expect(failedScrapingLinks[0]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedScrapingLinks[1]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedScrapingLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.SCRAPING_FAILED
    );
    expect(failedScrapingLinks[1]?.failureStage).to.equal(
      LinkProcessingFailureStage.SCRAPING_FAILED
    );
    expect(failedScrapingLinks[0]?.error).to.be.instanceOf(ScrapingError);
    expect(failedScrapingLinks[1]?.error).to.be.instanceOf(ScrapingError);
  });

  it('should return 1 failure with correct status when link reach MAX_LONG_RETRY', async () => {
    stubGetBodyTextFunction.throws();

    const { scrapedLinks, failedScrapingLinks } =
      await WebScrapingService.scrapeLinks([
        {
          originalRequest: {
            _id: '123',
            originalUrl: 'https://example2.com',
            attemptsCount: 4,
          },
          url: 'https://example2.com',
        },
      ]);

    expect(scrapedLinks).to.have.lengthOf(0);
    expect(failedScrapingLinks).to.have.lengthOf(1);
    expect(failedScrapingLinks[0]?.url).to.equal('https://example2.com');
    expect(failedScrapingLinks[0]?.status).to.equal(LinkStatus.PIPELINE_FAILED);
    expect(failedScrapingLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.SCRAPING_FAILED
    );
    expect(failedScrapingLinks[0]?.error).to.be.instanceOf(ScrapingError);
  });

  it('should log a warning and return empty arrays when no validated links are provided', async () => {
    const warnStub = sandbox.spy(console, 'warn');

    const { scrapedLinks, failedScrapingLinks } =
      await WebScrapingService.scrapeLinks([]);

    expect(warnStub).calledWith(
      '[WebScrapingServce] WARN: Empty validatedLinks. Will not scrape any links for this run.'
    );
    expect(scrapedLinks).to.have.lengthOf(0);
    expect(failedScrapingLinks).to.have.lengthOf(0);
  });

  it('should return empty arrays when no validated links are provided', async () => {
    const { scrapedLinks, failedScrapingLinks } =
      await WebScrapingService.scrapeLinks([]);

    expect(scrapedLinks).to.have.lengthOf(0);
    expect(failedScrapingLinks).to.have.lengthOf(0);
  });
});
