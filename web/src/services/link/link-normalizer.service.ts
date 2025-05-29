import normalizeUrl from 'normalize-url';

export const LinkNormalizerService = {
  removeFormatting(url: string): string {
    //remove quotes, brackets, parentheses wrap around link
    return url.trim().replace(/^[<"'([{]+|[>)"'}\]]+$/g, '');
  },

  // removeWWW(url: string): string {
  //   // return url.trim().replace(/www\./i, '');
  //   return normalizeUrl(url, {
  //     forceHttps: true,
  //   });
  // },

  // removeTrailingSlash(url: string): string {
  //   //remove all trailing forward and backward slashes
  //   // return url.trim().replace(/[/\\]+$/, '');
  //   return normalizeUrl(url);
  // },

  removeAnalyticQueryAndFragment(url: string): string {
    return normalizeUrl(url, {
      sortQueryParameters: false,
      stripHash: true,
      removeQueryParameters: [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'fbclid',
        'gclid',
        'msclkid',
        'ref',
        'source',
        'mc_cid',
        'mc_eid',
        'yclid',
        'dclid',
        '_ga',
        '_gl',
      ],
    });
  },

  removePorts(url: string): string {
    return normalizeUrl(url, {
      removeExplicitPort: true,
    });
  },

  standardizeUrl(url: string): string {
    return normalizeUrl(url);
  },
  normalizeLink(url: string): string {
    let standardizedUrl = this.removeFormatting(url);
    standardizedUrl = this.removeWWW(standardizedUrl);
    standardizedUrl = this.lowercaseDomain(standardizedUrl);
    standardizedUrl = this.removeTrailingSlash(standardizedUrl);
    standardizedUrl = this.removeAnalyticQueryAndFragment(standardizedUrl);
    standardizedUrl = this.removePorts(standardizedUrl);
    return standardizedUrl;
  },
};
