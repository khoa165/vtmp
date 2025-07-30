import normalizeUrl from 'normalize-url';

export const LinkNormalizerService = {
  removeFormatting(url: string): string {
    //remove quotes, brackets, parentheses wrap around link
    return url
      .trim()
      .replace(/^[\s<>"'`\\/()[\]{}]+|[\s<>"'`\\/()[\]{}]+$/g, '');
  },

  removePorts(url: string): string {
    return normalizeUrl(url, {
      removeExplicitPort: true,
    });
  },

  standardizeUrl(url: string): string {
    const removedFormat = this.removeFormatting(url);
    return normalizeUrl(removedFormat, {
      forceHttps: true,
      sortQueryParameters: false,
      stripHash: true,
      removeExplicitPort: true,
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
        'gh_src',
      ],
    });
  },

  normalizeLink(url: string): string {
    const standardizedUrl = this.standardizeUrl(url);
    const urlObject = new URL(standardizedUrl);
    const searchParams = new URLSearchParams(urlObject.search);
    if (searchParams.size > 0) {
      console.log([...searchParams.entries()]);
    }
    return standardizedUrl;
  },
};
