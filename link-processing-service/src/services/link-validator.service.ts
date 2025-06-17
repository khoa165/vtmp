import { executeWithRetry, httpErrorNoRetry } from '@/helpers/retry.helper';
import { LinkValidationError } from '@/utils/errors';
import { EnvConfig } from '@/config/env';
import retry from 'retry';
import { GlobalOptions, safebrowsing_v4 } from '@googleapis/safebrowsing';

const LinkValidatorService = {
  config: {
    timeoutMs: 8000,
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',
    resolveLinkRetryConfig: {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 15 * 1000,
    } as retry.WrapOptions,
    virusScanRetryConfig: {
      retries: 2,
      factor: 2,
      minTimeout: 5 * 1000,
      maxTimeout: 10 * 1000,
    } as retry.WrapOptions,
    enableVirusScan: true,
  },

  /**
   * Resolves shortened URLs to their final destination and scan it for known malicious links
   * @param url - The URL to validate and resolve
   * @returns The final resolved URL
   * @throws `LinkValidationError`
   */
  async validateLink(url: string): Promise<string> {
    // Validate URL format - throws TypeError if invalid
    new URL(url);
    const { resolveLinkRetryConfig: retryConfig } = this.config;

    const resolvedUrl = await executeWithRetry(
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

    const linkIsSafe = executeWithRetry(async () => {
      return await this._checkSafety(resolvedUrl);
    }, this.config.virusScanRetryConfig);
    if (!linkIsSafe) {
      throw new LinkValidationError(
        'Provided link fails safety check',
        { url },
        { failedSteps: [LINK_VALIDATOR_STEPS.SAFETY_CHECK] }
      );
    }
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
        { cause: error, failedSteps: [LINK_VALIDATOR_STEPS.NETWORK_CHECK] }
      );
    }
    if (!response.ok) {
      throw new LinkValidationError(
        `Failed to validate link due to HTTP error`,
        { url },
        {
          cause: `HTTP Error ${response.status}: ${response.statusText}`,
          statusCode: response.status,
          failedSteps: [LINK_VALIDATOR_STEPS.NETWORK_CHECK],
        }
      );
    }

    const finalUrl = response.url;
    return finalUrl;
  },

  /**
   * Check if URL is safe using Google Safe Browsing v4 API
   * @param url - The URL to check for safety
   * @returns Promise<boolean> - true if safe, false if unsafe
   */
  async _checkSafety(url: string): Promise<boolean> {
    const GOOGLE_SAFE_BROWSING_API_KEY =
      EnvConfig.get().GOOGLE_SAFE_BROWSING_API_KEY;
    const options: GlobalOptions = { auth: GOOGLE_SAFE_BROWSING_API_KEY };
    const client = new safebrowsing_v4.Safebrowsing(options);
    const requestBody: safebrowsing_v4.Schema$GoogleSecuritySafebrowsingV4FindThreatMatchesRequest =
      {
        client: {
          clientId: 'VTMP-LinkProcessing',
          clientVersion: '1.0.0',
        },
        threatInfo: {
          platformTypes: ['ANY_PLATFORM'],
          threatEntries: [
            {
              url,
            },
          ],
          threatEntryTypes: ['URL'],
          threatTypes: [
            'MALWARE',
            'SOCIAL_ENGINEERING',
            'UNWANTED_SOFTWARE',
            'POTENTIALLY_HARMFUL_APPLICATION',
          ],
        },
      };

    let response = undefined;
    try {
      response = await client.threatMatches.find({
        requestBody: requestBody,
      });
    } catch (error) {
      if (error instanceof Error) {
        const attempts = this.config.resolveLinkRetryConfig.retries;
        throw new LinkValidationError(
          `Unable to validate link safety with Safe Browsing API after ${attempts} attempts`,
          { url },
          { cause: error, failedSteps: [LINK_VALIDATOR_STEPS.SAFETY_CHECK] }
        );
      }
    }
    if (response?.data.matches) {
      const threat = response.data.matches.at(0);
      console.warn(
        `[LinkValidatorService] Link rejected. Virus check came back as malicious or unsure.`,
        {
          url: url,
          threatType: threat?.threatType,
        }
      );
      return false;
    }
    return true;
  },
};

enum LINK_VALIDATOR_STEPS {
  NETWORK_CHECK = 'NETWORK_CHECK',
  SAFETY_CHECK = 'SAFETY_CHECK',
}

export { LinkValidatorService, LINK_VALIDATOR_STEPS };
