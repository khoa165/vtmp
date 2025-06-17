// import { LinkValidatorService } from '@/services/link-validator.service';
import { ExtractLinkMetadataService } from '@/services/extract-link-metadata.service';
import { WebScrapingService } from '@/services/web-scraping.service';
import {
  LinkType,
  ExtractedMetadata,
} from '@/services/link-metadata-validation';

export const LinkProcessorService = {
  processLinks: async (linksData: LinkType[]): Promise<ExtractedMetadata[]> => {
    // const validUrl = await LinkValidatorService.validateLink(url);
    const scrapingStageResults =
      await WebScrapingService.scrapeLinks(linksData);
    const aiMetadataExtractionResults =
      await ExtractLinkMetadataService.extractMetadata(scrapingStageResults);
    return aiMetadataExtractionResults;
  },
};
