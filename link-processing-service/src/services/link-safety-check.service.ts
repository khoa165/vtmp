import { GlobalOptions, safebrowsing_v4 } from '@googleapis/safebrowsing';
import {
  FailedProcessedLink,
  SubmittedLink,
} from '@vtmp/server-common/constants';
import retry from 'retry';

import { LinkProcessingFailureStage, LinkStatus } from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import { executeWithRetry } from '@/helpers/retry.helper';
import { ScrapedLink } from '@/types/link-processing.types';
import { MaliciousLinkError } from '@/utils/errors';
import { MaliciousLinkErrorType } from '@/utils/errors-enum';

export const LinkSafetyCheckService = {
  config: {
    virusScanRetryConfig: {
      retries: 2,
      factor: 2,
      minTimeout: 5_000,
      maxTimeout: 10_000,
    } as retry.WrapOptions,
    maxLongRetry: 4,
  },

  /**
   * Check if URLs are safe using Google Safe Browsing v4 API
   * @param urls - Array of URLs to check for safety
   * @returns Promise<{ safeUrls: string[], unsafeUrls: string[] }>
   */
  async checkSafety(scrapedLinks: ScrapedLink[]): Promise<{
    scannedLinks: ScrapedLink[];
    failedVirusLinks: FailedProcessedLink[];
  }> {
    const scannedLinksResult: ScrapedLink[] = [];
    const failedVirusLinks: FailedProcessedLink[] = [];

    // Early return
    if (scrapedLinks.length === 0) {
      console.warn(
        '[LinkSafetyCheckService] WARN: Empty URLs array. Will not perform safety check for this run.'
      );
      return { scannedLinks: scannedLinksResult, failedVirusLinks: [] };
    }

    await Promise.allSettled(
      scrapedLinks.map(async (link) => {
        try {
          const url = link.url;
          // Validate URL format - throws TypeError if invalid
          new URL(url);

          const safetyResult = await executeWithRetry(() => {
            return this._scanFromSafeBrowsing(url);
          }, this.config.virusScanRetryConfig);

          if (safetyResult === true) {
            scannedLinksResult.push(link);
          } else if (safetyResult instanceof MaliciousLinkError) {
            failedVirusLinks.push({
              originalRequest: link.originalRequest,
              status: this._determineProcessStatus(
                link.originalRequest,
                MaliciousLinkErrorType.SITE_REPORTED_MALICIOUS
              ),
              failureStage: LinkProcessingFailureStage.VIRUS_FAILED,
              error: safetyResult,
            });
          }
        } catch (error) {
          // This only happens if API call to virus scanning service fails. Will mark it to retry
          failedVirusLinks.push({
            originalRequest: link.originalRequest,
            status: this._determineProcessStatus(
              link.originalRequest,
              MaliciousLinkErrorType.SAFETY_API_FAILED
            ),
            failureStage: LinkProcessingFailureStage.VIRUS_FAILED,
            error: error,
          });
          console.warn(`Failed to check URL safety: ${link.url}`, error);
        }
      })
    );

    return { scannedLinks: scannedLinksResult, failedVirusLinks };
  },

  /**
   * Check if URL is safe using Google Safe Browsing v4 API
   * @param url - The URL to check for safety
   * @returns Promise<boolean> - true if safe, false if unsafe
   */
  async _scanFromSafeBrowsing(
    url: string
  ): Promise<boolean | MaliciousLinkError> {
    const threatMatches = this._initSafeBrowsingThreatMatches();
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
      response = await threatMatches.find({
        requestBody: requestBody,
      });
    } catch (error) {
      throw new MaliciousLinkError(
        `Unable to validate link safety with Google Safe Browsing API.`,
        { url: url },
        MaliciousLinkErrorType.SAFETY_API_FAILED,
        { cause: error }
      );
    }
    if (response?.data?.matches) {
      const threat = response.data.matches?.at(0);
      return new MaliciousLinkError(
        `Link reported as unsafe by Google Safe Browsing API.`,
        { url: url },
        MaliciousLinkErrorType.SITE_REPORTED_MALICIOUS,
        {
          cause: {
            platformType: threat?.platformType,
            threatType: threat?.threatType,
          },
        }
      );
    }
    return true;
  },

  /**
   * Decide on whether link should be long retried.
   * @param originalRequest
   * @param failureType
   */
  _determineProcessStatus(
    originalRequest: SubmittedLink,
    failureType: MaliciousLinkErrorType
  ): LinkStatus {
    if (failureType === MaliciousLinkErrorType.SITE_REPORTED_MALICIOUS) {
      return LinkStatus.PIPELINE_REJECTED;
    }
    if (originalRequest.attemptsCount > this.config.maxLongRetry) {
      return LinkStatus.PIPELINE_FAILED;
    }
    return LinkStatus.PENDING_RETRY;
  },
  /**
   * Initializes and returns the Google Safe Browsing API threatMatches client.
   *
   * This method retrieves the Google Safe Browsing API key from the environment configuration,
   * creates a new instance of the Safe Browsing API client with the provided authentication,
   * and returns the `threatMatches` resource for performing threat match checks.
   *
   * @returns The threatMatches resource for querying threat information.
   */
  _initSafeBrowsingThreatMatches(): safebrowsing_v4.Resource$Threatmatches {
    const GOOGLE_SAFE_BROWSING_API_KEY =
      EnvConfig.get().GOOGLE_SAFE_BROWSING_API_KEY;
    const options: GlobalOptions = { auth: GOOGLE_SAFE_BROWSING_API_KEY };
    const threatMatches = new safebrowsing_v4.Safebrowsing(options)
      .threatMatches;
    return threatMatches;
  },
};
