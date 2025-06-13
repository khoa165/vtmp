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
    const { timeoutMs, retriableHttpCodes, userAgent } = this.config;

    let response: Response;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      response = await fetch(url, {
        method: 'GET',
        headers: { 'User-Agent': userAgent },
        signal: controller.signal,
        redirect: 'follow',
      });
      clearTimeout(timer);
    } catch (error) {
      throw new LinkValidationError(
        'Network error while checking URL Responsiveness',
        { url },
        { cause: error, retryable: true }
      );
    }

    // HTTP status handling
    if (retriableHttpCodes.includes(response.status)) {
      throw new LinkValidationError(
        `HTTP ${response.status}`,
        { url },
        { cause: response.status, retryable: true }
      );
    }
    if (!response.ok) {
      throw new LinkValidationError(
        `HTTP ${response.status}`,
        { url },
        { cause: response.status, retryable: false }
      );
    }

    const finalUrl = response.url;
    console.log(`URL:`, finalUrl);
    console.log(`HTTP Status Code`, response.status);
    return finalUrl;
  },

  async _checkSafety(url: string): Promise<void> {
    console.log(url);
  },
};
