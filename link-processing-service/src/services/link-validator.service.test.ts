/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { expect, assert } from 'chai';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { LinkValidatorService } from '@/services/link-validator.service';
import { LinkValidationError } from '@/utils/errors';
import retry from 'retry';
import * as sinon from 'sinon';
import { safebrowsing_v4 } from '@googleapis/safebrowsing';
import { SubmittedLink } from '@/services/link-metadata-validation';
import { LinkValidationErrorType } from '@/utils/errors-enum';

const shortenedUrl_shouldReturn200 = 'https://bit.ly/3SA6Wol';
const testUrl_shouldReturn403 = 'https://httpstat.us/403';
const testUrl_shouldReturn429 = 'https://httpstat.us/429';
const testUrl_shouldReturnNetworkError = 'https://meow.meow';
const testUrl_shouldReturnTypeError = 'not-a-valid-url';

const testRetryConfig: retry.WrapOptions = {
  retries: 3,
  factor: 2,
  minTimeout: 10,
  maxTimeout: 10,
};
const originalConfig = LinkValidatorService.config.resolveLinkRetryConfig;

chai.use(chaiAsPromised);
describe('LinkValidatorService', () => {
  beforeEach(() => {
    sinon.stub(console, 'warn');
    LinkValidatorService.config.resolveLinkRetryConfig = testRetryConfig;
  });
  afterEach(() => {
    sinon.restore();
    LinkValidatorService.config.resolveLinkRetryConfig = originalConfig;
  });
  describe('validateLinks', () => {
    it('should return 1 successful link and 1 failed links', async () => {
      const requests: SubmittedLink[] = [];
      const links = [shortenedUrl_shouldReturn200, testUrl_shouldReturn403];
      for (let i = 0; i < links.length; i++) {
        requests.push({
          _id: String(i),
          originalUrl: links[i]!,
          attemptsCount: 0,
        });
      }
      const { validatedUrls, faultyUrls } =
        await LinkValidatorService.validateLinks(requests);

      expect(validatedUrls.length).equals(1);
      expect(faultyUrls.length).equals(1);
    });
  });
  describe('performNetworkCheck', () => {
    before(() => {
      //disable by default to avoid hitting Google Safe Browsing API limits
      LinkValidatorService.config.enableVirusScan = false;
    });
    it('should return final URL without any errors', async () => {
      const url = shortenedUrl_shouldReturn200;
      const finalLink = await LinkValidatorService.validateLink(url);
      expect(finalLink).equals('https://www.cbc.ca/');
    });
    it('should throw a TypeError for invalid URL format', async () => {
      await expect(
        LinkValidatorService.validateLink(testUrl_shouldReturnTypeError)
      ).to.be.rejectedWith(TypeError);
    });
    describe('handling faulty links', () => {
      it('should return 403 error', async () => {
        const error = await testErrorResponse(testUrl_shouldReturn403);
        expect(error.statusCode).equals(403);
      });
      it('should throw 429 error', async () => {
        const error = await testErrorResponse(testUrl_shouldReturn429);
        expect(error.statusCode).equals(429);
      });
      it('should return network error', async () => {
        const error = await testErrorResponse(testUrl_shouldReturnNetworkError);
        expect(error.message).contains('Network error');
      });
    });
  });
  describe('Safe Browsing checks', () => {
    //re-enable virus scan.
    before(() => (LinkValidatorService.config.enableVirusScan = true));
    after(() => (LinkValidatorService.config.enableVirusScan = false));

    it('should return true for non-malicious link (empty response.data)', async () => {
      // Mock the Safe Browsing client
      const mockResponse = {
        data: {},
      };

      const mockClient = {
        threatMatches: {
          find: sinon.stub().resolves(mockResponse),
        },
      };

      // Stub the Safebrowsing constructor to return our mock client
      sinon
        .stub(safebrowsing_v4, 'Safebrowsing')
        .returns(mockClient as unknown as safebrowsing_v4.Safebrowsing);

      const safeUrl = 'https://www.google.com/';
      const result = await LinkValidatorService.validateLink(safeUrl);

      expect(result).to.equal(safeUrl);
    });

    it('should return false for malicious link (response.data contains threat matches)', async () => {
      // Mock the Safe Browsing client with malicious response
      const mockResponse = {
        data: {
          matches: [
            {
              threatType: 'MALWARE',
              platformType: 'ANY_PLATFORM',
              threat: {
                url: 'http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/',
              },
              cacheDuration: '300s',
              threatEntryType: 'URL',
            },
          ],
        },
      };
      const mockClient = {
        threatMatches: {
          find: sinon.stub().resolves(mockResponse),
        },
      };
      sinon
        .stub(safebrowsing_v4, 'Safebrowsing')
        .returns(mockClient as unknown as safebrowsing_v4.Safebrowsing);

      const maliciousUrl =
        'http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/';
      try {
        await LinkValidatorService.validateLink(maliciousUrl);
      } catch (error) {
        if (error instanceof LinkValidationError) {
          expect(error.errorType).to.include(
            LinkValidationErrorType.SITE_REPORTED_MALICIOUS
          );
        }
      }
    });
  });
});

async function testErrorResponse(url: string): Promise<LinkValidationError> {
  try {
    const retryOnceConfig: retry.OperationOptions = { retries: 0 };
    LinkValidatorService.config.resolveLinkRetryConfig = retryOnceConfig;
    await LinkValidatorService.validateLink(url);
  } catch (e) {
    if (e instanceof LinkValidationError === false) {
      assert.fail();
    }
    return Promise.resolve(e);
  }
  assert.fail('Fail: LinkValidationService did not throw any error');
}
