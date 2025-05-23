export class LinkValidatorService {
  private static async resolveRedirects(rawUrl: string): Promise<string> {
    return Promise.resolve(rawUrl);
  }

  private static async checkSafety(url: string): Promise<void> {
    console.log(url);
  }

  static async validateLink(rawUrl: string): Promise<string> {
    const originalUrl = await this.resolveRedirects(rawUrl);
    await this.checkSafety(originalUrl);
    return originalUrl;
  }
}
