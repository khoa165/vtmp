import { SubmittedLink } from '@vtmp/server-common/constants';
import { expect } from 'chai';
import puppeteer, { Browser, Page } from 'puppeteer-core';
import sinon, { SinonStubbedInstance } from 'sinon';

import {
  LinkRegion,
  JobFunction,
  JobType,
  LinkProcessingFailureStage,
  LinkStatus,
} from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import { ExtractLinkMetadataService } from '@/services/extract-link-metadata.service';
import { LinkProcessorService } from '@/services/link-processor.service';
import { LinkValidatorService } from '@/services/link-validator.service';
import { WebScrapingService } from '@/services/web-scraping.service';
import { LINK_PROCESSING_MOCK_ENV } from '@/testutils/link-processing-mock-env.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { ScrapingError , AIExtractionError } from '@/utils/errors';

describe('LinkProcessorService', () => {
  const sandbox = useSandbox();
  let browserMock: SinonStubbedInstance<Browser>;
  let pageMock: SinonStubbedInstance<Page>;
  let stubGetBodyTextFunction: sinon.SinonStub;
  let generateContentStub: sinon.SinonStub;
  let validateLinkStub: sinon.SinonStub;
  let consoleWarnStub: sinon.SinonStub;
  const fakeAIResponse = {
    jobTitle: 'Software Engineer',
    companyName: 'Tech Corp',
    location: LinkRegion.US,
    jobFunction: JobFunction.SOFTWARE_ENGINEER,
    jobType: JobType.INTERNSHIP,
    datePosted: '2024-05-10',
  };
  const submittedLinks: SubmittedLink[] = [
    { _id: '1', originalUrl: 'https://example1.com', attemptsCount: 1 },
    { _id: '2', originalUrl: 'https://example2.com', attemptsCount: 2 },
  ];
  beforeEach(() => {
    sandbox.stub(EnvConfig, 'get').returns(LINK_PROCESSING_MOCK_ENV);
    // Create mock for page
    pageMock = {
      goto: sandbox.stub(),
      evaluate: sandbox.stub(),
      close: sandbox.stub(),
    } as SinonStubbedInstance<Page>;

    // Create mock for browser
    browserMock = {
      newPage: sandbox.stub().resolves(pageMock),
      close: sandbox.stub(),
    } as SinonStubbedInstance<Browser>;

    // Stub puppeteer.launch to return our browser mock
    sandbox.stub(puppeteer, 'launch').resolves(browserMock);

    stubGetBodyTextFunction = sandbox.stub(WebScrapingService, 'getBodyText');
    generateContentStub = sandbox.stub(
      ExtractLinkMetadataService,
      '_generateContent'
    );
    validateLinkStub = sandbox.stub(LinkValidatorService, 'validateLink');
    sandbox.stub(console, 'error'); // Suppress console errors in tests
    consoleWarnStub = sandbox.stub(console, 'warn');
  });

  it('should return 2 successful links and 0 failed links when all services succeed', async () => {
    validateLinkStub.resolves('http://example1.com');
    stubGetBodyTextFunction.resolves('Scraped content');
    generateContentStub.resolves({
      text: `\`\`\`json\n${JSON.stringify(fakeAIResponse)}\n\`\`\``,
    });
    const { successfulLinks, failedLinks } =
      await LinkProcessorService.processLinks(submittedLinks);
    expect(successfulLinks).to.have.length(2);
    expect(failedLinks).to.have.length(0);
    expect(successfulLinks[0]?.extractedMetadata).to.deep.include(
      fakeAIResponse
    );
    expect(successfulLinks[1]?.extractedMetadata).to.deep.include(
      fakeAIResponse
    );
    expect(successfulLinks[0]?.status).to.equal(
      LinkStatus.PENDING_ADMIN_REVIEW
    );
    expect(successfulLinks[1]?.status).to.equal(
      LinkStatus.PENDING_ADMIN_REVIEW
    );

    expect(successfulLinks[0]?.failureStage).to.equal(null);
    expect(successfulLinks[1]?.failureStage).to.equal(null);

    // Assert resources cleanup
    expect(pageMock.close.callCount).to.equal(2);
    expect(browserMock.close.callCount).to.equal(1);
  });

  it('should return 1 failed from LinkValidatorService and 1 failed from ScrapingService', async () => {
    validateLinkStub
      .onFirstCall()
      .resolves('http://example1.com')
      .onSecondCall()
      .throws();
    stubGetBodyTextFunction.throws();

    const { successfulLinks, failedLinks } =
      await LinkProcessorService.processLinks(submittedLinks);

    expect(successfulLinks).to.have.lengthOf(0);
    expect(failedLinks).to.have.lengthOf(2);

    expect(failedLinks[0]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedLinks[1]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.VALIDATION_FAILED
    );
    expect(failedLinks[1]?.failureStage).to.equal(
      LinkProcessingFailureStage.SCRAPING_FAILED
    );
    expect(failedLinks[0]?.error).to.be.instanceOf(Error);
    expect(failedLinks[1]?.error).to.be.instanceOf(ScrapingError);

    // Assert resources cleanup
    expect(pageMock.close.callCount).to.equal(1);
    expect(browserMock.close.callCount).to.equal(1);
  });

  it('should return 1 failed from LinkValidatorService and 1 failed from ExtractionMetadatService', async () => {
    validateLinkStub
      .onFirstCall()
      .resolves('http://example1.com')
      .onSecondCall()
      .throws();
    stubGetBodyTextFunction.resolves('Scraped content');
    generateContentStub.throws();

    const { successfulLinks, failedLinks } =
      await LinkProcessorService.processLinks(submittedLinks);

    expect(successfulLinks).to.have.lengthOf(0);
    expect(failedLinks).to.have.lengthOf(2);

    expect(failedLinks[0]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedLinks[1]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.VALIDATION_FAILED
    );
    expect(failedLinks[1]?.failureStage).to.equal(
      LinkProcessingFailureStage.EXTRACTION_FAILED
    );
    expect(failedLinks[0]?.error).to.be.instanceOf(Error);
    expect(failedLinks[1]?.error).to.be.instanceOf(AIExtractionError);

    // Assert resources cleanup
    expect(pageMock.close.callCount).to.equal(1);
    expect(browserMock.close.callCount).to.equal(1);
  });

  it('should return 1 failed from LinkValidatorService and 1 success from ExtractionMetadatService', async () => {
    validateLinkStub
      .onFirstCall()
      .resolves('http://example1.com')
      .onSecondCall()
      .throws();
    stubGetBodyTextFunction.resolves('Scraped content');
    generateContentStub.resolves({
      text: `\`\`\`json\n${JSON.stringify(fakeAIResponse)}\n\`\`\``,
    });

    const { successfulLinks, failedLinks } =
      await LinkProcessorService.processLinks(submittedLinks);

    expect(successfulLinks).to.have.lengthOf(1);
    expect(failedLinks).to.have.lengthOf(1);
    expect(successfulLinks[0]?.extractedMetadata).to.deep.include(
      fakeAIResponse
    );
    expect(successfulLinks[0]?.status).to.equal(
      LinkStatus.PENDING_ADMIN_REVIEW
    );
    expect(successfulLinks[0]?.failureStage).to.equal(null);

    expect(failedLinks[0]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.VALIDATION_FAILED
    );
    expect(failedLinks[0]?.error).to.be.instanceOf(Error);

    // Assert resources cleanup
    expect(pageMock.close.callCount).to.equal(1);
    expect(browserMock.close.callCount).to.equal(1);
  });

  it('should return 1 success and 1 failure when one link scraping fails and scraping success link succeed in extraction', async () => {
    validateLinkStub.resolves('http://example1.com');
    stubGetBodyTextFunction
      .onFirstCall()
      .resolves('Scraped content')
      .onSecondCall()
      .rejects(new Error('Failed to scrape'));
    generateContentStub.resolves({
      text: `\`\`\`json\n${JSON.stringify(fakeAIResponse)}\n\`\`\``,
    });

    const { successfulLinks, failedLinks } =
      await LinkProcessorService.processLinks(submittedLinks);

    expect(successfulLinks).to.have.lengthOf(1);
    expect(failedLinks).to.have.lengthOf(1);

    expect(successfulLinks[0]?.scrapedText).to.equal('Scraped content');
    expect(failedLinks[0]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.SCRAPING_FAILED
    );
    expect(failedLinks[0]?.error).to.be.instanceOf(ScrapingError);

    // Assert resources cleanup
    expect(pageMock.close.callCount).to.equal(2);
    expect(browserMock.close.callCount).to.equal(1);
  });

  it('should return 1 success and 1 failure when one link scraping fails and scraping success link fail in extraction', async () => {
    validateLinkStub.resolves('http://example1.com');
    stubGetBodyTextFunction
      .onFirstCall()
      .resolves('Scraped content')
      .onSecondCall()
      .rejects(new Error('Failed to scrape'));
    generateContentStub.throws();

    const { successfulLinks, failedLinks } =
      await LinkProcessorService.processLinks(submittedLinks);

    expect(successfulLinks).to.have.length(0);
    expect(failedLinks).to.have.length(2);

    expect(failedLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.SCRAPING_FAILED
    );
    expect(failedLinks[0]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedLinks[1]?.failureStage).to.equal(
      LinkProcessingFailureStage.EXTRACTION_FAILED
    );
    expect(failedLinks[1]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedLinks[0]?.error).to.be.instanceOf(ScrapingError);
    expect(failedLinks[1]?.error).to.be.instanceOf(AIExtractionError);

    // Assert resources cleanup
    expect(pageMock.close.callCount).to.equal(2);
    expect(browserMock.close.callCount).to.equal(1);
  });

  it('should return 1 success and 1 failure when one link fails metadata extraction', async () => {
    validateLinkStub.resolves('http://example1.com');
    stubGetBodyTextFunction.resolves('Scraped content');
    generateContentStub.resolves({
      text: `\`\`\`json\n${JSON.stringify(fakeAIResponse)}\n\`\`\``,
    });
    generateContentStub
      .onFirstCall()
      .resolves({
        text: `\`\`\`json\n${JSON.stringify(fakeAIResponse)}\n\`\`\``,
      })
      .onSecondCall()
      .throws();

    const { successfulLinks, failedLinks } =
      await LinkProcessorService.processLinks(submittedLinks);

    expect(successfulLinks).to.have.length(1);
    expect(failedLinks).to.have.length(1);

    expect(successfulLinks[0]?.extractedMetadata).to.deep.include(
      fakeAIResponse
    );
    expect(successfulLinks[0]?.status).to.equal(
      LinkStatus.PENDING_ADMIN_REVIEW
    );
    expect(successfulLinks[0]?.failureStage).to.equal(null);
    expect(failedLinks[0]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.EXTRACTION_FAILED
    );
    expect(failedLinks[0]?.error).to.be.instanceOf(AIExtractionError);

    // Assert resources cleanup
    expect(pageMock.close.callCount).to.equal(2);
    expect(browserMock.close.callCount).to.equal(1);
  });

  it('should collect 2 failed links from ExtractionMetadataService', async () => {
    validateLinkStub.resolves('http://example1.com');
    stubGetBodyTextFunction.resolves('Scraped content');
    generateContentStub.resolves({
      text: `\`\`\`json\n${JSON.stringify(fakeAIResponse)}\n\`\`\``,
    });
    generateContentStub.throws();

    const { successfulLinks, failedLinks } =
      await LinkProcessorService.processLinks(submittedLinks);

    expect(successfulLinks).to.have.length(0);
    expect(failedLinks).to.have.length(2);

    expect(failedLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.EXTRACTION_FAILED
    );
    expect(failedLinks[0]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedLinks[1]?.failureStage).to.equal(
      LinkProcessingFailureStage.EXTRACTION_FAILED
    );
    expect(failedLinks[1]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedLinks[0]?.error).to.be.instanceOf(AIExtractionError);
    expect(failedLinks[1]?.error).to.be.instanceOf(AIExtractionError);

    // Assert resources cleanup
    expect(pageMock.close.callCount).to.equal(2);
    expect(browserMock.close.callCount).to.equal(1);
  });

  it('should collect 2 failed links from ScrapingService', async () => {
    validateLinkStub.resolves('http://example1.com');
    stubGetBodyTextFunction.throws();

    const { successfulLinks, failedLinks } =
      await LinkProcessorService.processLinks(submittedLinks);

    expect(successfulLinks).to.have.lengthOf(0);
    expect(failedLinks).to.have.lengthOf(2);

    expect(failedLinks[0]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedLinks[1]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.SCRAPING_FAILED
    );
    expect(failedLinks[1]?.failureStage).to.equal(
      LinkProcessingFailureStage.SCRAPING_FAILED
    );
    expect(failedLinks[0]?.error).to.be.instanceOf(ScrapingError);
    expect(failedLinks[1]?.error).to.be.instanceOf(ScrapingError);

    // Assert resources cleanup
    expect(pageMock.close.callCount).to.equal(2);
    expect(browserMock.close.callCount).to.equal(1);
    expect(consoleWarnStub.callCount).to.equal(1);
  });

  it('should collect 2 failed links from LinkValidatorService', async () => {
    validateLinkStub.throws();

    const { successfulLinks, failedLinks } =
      await LinkProcessorService.processLinks(submittedLinks);
    expect(successfulLinks).to.have.lengthOf(0);
    expect(failedLinks).to.have.lengthOf(2);

    expect(failedLinks[0]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedLinks[1]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.VALIDATION_FAILED
    );
    expect(failedLinks[1]?.failureStage).to.equal(
      LinkProcessingFailureStage.VALIDATION_FAILED
    );
    expect(failedLinks[0]?.error).to.be.instanceOf(Error);
    expect(failedLinks[1]?.error).to.be.instanceOf(Error);

    // Assert resources cleanup
    expect(pageMock.close.callCount).to.equal(0);
    expect(browserMock.close.callCount).to.equal(0);
  });
});
