import axios from 'axios';

export const LinkValidatorService = {
  async validateLink(url: string): Promise<string> {
    const resolvedUrl = await _resolveRedirects(url);
    await _checkSafety(resolvedUrl);
    return resolvedUrl;
  },
};

export class LinkValidationError extends Error {
  statusCode: number;
  url: string;

  constructor(message: string, statusCode: number, url: string) {
    super(message);
    this.name = 'LinkValidationError';
    this.statusCode = statusCode;
    this.url = url;
  }
}

type ResolveRedirectsResult = {
  resolvedUrl: string;
  finalStatus: number;
  fromShortener: boolean;
};

async function _resolveRedirectHelper(
  originalUrl: string
): Promise<ResolveRedirectsResult> {
  let currentUrl = originalUrl;
  let redirects = 0;
  while (true) {
    // Ask for just one response; do NOT follow redirects automatically.
    const response = await axios.get(currentUrl, {
      maxRedirects: 0,
      validateStatus: null,
    });

    // If it’s a 3xx, grab the Location header and loop again.
    if (
      response.status >= 300 &&
      response.status < 400 &&
      response.headers.location
    ) {
      // location might be relative; turn it into an absolute URL:
      const nextUrl = new URL(response.headers.location, currentUrl).toString();
      currentUrl = nextUrl;
      redirects += 1;
      continue;
    }

    /**
     * If status code is:
     *  2xx: Successfully reached the unshortened URL without any errors
     *  403 (Forbidden): Most likely from resolved URL (shortener would return 429). Treated as a success
     *
     *  404 (Not found): Link not found, either from resolved URL or from shortener
     *    -> Treated as failure
     *  429 (Rate Limited): can be from shortener OR resolved URL.
     *    If from shortener (fromShortener == true)
     *      -> treat as failure, try again
     *    If from resolved URL
     *      -> treat as success
     *
     *  4xx not mentioned AND all 5xx: General client and server failure. No special case here
     *    -> Treated as failure, maybe try again
     */
    return {
      resolvedUrl: currentUrl,
      finalStatus: response.status,
      fromShortener:
        new URL(currentUrl).hostname === new URL(originalUrl).hostname,
    };
  }
}

async function _resolveRedirects(url: string): Promise<string> {
  //test if URL is properly formatted
  new URL(url).hostname;

  const { resolvedUrl, finalStatus, fromShortener } =
    await _resolveRedirectHelper(url);

  // ---- success paths -------------------------------------------------
  if (finalStatus >= 200 && finalStatus < 300) return resolvedUrl;
  if (finalStatus === 403 && !fromShortener) {
    console.warn('[LinkValidator] destination returned 403 – accepting', {
      resolvedUrl,
    });
    return resolvedUrl;
  }
  if (finalStatus === 429 && !fromShortener) return resolvedUrl;

  // ---- failure paths -------------------------------------------------
  switch (finalStatus) {
    case 404:
      throw new LinkValidationError('Link not found', 404, url);
    case 429: // shortener is throttling us
      throw new LinkValidationError('Shortener rate-limited', 429, url);
    default:
      throw new LinkValidationError(
        `Unhandled HTTP ${finalStatus}`,
        finalStatus,
        url
      );
  }
}

async function _checkSafety(url: string): Promise<void> {
  console.log(url);
}
