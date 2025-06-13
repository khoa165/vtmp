import { withRetry } from '@/helpers/retry.helper';
import { LinkValidationError } from '@/utils/errors';
import retry from 'retry';
export const LinkValidatorService = {
  config: {
    maxRedirects: 10,
    timeoutMs: 8000,
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',
    httpErrorNoRetry: [429],
    retryConfig: {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 30 * 1000,
    } as retry.OperationOptions,
  },

  /**
   * Validates and resolves shortened URLs to their final destination
   * @param url - The URL to validate and resolve
   * @returns The final resolved URL
   * @throws `LinkValidationError`
   */
  async validateLink(url: string): Promise<string> {
    // Validate URL format - throws TypeError if invalid
    new URL(url);
    const { retryConfig, httpErrorNoRetry } = this.config;
    const resolvedUrl = await withRetry(
      () => this._resolveRedirects(url),
      retryConfig,
      (error: Error) => {
        return (
          error instanceof LinkValidationError &&
          error.statusCode !== undefined &&
          httpErrorNoRetry.includes(error.statusCode)
        );
      }
    );

    return resolvedUrl;
  },

  /**
   * Resolves URL redirects following the chain to the final destination
   */
  async _resolveRedirects(url: string): Promise<string> {
    const { timeoutMs, userAgent } = this.config;

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: { 'User-Agent': userAgent },
        signal: AbortSignal.timeout(timeoutMs),
        redirect: 'follow',
      });
    } catch (error) {
      throw new LinkValidationError(
        'Network error while checking URL Responsiveness',
        { url },
        { cause: error }
      );
    }
    if (!response.ok) {
      throw new LinkValidationError(
        `Failed to validate link due to HTTP error`,
        { url },
        {
          cause: `HTTP Error ${response.status}: ${response.statusText}`,
          statusCode: response.status,
        }
      );
    }

    const finalUrl = response.url;
    console.log('Successfully reached link', url);
    return finalUrl;
  },

  async _checkSafety(url: string): Promise<void> {
    console.log(url);
  },
};
