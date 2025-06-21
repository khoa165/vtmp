// import { LinkValidatorService } from '@/services/link-validator.service';
import { ExtractLinkMetadataService } from '@/services/extract-link-metadata.service';
import { WebScrapingService } from '@/services/web-scraping.service';
import {
  SubmittedLink,
  MetadataExtractedLink,
  FailedProcessedLink,
} from '@/services/link-metadata-validation';
import { LinkValidatorService } from '@/services/link-validator.service';

export const LinkProcessorService = {
  processLinks: async (
    linksData: SubmittedLink[]
  ): Promise<{
    succeededLinks: MetadataExtractedLink[];
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

    // Push all failed to processed links to failedLinks array
    failedLinks.push(
      ...faultyUrls,
      ...failedScrapingLinks,
      ...failedMetadataExtractionLinks
    );
    return { succeededLinks: metadataExtractedLinks, failedLinks };
  },
};
