import { expect } from 'chai';
import puppeteer, { Browser, Page, HTTPResponse } from 'puppeteer-core';
import sinon, { SinonStubbedInstance } from 'sinon';

import { LinkProcessingFailureStage, LinkStatus } from '@vtmp/common/constants';

import { WebScrapingService } from '@/services/web-scraping.service';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { SubmittedLink } from '@/types/link-processing.types';
import { LinkAccessError, ScrapingError } from '@/utils/errors';

describe('WebScrapingService', () => {
  const sandbox = useSandbox();
  let browserMock: SinonStubbedInstance<Browser>;
  let pageMock: SinonStubbedInstance<Page>;
  const originalRetryConfig = WebScrapingService.config.scrapeLinkRetryConfig;

  let stubAccessWebPageFunction: sinon.SinonStub;
  const submittedLinkMock: SubmittedLink[] = [
    {
      _id: '123',
      originalUrl: 'https://example1.com',
      attemptsCount: 0,
    },
    {
      _id: '124',
      originalUrl: 'https://example2.com',
      attemptsCount: 1,
    },
  ];
  before(() => {
    WebScrapingService.config.scrapeLinkRetryConfig = {
      retries: 3,
      factor: 2,
      minTimeout: 10,
      maxTimeout: 10,
    };
  });
  after(() => {
    WebScrapingService.config.scrapeLinkRetryConfig = originalRetryConfig;
  });
  beforeEach(() => {
    // Create mock for page
    pageMock = {
      goto: sandbox.stub(),
      evaluate: sandbox.stub(),
      close: sandbox.stub(),
      setUserAgent: sandbox.stub(),
      setDefaultNavigationTimeout: sandbox.stub(),
      $eval: sandbox.stub(),
      url: sandbox.stub(),
    } as SinonStubbedInstance<Page>;

    // Create mock for browser
    browserMock = {
      newPage: sandbox.stub().resolves(pageMock),
      close: sandbox.stub(),
    } as SinonStubbedInstance<Browser>;

    // Stub puppeteer.launch to return our browser mock
    sandbox.stub(puppeteer, 'launch').resolves(browserMock);

    stubAccessWebPageFunction = sandbox.stub(
      WebScrapingService,
      'accessWebPage'
    );
    sandbox.stub(console, 'error');
  });

  it('should return 2 successes when both link scraping successfully', async () => {
    stubAccessWebPageFunction.resolves({
      bodyText: 'Scraped content',
      finalUrl: 'https://example1.com',
    });

    const { scrapedLinks, failedScrapingLinks } =
      await WebScrapingService.scrapeLinks(submittedLinkMock);

    expect(scrapedLinks).to.have.lengthOf(2);
    expect(failedScrapingLinks).to.have.lengthOf(0);

    expect(scrapedLinks[0]?.url).to.equal('https://example1.com');
    expect(scrapedLinks[1]?.url).to.equal('https://example1.com');
    expect(scrapedLinks[0]?.scrapedText).to.equal('Scraped content');
    expect(scrapedLinks[1]?.scrapedText).to.equal('Scraped content');

    // Assert resources cleanup
    expect(pageMock.close.callCount).to.equal(2);
    expect(browserMock.close.callCount).to.equal(1);
  });

  it('should return 1 success and 1 failure when one link scraping fails', async () => {
    stubAccessWebPageFunction
      .onFirstCall()
      .resolves({
        bodyText: 'Scraped content',
        finalUrl: 'https://example1.com',
      })
      .onSecondCall()
      .rejects(new Error('Failed to scrape'));

    const { scrapedLinks, failedScrapingLinks } =
      await WebScrapingService.scrapeLinks(submittedLinkMock);

    expect(scrapedLinks).to.have.lengthOf(1);
    expect(failedScrapingLinks).to.have.lengthOf(1);

    expect(scrapedLinks[0]?.url).to.equal('https://example1.com');
    expect(scrapedLinks[0]?.scrapedText).to.equal('Scraped content');
    expect(failedScrapingLinks[0]?.originalRequest.originalUrl).to.equal(
      'https://example2.com'
    );
    expect(failedScrapingLinks[0]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedScrapingLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.SCRAPING_FAILED
    );
    expect(failedScrapingLinks[0]?.error).to.be.instanceOf(ScrapingError);

    // Assert resources cleanup
    expect(pageMock.close.callCount).to.equal(2);
    expect(browserMock.close.callCount).to.equal(1);
  });

  it('should return 2 failures when both link scraping fails', async () => {
    stubAccessWebPageFunction.throws();

    const { scrapedLinks, failedScrapingLinks } =
      await WebScrapingService.scrapeLinks(submittedLinkMock);

    expect(scrapedLinks).to.have.lengthOf(0);
    expect(failedScrapingLinks).to.have.lengthOf(2);

    expect(failedScrapingLinks[0]?.originalRequest.originalUrl).to.equal(
      'https://example1.com'
    );
    expect(failedScrapingLinks[1]?.originalRequest.originalUrl).to.equal(
      'https://example2.com'
    );
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

    // Assert resources cleanup
    expect(pageMock.close.callCount).to.equal(2);
    expect(browserMock.close.callCount).to.equal(1);
  });

  it('should return 1 failure with correct status when link reach MAX_LONG_RETRY', async () => {
    stubAccessWebPageFunction.throws();

    const { scrapedLinks, failedScrapingLinks } =
      await WebScrapingService.scrapeLinks([
        {
          _id: '123',
          originalUrl: 'https://example2.com',
          attemptsCount: 4,
        },
      ]);

    expect(scrapedLinks).to.have.lengthOf(0);
    expect(failedScrapingLinks).to.have.lengthOf(1);
    expect(failedScrapingLinks[0]?.originalRequest.originalUrl).to.equal(
      'https://example2.com'
    );
    expect(failedScrapingLinks[0]?.status).to.equal(LinkStatus.PIPELINE_FAILED);
    expect(failedScrapingLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.SCRAPING_FAILED
    );
    expect(failedScrapingLinks[0]?.error).to.be.instanceOf(ScrapingError);

    // Assert resources cleanup
    expect(pageMock.close.callCount).to.equal(1);
    expect(browserMock.close.callCount).to.equal(1);
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

    // Assert resources cleanup
    expect(pageMock.close.callCount).to.equal(0);
    expect(browserMock.close.callCount).to.equal(0);
  });

  describe('accessWebPage error handling', () => {
    beforeEach(() => {
      // Reset the stub for these specific tests
      sandbox.restore();
      sandbox.stub(console, 'error');
    });

    it('should throw LinkAccessError when HTTP status code is 404', async () => {
      // Mock page methods
      const mockPage = {
        goto: sandbox.stub(),
        $eval: sandbox.stub(),
        url: sandbox.stub(),
      } as SinonStubbedInstance<Page>;

      // Mock the response with 404 status
      const mockResponse = {
        status: () => 404,
        statusText: () => 'Not Found',
      } as HTTPResponse;

      mockPage.goto.resolves(mockResponse);
      mockPage.url.returns('https://example.com/404');

      // Test should throw LinkAccessError
      await expect(
        WebScrapingService.accessWebPage(mockPage, 'https://example.com/404')
      ).to.be.rejectedWith(
        LinkAccessError,
        'Unable to access link. HTTP Error: Not Found'
      );
    });

    it('should throw LinkAccessError when HTTP status code is 500', async () => {
      // Mock page methods
      const mockPage = {
        goto: sandbox.stub(),
        $eval: sandbox.stub(),
        url: sandbox.stub(),
      } as SinonStubbedInstance<Page>;

      // Mock the response with 500 status
      const mockResponse = {
        status: () => 500,
        statusText: () => 'Internal Server Error',
      } as HTTPResponse;

      mockPage.goto.resolves(mockResponse);
      mockPage.url.returns('https://example.com/500');

      // Test should throw LinkAccessError
      await expect(
        WebScrapingService.accessWebPage(mockPage, 'https://example.com/500')
      ).to.be.rejectedWith(
        LinkAccessError,
        'Unable to access link. HTTP Error: Internal Server Error'
      );
    });
  });
});
