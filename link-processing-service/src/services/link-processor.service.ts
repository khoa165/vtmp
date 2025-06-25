// import { LinkValidatorService } from '@/services/link-validator.service';
import { ExtractLinkMetadataService } from '@/services/extract-link-metadata.service';
import { WebScrapingService } from '@/services/web-scraping.service';
import {
  SubmittedLink,
  MetadataExtractedLink,
  FailedProcessedLink,
} from '@/types/link-processing.types';
import { LinkValidatorService } from '@/services/link-validator.service';


export const LinkProcessorService = {
  processLinks: async (
    linksData: SubmittedLink[]
  ): Promise<{
    successfulLinks: MetadataExtractedLink[];
    failedLinks: FailedProcessedLink[];
  }> => {
    const failedLinks: FailedProcessedLink[] = [];
    const { validatedUrls, faultyUrls } =
      await LinkValidatorService.validateLinks(linksData);

    // Scraping stage:
    const { scrapedLinks, failedScrapingLinks } =
      await WebScrapingService.scrapeLinks(validatedUrls);

    // AI Metadata extraction stage
    const { metadataExtractedLinks, failedMetadataExtractionLinks } =
      await ExtractLinkMetadataService.extractMetadata(scrapedLinks);

    failedLinks.push(
      ...faultyUrls,
      ...failedScrapingLinks,
      ...failedMetadataExtractionLinks
    );

    return { successfulLinks: metadataExtractedLinks, failedLinks };
  },
};
