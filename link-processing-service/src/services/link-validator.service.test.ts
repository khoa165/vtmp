import { safebrowsing_v4 } from '@googleapis/safebrowsing';
import { expect } from 'chai';
import retry from 'retry';

import { SubmittedLink } from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import { LinkValidatorService } from '@/services/link-validator.service';
import { LINK_PROCESSING_MOCK_ENV } from '@/testutils/link-processing-mock-env.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { LinkValidationError } from '@/utils/errors';

describe('LinkValidatorService', () => {
  const sandbox = useSandbox();

  // Test URLs
  const validUrl = 'https://bit.ly/3SA6Wol';
  const expectedResolvedUrl = 'https://www.cbc.ca/';
  const url403 = 'https://httpstat.us/403';
  const url429 = 'https://httpstat.us/429';
  const networkErrorUrl = 'https://meow.meow';
  const invalidUrl = 'not-a-valid-url';
  const safeUrl = 'https://www.google.com/';
  const maliciousUrl =
    'http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/';

  // Test configuration
  const testRetryConfig: retry.WrapOptions = {
    retries: 3,
    factor: 2,
    minTimeout: 10,
    maxTimeout: 10,
  };

  let originalRetryConfig: retry.WrapOptions;
  let originalVirusScanConfig: boolean;

  beforeEach(() => {
    originalRetryConfig = LinkValidatorService.config.resolveLinkRetryConfig;
    originalVirusScanConfig = LinkValidatorService.config.enableVirusScan;

    sandbox.stub(console, 'warn');
    LinkValidatorService.config.resolveLinkRetryConfig = testRetryConfig;
    LinkValidatorService.config.enableVirusScan = false;
    sandbox.stub(EnvConfig, 'get').returns(LINK_PROCESSING_MOCK_ENV);
  });

  afterEach(() => {
    LinkValidatorService.config.resolveLinkRetryConfig = originalRetryConfig;
    LinkValidatorService.config.enableVirusScan = originalVirusScanConfig;
  });
  describe('validateLinks', () => {
    it('should return 1 successful link and 1 failed link', async () => {
      const links = [validUrl, url403];
      const requests: SubmittedLink[] = links.map((url, index) => ({
        _id: String(index),
        originalUrl: url,
        attemptsCount: 0,
      }));

      const { validatedUrls, faultyUrls } =
        await LinkValidatorService.validateLinks(requests);

      expect(validatedUrls).to.be.an('array').that.have.lengthOf(1);
      expect(faultyUrls).to.be.an('array').that.have.lengthOf(1);
    });
  });
  describe('validateLink', () => {
    it('should not throw an error when validating a valid URL successfully', async () => {
      await expect(LinkValidatorService.validateLink(validUrl)).eventually
        .fulfilled;
    });

    it('should return final URL without any errors', async () => {
      const finalLink = await LinkValidatorService.validateLink(validUrl);
      expect(finalLink).to.equal(expectedResolvedUrl);
    });

    it('should throw a TypeError for invalid URL format', async () => {
      await expect(
        LinkValidatorService.validateLink(invalidUrl)
      ).eventually.rejectedWith(TypeError);
    });

    describe('handling faulty links', () => {
      beforeEach(() => {
        // Set retry to 0 for faster error testing
        const retryOnceConfig: retry.OperationOptions = { retries: 0 };
        LinkValidatorService.config.resolveLinkRetryConfig = retryOnceConfig;
      });

      it('should throw LinkValidationError for 403 status code', async () => {
        await expect(
          LinkValidatorService.validateLink(url403)
        ).eventually.rejectedWith(LinkValidationError);
      });

      it('should throw LinkValidationError for 429 status code', async () => {
        await expect(
          LinkValidatorService.validateLink(url429)
        ).eventually.rejectedWith(LinkValidationError);
      });

      it('should throw LinkValidationError for network error', async () => {
        await expect(
          LinkValidatorService.validateLink(networkErrorUrl)
        ).eventually.rejectedWith(LinkValidationError);
      });
    });
  });
  describe('Safe Browsing checks', () => {
    beforeEach(() => {
      LinkValidatorService.config.enableVirusScan = true;
    });

    it('should not throw an error for non-malicious link', async () => {
      const mockResponse = {
        data: {},
      };

      const mockClient = {
        threatMatches: {
          find: sandbox.stub().resolves(mockResponse),
        },
      };

      sandbox
        .stub(safebrowsing_v4, 'Safebrowsing')
        .returns(mockClient as unknown as safebrowsing_v4.Safebrowsing);

      await expect(LinkValidatorService.validateLink(safeUrl)).eventually
        .fulfilled;
    });

    it('should return safe URL for non-malicious link', async () => {
      const mockResponse = {
        data: {},
      };

      const mockClient = {
        threatMatches: {
          find: sandbox.stub().resolves(mockResponse),
        },
      };

      sandbox
        .stub(safebrowsing_v4, 'Safebrowsing')
        .returns(mockClient as unknown as safebrowsing_v4.Safebrowsing);

      const result = await LinkValidatorService.validateLink(safeUrl);
      expect(result).to.equal(safeUrl);
    });

    it('should throw LinkValidationError for malicious link', async () => {
      const mockResponse = {
        data: {
          matches: [
            {
              threatType: 'MALWARE',
              platformType: 'ANY_PLATFORM',
              threat: {
                url: maliciousUrl,
              },
              cacheDuration: '300s',
              threatEntryType: 'URL',
            },
          ],
        },
      };

      const mockClient = {
        threatMatches: {
          find: sandbox.stub().resolves(mockResponse),
        },
      };

      sandbox
        .stub(safebrowsing_v4, 'Safebrowsing')
        .returns(mockClient as unknown as safebrowsing_v4.Safebrowsing);

      await expect(
        LinkValidatorService.validateLink(maliciousUrl)
      ).eventually.rejectedWith(LinkValidationError);
    });

    it('should throw LinkValidationError with correct error type for malicious link', async () => {
      const mockResponse = {
        data: {
          matches: [
            {
              threatType: 'MALWARE',
              platformType: 'ANY_PLATFORM',
              threat: {
                url: maliciousUrl,
              },
              cacheDuration: '300s',
              threatEntryType: 'URL',
            },
          ],
        },
      };

      const mockClient = {
        threatMatches: {
          find: sandbox.stub().resolves(mockResponse),
        },
      };

      sandbox
        .stub(safebrowsing_v4, 'Safebrowsing')
        .returns(mockClient as unknown as safebrowsing_v4.Safebrowsing);

      await expect(
        LinkValidatorService.validateLink(maliciousUrl)
      ).eventually.rejectedWith(LinkValidationError);
    });
  });
});
