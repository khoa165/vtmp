import axios from 'axios';
import { LinkValidationError } from '@/utils/errors';
export const LinkValidatorService = {
  config: {
    maxRedirects: 10,
    timeoutMs: 8000,
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',
    retriableHttpCodes: [429, 503, 502, 504, 408, 500],
  },

  /**
   * Validates and resolves shortened URLs to their final destination
   * @param url - The URL to validate and resolve
   * @returns The final resolved URL
   * @throws `LinkValidationError` with appropriate retryable flag.
   * - HTTP codes flagged for retry: `[429, 502, 503, 504, 408, 500]`
   */
  async validateLink(url: string): Promise<string> {
    // Validate URL format - throws TypeError if invalid
    new URL(url);

    return await this._resolveRedirects(url);
  },

  /**
   * Resolves URL redirects following the chain to the final destination
   */
  async _resolveRedirects(url: string): Promise<string> {
    const { maxRedirects, timeoutMs, retriableHttpCodes } = this.config;

    const response = await axios
      .get(url, {
        timeout: timeoutMs,
        maxRedirects: maxRedirects,
        validateStatus: (status) => status >= 200 && status < 400,
        headers: {
          'User-Agent': this.config.userAgent,
        },
      })
      .catch((error) => {
        if (!axios.isAxiosError(error)) {
          throw new LinkValidationError(
            'Unknown error while checking URL Responsiveness',
            { url },
            { cause: 'UNKNOWN_NON_AXIOS_ERR', retryable: true }
          );
        }
        if (!error.response?.status) {
          const cause = error.cause ?? 'UNKNOWN_AXIOS_ERR';
          throw new LinkValidationError(
            error.message === '' ? `AxiosError: ${error.cause}` : error.message,
            { url },
            { cause: cause, retryable: true }
          );
        }
        throw new LinkValidationError(
          error.message,
          { url },
          {
            cause: error.code,
            retryable: retriableHttpCodes.includes(error.response.status),
          }
        );
      });

    axios.getUri();
    const finalUrl = response.request.res.responseUrl;
    console.log(`URL:`, finalUrl);
    console.log(`HTTP Status Code`, response.status);
    return Promise.resolve(finalUrl);
  },

  async _checkSafety(url: string): Promise<void> {
    console.log(url);
  },
};
