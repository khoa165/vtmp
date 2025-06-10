import { ExtractLinkMetadataService } from '@/services/extract-link-metadata.service';
import { ScraperService } from '@/services/web-scraper.service';
import { retry, wait } from 'ts-retry-promise';
import { expect } from 'chai';
describe('LinkProcessorService', () => {
  const indeedUrl =
    'https://www.indeed.com/jobs?l=California&from=searchOnHP%2CsearchSuggestions%2CwhatautocompleteSourceSimba%2Cwhereautocomplete&vjk=eaadc7650cd851af&advn=1592313491803868';
  const extractedText = '';
  describe('ExtractLinkMetadataService', () => {
    it('should return error when processing time exceed limit', async () => {
      await expect(
        retry(
          () => {
            wait(3000);
            return ExtractLinkMetadataService.extractMetadata(
              extractedText,
              indeedUrl
            );
          },
          { retries: 3, delay: 1000, timeout: 2000 }
        )
      ).eventually.rejectedWith(Error);
    });
  });
  describe('ScrapeService', () => {
    it('should return error when processing time exceed limit', async () => {
      await expect(
        retry(
          () => {
            wait(3000);
            return ScraperService.scrapeWebsite(indeedUrl);
          },
          { retries: 3, delay: 1000, timeout: 2000 }
        )
      ).eventually.rejectedWith(Error);
    });

    it('should return error when accessing bot-detected url', async () => {
      await expect(
        retry(
          () => {
            return ScraperService.scrapeWebsite(indeedUrl);
          },
          { retries: 3, delay: 1000, timeout: 2000 }
        )
      ).eventually.rejectedWith(Error);
    });
  });
});
