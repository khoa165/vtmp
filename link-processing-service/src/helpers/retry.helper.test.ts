/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { executeWithRetry } from '@/helpers/retry.helper';
import { assert, expect } from 'chai';
import retry from 'retry';
const RETRIES = 3;
const retryConfig: retry.WrapOptions = {
  retries: RETRIES,
  factor: 2,
  minTimeout: 10,
  maxTimeout: 10,
};

describe('executeWithRetry', () => {
  describe('successful operation', () => {
    it('should return Promise without any error or retry', async () => {
      let result = false;
      let retryCounter = -1;
      const testFunction_success = async (): Promise<boolean> => {
        retryCounter += 1;
        return Promise.resolve(true);
      };
      try {
        result = await executeWithRetry(
          () => testFunction_success(),
          retryConfig
        );
      } catch (error) {
        assert.fail();
      }
      expect(result).equals(true);
      expect(retryCounter).equals(0);
    });
  });
  describe('unsuccessful operations', () => {
    const errorMessage = 'Hello World';
    let retryCounter = -1;
    const testFail = async (): Promise<boolean> => {
      retryCounter += 1;
      throw new Error(errorMessage);
    };
    beforeEach(() => {
      retryCounter = -1;
    });
    it('should retries 3 times and throws error from operation', async () => {
      try {
        await executeWithRetry(() => testFail(), retryConfig);
      } catch (error) {
        expect((error as Error).message === errorMessage);
        expect(retryCounter).equals(retryConfig.retries!);
      }
    });
    it('should only retry operations if errors pass shouldRetry function', async () => {
      try {
        await executeWithRetry(
          () => testFail(),
          retryConfig,
          (e) => {
            return e.message === errorMessage;
          }
        );
      } catch (error) {
        expect((error as Error).message).equals(errorMessage);
        expect(retryCounter).equals(retryConfig.retries!);
      }
    });
    it('should not retry operations if errors does not pass shouldRetry function', async () => {
      try {
        await executeWithRetry(
          () => testFail(),
          retryConfig,
          (e) => {
            return e.message !== errorMessage;
          }
        );
      } catch (error) {
        expect((error as Error).message).equals(errorMessage);
        expect(retryCounter).equals(0);
      }
    });

    // Test eventual success: fails twice, then succeeds
    it('should retry until eventual success and return result once it succeeds', async () => {
      let callCount = -1;
      const eventualSuccess = async (): Promise<string> => {
        callCount += 1;
        if (callCount < 2) {
          throw new Error('eventual failure');
        }
        return 'success';
      };
      const result = await executeWithRetry(
        () => eventualSuccess(),
        retryConfig
      );
      expect(result).equals('success');
      expect(callCount).equals(2);
    });

    // Test mid-stream abort: shouldRetry returns false after first error
    it('should abort retries when shouldRetry returns false after some failures', async () => {
      let callCount = -1;
      const fatalFailure = async (): Promise<boolean> => {
        callCount += 1;
        throw new Error('fatal');
      };
      try {
        await executeWithRetry(
          () => fatalFailure(),
          retryConfig,
          () => callCount < 1
        );
        assert.fail('Should have thrown');
      } catch (error) {
        expect((error as Error).message).equals('fatal');
        expect(callCount).equals(1);
      }
    });
  });
});
