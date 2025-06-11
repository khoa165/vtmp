export const LinkValidatorService = {
  async resolveRedirects(url: string): Promise<string> {
    return Promise.resolve(url);
  },

  async checkSafety(url: string): Promise<void> {
    console.log(url);
  },

  async validateLink(url: string): Promise<string> {
    const originalUrl = await this.resolveRedirects(url);
    await this.checkSafety(originalUrl);
    return originalUrl;
  },
};
