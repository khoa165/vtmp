import { LinkValidatorService } from '@/services/link-validator.service';
import { LinkMetaData } from '@/services/link-metadata-validation';
import { ExtractLinkMetadataService } from '@/services/extract-link-metadata.service';
import { ScraperService } from '@/services/web-scraper.service';
import { handleError } from '@/utils/errors';
import { LinkProcessStage } from '@vtmp/common/constants';
import { retry } from 'ts-retry-promise';
export const LinkProcessorService = {
  processLink: async (
    url: string
  ): Promise<
    | (LinkMetaData & { linkProcessingStatus: LinkProcessStage })
    | { url: string; linkProcessingStatus: LinkProcessStage }
  > => {
    try {
      const validUrl = await LinkValidatorService.validateLink(url);
      const extractedText = await retry(
        () => ScraperService.scrapeWebsite(validUrl),
        { retries: 3, delay: 1000, timeout: 10000 }
      );
      const extractedMetadata = await retry(
        () =>
          ExtractLinkMetadataService.extractMetadata(validUrl, extractedText),
        { retries: 3, delay: 1000, timeout: 15000 }
      );
      return {
        ...extractedMetadata,
        linkProcessingStatus: LinkProcessStage.SUCCESS,
      };
    } catch (error: unknown) {
      return handleError(error, url);
    }
  },
};
