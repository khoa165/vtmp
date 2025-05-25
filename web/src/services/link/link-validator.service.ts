export class LinkValidatorService {
  private static async resolveRedirects(url: string): Promise<string> {
    return Promise.resolve(url);
  }

  private static async checkSafety(url: string): Promise<void> {
    console.log(url);
  }

  static async validateLink(url: string): Promise<string> {
    const originalUrl = await this.resolveRedirects(url);
    await this.checkSafety(originalUrl);
    return originalUrl;
  }
}
