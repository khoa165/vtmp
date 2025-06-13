import { expect, assert } from 'chai';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { LinkValidatorService } from '@/services/link-validator.service';
import { LinkValidationError } from '@/utils/errors';

const shortenedUrl_shouldReturn200 = 'https://forms.gle/ev19p5dMVWaZ6oTn8';
const testUrl_shouldReturn403 = 'https://httpstat.us/403';
const testUrl_shouldReturn429 = 'https://httpstat.us/429';
const testUrl_shouldReturnNetworkError = 'https://meow.meow';

chai.use(chaiAsPromised);
describe('LinkValidatorService', () => {
  describe('resolveRedirects', () => {
    it('should return final URL without any errors', async () => {
      const url = shortenedUrl_shouldReturn200;
      const finalLink = await LinkValidatorService.validateLink(url);
      expect(finalLink).equals(
        'https://docs.google.com/forms/d/e/1FAIpQLSdSFZsK-cdXj26nTagTdLL3BJpQkYQ1dTEMWLyFFOvGzNzIUw/viewform?usp=send_form'
      );
    });
    it('should return 403 error', async () => {
      try {
        await LinkValidatorService.validateLink(testUrl_shouldReturn403);
      } catch (e) {
        if (e instanceof LinkValidationError === false) {
          assert.fail();
        }
        expect((e as Error).cause).equals(403);
      }
    });
    it('should throw 429 eror', async () => {
      try {
        await LinkValidatorService.validateLink(testUrl_shouldReturn429);
      } catch (e) {
        if (e instanceof LinkValidationError === false) {
          assert.fail();
        }
        expect((e as Error).cause).equals(429);
      }
    });
    it('should return network error', async () => {
      try {
        await LinkValidatorService.validateLink(
          testUrl_shouldReturnNetworkError
        );
      } catch (e) {
        if (e instanceof LinkValidationError === false) {
          assert.fail();
        }
        expect(e.message).contains('Network error');
      }
    });
  });
});
