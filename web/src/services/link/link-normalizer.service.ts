import normalizeUrl from 'normalize-url';

export class LinkNormalizerService {
  public static removeFormatting(url: string): string {
    //remove quotes, brackets, parentheses wrap around link
    return url.trim().replace(/^[<"'([{]+|[>)"'}\]]+$/g, '');
  }
  public static lowercaseDomain(url: string): string {
    // const urlObj = new URL(url);
    // urlObj.protocol = urlObj.protocol.toLowerCase();
    // urlObj.hostname = urlObj.hostname.toLowerCase();
    // return urlObj.toString();
    return normalizeUrl(url);
  }

  public static removeWWW(url: string): string {
    // return url.trim().replace(/www\./i, '');
    return normalizeUrl(url, {
      forceHttps: true
    })
  }

  
  public static removeTrailingSlash(url: string): string {
    //remove all trailing forward and backward slashes
    // return url.trim().replace(/[/\\]+$/, '');
    return normalizeUrl(url);
  }

  public static removeAnalyticQueryAndFragment(url: string): string {
    return normalizeUrl(url, {
      sortQueryParameters: false,
      stripHash: true,
      removeQueryParameters: ['utm_source',
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
      ]
    });
  }

  public static removePorts(url: string): string {
    return normalizeUrl(url,{
      removeExplicitPort: true
    });
  }

  public static standardizeUrl(url: string): string {
    let standardizedUrl = this.removeFormatting(url);
    standardizedUrl = this.removeWWW(standardizedUrl);
    standardizedUrl = this.lowercaseDomain(standardizedUrl);
    standardizedUrl = this.removeTrailingSlash(standardizedUrl);
    standardizedUrl = this.removeAnalyticQueryAndFragment(standardizedUrl);
    standardizedUrl = this.removePorts(standardizedUrl);

    return standardizedUrl;
  }
}
