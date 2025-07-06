import retry from 'retry';

/**
 * Executes an asynchronous operation with retry logic.
 *
 * @template T The type of the result returned by the operation.
 * @param operation A function that returns a Promise of type T to be executed.
 * @param retryConfig Configuration options for the retry operation (from the `retry` library).
 * @param shouldRetry  Optional. A function that determines whether a given error should trigger a retry.
 * If unfilled,the `operation` will be retried until timeout or max retries reached
 * @returns A Promise that resolves with the result of the operation, or rejects if all retries fail or if the error is not retryable.
 */
async function executeWithRetry<T>(
  operation: () => Promise<T>,
  retryConfig: retry.OperationOptions,
  shouldRetry?: (error: Error) => boolean
): Promise<T> {
  const retryOperation = retry.operation(retryConfig);

  return new Promise<T>((resolve, reject) => {
    retryOperation.attempt(async () => {
      try {
        const result = await operation();
        resolve(result);
      } catch (error) {
        const castedError = error as Error;
        if (
          (shouldRetry !== undefined && !shouldRetry(castedError)) ||
          !retryOperation.retry(castedError)
        ) {
          reject(error);
        }
      }
    });
  });
}

/**
 * If received, these HTTP status codes should not be retried
 */
const httpErrorNoShortRetry = [429];

export { executeWithRetry, httpErrorNoShortRetry };
