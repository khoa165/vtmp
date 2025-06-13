import { expect, assert } from 'chai';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { LinkValidatorService } from '@/services/link-validator.service';
import { LinkValidationError } from '@/utils/errors';
import retry from 'retry';

const shortenedUrl_shouldReturn200 = 'https://bit.ly/3SA6Wol';
const testUrl_shouldReturn403 = 'https://httpstat.us/403';
const testUrl_shouldReturn429 = 'https://httpstat.us/429';
const testUrl_shouldReturnNetworkError = 'https://meow.meow';
const testUrl_shouldReturnTypeError = 'not-a-valid-url';

chai.use(chaiAsPromised);
describe('LinkValidatorService', () => {
  describe('resolveRedirects', () => {
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
  });
  describe('handling faulty links', () => {
    it('should return 403 error', async () => {
      const error = await testErrorResponse(testUrl_shouldReturn403);
      expect(error.statusCode).equals(403);
    });
    it('should throw 429 eror', async () => {
      const error = await testErrorResponse(testUrl_shouldReturn429);
      expect(error.statusCode).equals(429);
    });
    it('should return network error', async () => {
      const error = await testErrorResponse(testUrl_shouldReturnNetworkError);
      expect(error.message).contains('Network error');
    });
  });
});

async function testErrorResponse(url: string): Promise<LinkValidationError> {
  try {
    const retryOnceConfig: retry.OperationOptions = { retries: 0 };
    LinkValidatorService.config.retryConfig = retryOnceConfig;
    await LinkValidatorService.validateLink(url);
  } catch (e) {
    if (e instanceof LinkValidationError === false) {
      assert.fail();
    }
    return Promise.resolve(e);
  }
  assert.fail('Fail: LinkValidationService did not throw any error');
}
