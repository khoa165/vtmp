/* eslint-disable @typescript-eslint/no-extraneous-class */
export class LinkNormalizerService {
  private static isValidFormat(url: string): void {
    console.log(url);
  }
  private static removeFormatting(url: string): string {
    console.log(url);
    return '';
  }
  private static removeWWW(url: string): string {
    console.log(url);
    return '';
  }
  private static lowercaseDomainAndPath(url: string): string {
    console.log(url);
    return '';
  }
  private static removeTrailingSlash(url: string): string {
    console.log(url);
    return '';
  }
  private static removeAnalyticQueryAndFragment(url: string): string {
    console.log(url);
    return '';
  }
  private static stripDefaultPorts(url: string): string {
    console.log(url);
    return '';
  }
  private static standardizeUrl(originalUrl: string): string {
    this.isValidFormat(originalUrl);
    let standardizedUrl = this.removeFormatting(originalUrl);
    standardizedUrl = this.removeWWW(standardizedUrl);
    standardizedUrl = this.lowercaseDomainAndPath(standardizedUrl);
    standardizedUrl = this.removeTrailingSlash(standardizedUrl);
    standardizedUrl = this.removeAnalyticQueryAndFragment(standardizedUrl);
    standardizedUrl = this.stripDefaultPorts(standardizedUrl);

    return standardizedUrl;
  }

  static async normalizeProcess(originalUrl: string): Promise<string> {
    return this.standardizeUrl(originalUrl);
  }
}
