import { LinkStatus } from '@vtmp/common/constants';

import { SubmittedLink } from '@/types/link-processing.types';

/**
 * Decide on whether link should be long retried.
 * @param originalRequest
 * @param maxLongRetry
 * @param error (optional)
 */
export const _determineProcessStatus = (
  originalRequest: SubmittedLink,
  maxLongRetry: number,
  _error?: unknown
): LinkStatus => {
  if (originalRequest.attemptsCount >= maxLongRetry) {
    return LinkStatus.PIPELINE_FAILED;
  }
  return LinkStatus.PENDING_RETRY;
};
