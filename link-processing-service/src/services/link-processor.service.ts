import { LinkValidatorService } from '@/services/link-validator.service';
import { LinkMetaData } from '@/services/link-metadata-validation';
import { ExtractLinkMetadataService } from '@/services/extract-link-metadata.service';
import { ScraperService } from '@/services/web-scraper.service';
import { LinkProcessingSubStatus } from '@vtmp/common/constants';

export const LinkProcessorService = {
  processLink: async (
    url: string
  ): Promise<
    | (LinkMetaData & { linkProcessingStatus: LinkProcessingSubStatus })
    | { url: string; linkProcessingStatus: LinkProcessingSubStatus }
  > => {
    const validUrl = await LinkValidatorService.validateLink(url);
    const extractedText = await ScraperService.scrapeWebsite(validUrl);
    const extractedMetadata = await ExtractLinkMetadataService.extractMetadata(
      validUrl,
      extractedText
    );
    return {
      ...extractedMetadata,
      linkProcessingStatus: LinkProcessingSubStatus.SUCCESS,
    };
  },
};
