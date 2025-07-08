import { GlobalOptions, safebrowsing_v4 } from '@googleapis/safebrowsing';
import { Environment } from '@vtmp/server-common/constants';
import retry from 'retry';

import {
  SubmittedLink,
  FailedProcessedLink,
  LinkStatus,
  LinkProcessingFailureStage,
} from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import {
  executeWithRetry,
  httpErrorNoShortRetry,
} from '@/helpers/retry.helper';
import { ValidatedLink } from '@/types/link-processing.types';
import { LinkValidationError } from '@/utils/errors';
import { LinkValidationErrorType } from '@/utils/errors-enum';

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
    maxLongRetry: 4,
  },

  /**
   * Concurrently validates links for reachability, resolve shortened links (if applicable), then check for virus via Safe Browsing API
   * @param requests Links to validate
   * @returns A promise that resolves to an object containing:
   *   - `validatedUrls`: An array of results for successfully validated links.
   *   - `faultyUrls`: An array of errors for links that failed validation, including error details and failure stage.
   */
  async validateLinks(requests: SubmittedLink[]): Promise<{
    validatedUrls: ValidatedLink[];
    faultyUrls: FailedProcessedLink[];
  }> {
    const validatedUrls: ValidatedLink[] = [];
    const faultyUrls: FailedProcessedLink[] = [];

    // Early return
    if (requests.length === 0) {
      console.warn(
        '[LinkValidatorService] WARN: Empty requests to validate links. Will not validate any links for this run.'
      );
      return { validatedUrls, faultyUrls };
    }

    await Promise.allSettled(
      requests.map(async (request) => {
        try {
          const validatedUrl = await this.validateLink(request.originalUrl);
          validatedUrls.push({
            originalRequest: request,
            url: validatedUrl,
          });
        } catch (error) {
          const status = this._determineProcessStatus(request, error);
          faultyUrls.push({
            originalRequest: request,
            status: status,
            failureStage: LinkProcessingFailureStage.VALIDATION_FAILED,
            error: error,
          });

          console.warn(`Link failed at LinkValidationService.`, {
            url: request.originalUrl,
            error: error,
          });
        }
      })
    );
    return { validatedUrls, faultyUrls };
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
      () => this._performNetworkCheck(url),
      retryConfig,
      (error: Error) => {
        return (
          error instanceof LinkValidationError &&
          error.statusCode !== undefined &&
          !httpErrorNoShortRetry.includes(error.statusCode)
        );
      }
    );

    if (!this.config.enableVirusScan) {
      if (EnvConfig.get().NODE_ENV !== Environment.TEST) {
        throw new Error(
          '[LinkValidatorService] Can only disable virus scan in test environment'
        );
      }
      return resolvedUrl;
    }
    const linkIsSafe = await executeWithRetry(() => {
      return this._checkSafety(resolvedUrl);
    }, this.config.virusScanRetryConfig);
    if (!linkIsSafe) {
      throw new LinkValidationError(
        'Provided link fails safety check',
        LinkValidationErrorType.SITE_REPORTED_MALICIOUS,
        {
          url: url,
        }
      );
    }
    return resolvedUrl;
  },

  /**
   * Decide on whether link should be retried.
   * @param originalRequest
   * @param error
   */
  _determineProcessStatus(
    originalRequest: SubmittedLink,
    error: unknown
  ): LinkStatus {
    if (originalRequest.attemptsCount >= this.config.maxLongRetry) {
      return LinkStatus.PIPELINE_FAILED;
    }
    if (error instanceof LinkValidationError) {
      if (error.errorType === LinkValidationErrorType.SITE_REPORTED_MALICIOUS) {
        return LinkStatus.PIPELINE_REJECTED;
      }
    }
    return LinkStatus.PENDING_RETRY;
  },

  /**
   * Resolves URL redirects following the chain to the final destination
   */
  async _performNetworkCheck(url: string): Promise<string> {
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
        `Network error while checking URL. Message: ${error instanceof Error ? error.message : 'Unknown error'}`,
        LinkValidationErrorType.NETWORK_ERROR,
        { url: url },
        { cause: error }
      );
    }
    if (!response.ok) {
      throw new LinkValidationError(
        `Failed to validate link due to HTTP error code ${response.status}`,
        LinkValidationErrorType.SITE_UNREACHABLE,
        { url: url },
        {
          cause: `HTTP Error ${response.status}: ${response.statusText}`,
          statusCode: response.status,
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
        const attempts = this.config.virusScanRetryConfig.retries;
        throw new LinkValidationError(
          `Unable to validate link safety with Safe Browsing API after ${attempts} attempts. Message: ${error.message}`,
          LinkValidationErrorType.SAFETY_API_FAILED,
          { url: url },
          { cause: error }
        );
      }
    }
    if (response?.data.matches) {
      return false;
    }
    return true;
  },
};

export { LinkValidatorService };
