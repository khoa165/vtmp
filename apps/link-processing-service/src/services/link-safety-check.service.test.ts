import { expect } from 'chai';
import sinon from 'sinon';

import { LinkProcessingFailureStage, LinkStatus } from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import { LinkSafetyCheckService } from '@/services/link-safety-check.service';
import { LINK_PROCESSING_MOCK_ENV } from '@/testutils/link-processing-mock-env.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { ScrapedLink } from '@/types/link-processing.types';
import { MaliciousLinkError } from '@/utils/errors';

describe('LinkSafetyCheckService', () => {
  const sandbox = useSandbox();
  const originalVirusScanRetryConfig =
    LinkSafetyCheckService.config.virusScanRetryConfig;

  let stubScanFromSafeBrowsing: sinon.SinonStub;
  let findThreatStub: sinon.SinonStub;
  const mockScrapedLinks: ScrapedLink[] = [
    {
      originalRequest: {
        _id: '123',
        originalUrl: 'https://example1.com',
        attemptsCount: 0,
      },
      url: 'https://example1.com',
      scrapedText: 'Sample content 1',
    },
    {
      originalRequest: {
        _id: '124',
        originalUrl: 'https://example2.com',
        attemptsCount: 1,
      },
      url: 'https://example2.com',
      scrapedText: 'Sample content 2',
    },
  ];

  before(() => {
    LinkSafetyCheckService.config.virusScanRetryConfig = {
      retries: 0,
      factor: 2,
      minTimeout: 10,
      maxTimeout: 10,
    };
  });

  after(() => {
    LinkSafetyCheckService.config.virusScanRetryConfig =
      originalVirusScanRetryConfig;
  });

  beforeEach(() => {
    findThreatStub = sinon.stub();
    stubScanFromSafeBrowsing = sandbox
      .stub(LinkSafetyCheckService, '_initSafeBrowsingThreatMatches')
      // @ts-expect-error: Accessing private method for testing purposes
      .returns({
        find: findThreatStub,
      });

    sandbox.stub(console, 'error');
    sandbox.stub(console, 'warn');
    sandbox.stub(EnvConfig, 'get').returns(LINK_PROCESSING_MOCK_ENV);
  });

  it('should return 2 scanned links when both links are safe', async () => {
    findThreatStub.resolves({});

    const { scannedLinks, failedVirusLinks } =
      await LinkSafetyCheckService.checkSafety(mockScrapedLinks);

    expect(scannedLinks).to.have.lengthOf(2);
    expect(failedVirusLinks).to.have.lengthOf(0);

    expect(scannedLinks[0]?.url).to.equal('https://example1.com');
    expect(scannedLinks[1]?.url).to.equal('https://example2.com');
    expect(scannedLinks[0]?.scrapedText).to.equal('Sample content 1');
    expect(scannedLinks[1]?.scrapedText).to.equal('Sample content 2');

    expect(stubScanFromSafeBrowsing.callCount).to.equal(2);
  });

  it('should return 1 scanned link and 1 failed link when one link is unsafe', async () => {
    findThreatStub
      .onFirstCall()
      .resolves({ data: {} })
      .onSecondCall()
      .resolves({
        data: {
          matches: [{ platformType: 'ANY', threatType: 'MALICIOUS' }],
        },
      });

    const { scannedLinks, failedVirusLinks } =
      await LinkSafetyCheckService.checkSafety(mockScrapedLinks);

    expect(scannedLinks).to.have.lengthOf(1);
    expect(failedVirusLinks).to.have.lengthOf(1);

    expect(scannedLinks[0]?.url).to.equal('https://example1.com');
    expect(scannedLinks[0]?.scrapedText).to.equal('Sample content 1');

    expect(failedVirusLinks[0]?.originalRequest.originalUrl).to.equal(
      'https://example2.com'
    );
    expect(failedVirusLinks[0]?.status).to.equal(LinkStatus.PIPELINE_REJECTED);
    expect(failedVirusLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.VIRUS_FAILED
    );

    expect(failedVirusLinks[0]?.error).to.be.instanceOf(MaliciousLinkError);

    expect(stubScanFromSafeBrowsing.callCount).to.equal(2);
  });

  it('should return 0 scanned links and 2 failed links when both links are unsafe', async () => {
    findThreatStub
      .onFirstCall()
      .resolves({
        data: {
          matches: [{ platformType: 'ANY', threatType: 'MALICIOUS' }],
        },
      })
      .onSecondCall()
      .resolves({
        data: {
          matches: [{ platformType: 'ANY', threatType: 'MALICIOUS' }],
        },
      });
    const { scannedLinks, failedVirusLinks } =
      await LinkSafetyCheckService.checkSafety(mockScrapedLinks);

    expect(scannedLinks).to.have.lengthOf(0);
    expect(failedVirusLinks).to.have.lengthOf(2);

    expect(failedVirusLinks[0]?.originalRequest.originalUrl).to.equal(
      'https://example1.com'
    );
    expect(failedVirusLinks[1]?.originalRequest.originalUrl).to.equal(
      'https://example2.com'
    );
    expect(failedVirusLinks[0]?.status).to.equal(LinkStatus.PIPELINE_REJECTED);
    expect(failedVirusLinks[1]?.status).to.equal(LinkStatus.PIPELINE_REJECTED);
    expect(failedVirusLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.VIRUS_FAILED
    );
    expect(failedVirusLinks[1]?.failureStage).to.equal(
      LinkProcessingFailureStage.VIRUS_FAILED
    );

    expect(stubScanFromSafeBrowsing.callCount).to.equal(2);
  });

  it('should return 1 failed link when scanning throws an error', async () => {
    findThreatStub
      .onFirstCall()
      .resolves({ response: {} })
      .onSecondCall()
      .throws(new Error('Scan failed'));

    const { scannedLinks, failedVirusLinks } =
      await LinkSafetyCheckService.checkSafety(mockScrapedLinks);

    expect(scannedLinks).to.have.lengthOf(1);
    expect(failedVirusLinks).to.have.lengthOf(1);

    expect(scannedLinks[0]?.url).to.equal('https://example1.com');
    expect(failedVirusLinks[0]?.originalRequest.originalUrl).to.equal(
      'https://example2.com'
    );
    expect(failedVirusLinks[0]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedVirusLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.VIRUS_FAILED
    );
    expect(failedVirusLinks[0]?.error).to.be.instanceOf(MaliciousLinkError);
  });

  it('should handle invalid URLs gracefully', async () => {
    const invalidUrlLink: ScrapedLink = {
      originalRequest: {
        _id: '125',
        originalUrl: 'invalid-url',
        attemptsCount: 0,
      },
      url: 'invalid-url',
      scrapedText: 'Some content',
    };

    const { scannedLinks, failedVirusLinks } =
      await LinkSafetyCheckService.checkSafety([invalidUrlLink]);

    expect(scannedLinks).to.have.lengthOf(0);
    expect(failedVirusLinks).to.have.lengthOf(1);

    expect(failedVirusLinks[0]?.originalRequest.originalUrl).to.equal(
      'invalid-url'
    );
    expect(failedVirusLinks[0]?.status).to.equal(LinkStatus.PENDING_RETRY);
    expect(failedVirusLinks[0]?.failureStage).to.equal(
      LinkProcessingFailureStage.VIRUS_FAILED
    );
    expect(failedVirusLinks[0]?.error).to.be.instanceOf(TypeError);

    expect(stubScanFromSafeBrowsing.callCount).to.equal(0);
  });
});
