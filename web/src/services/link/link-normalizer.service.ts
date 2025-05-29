export const LinkNormalizerService = {
  isValidFormat(url: string): void {
    console.log(url);
  },
  removeFormatting(url: string): string {
    console.log(url);
    return '';
  },
  removeWWW(url: string): string {
    console.log(url);
    return '';
  },
  lowercaseDomainAndPath(url: string): string {
    console.log(url);
    return '';
  },
  removeTrailingSlash(url: string): string {
    console.log(url);
    return '';
  },
  removeAnalyticQueryAndFragment(url: string): string {
    console.log(url);
    return '';
  },
  stripDefaultPorts(url: string): string {
    console.log(url);
    return '';
  },
  standardizeUrl(url: string): string {
    this.isValidFormat(url);
    let standardizedUrl = this.removeFormatting(url);
    standardizedUrl = this.removeWWW(standardizedUrl);
    standardizedUrl = this.lowercaseDomainAndPath(standardizedUrl);
    standardizedUrl = this.removeTrailingSlash(standardizedUrl);
    standardizedUrl = this.removeAnalyticQueryAndFragment(standardizedUrl);
    standardizedUrl = this.stripDefaultPorts(standardizedUrl);

    return standardizedUrl;
  },
  normalizeLink(url: string): string {
    return this.standardizeUrl(url);
  },
};
