import {
  SubmittedLink,
  MetadataExtractedLink,
  FailedProcessedLink,
} from '@vtmp/common/constants';

import { ExtractLinkMetadataService } from '@/services/extract-link-metadata.service';
import { LinkSafetyCheckService } from '@/services/link-safety-check.service';
import { WebScrapingService } from '@/services/web-scraping.service';

export const LinkProcessorService = {
  processLinks: async (
    linksData: SubmittedLink[]
  ): Promise<{
    successfulLinks: MetadataExtractedLink[];
    failedLinks: FailedProcessedLink[];
  }> => {
    const failedLinks: FailedProcessedLink[] = [];
    // Scraping stage:
    const { scrapedLinks, failedScrapingLinks } =
      await WebScrapingService.scrapeLinks(linksData);

    // Virus scan stage
    const { scannedLinks, failedVirusLinks } =
      await LinkSafetyCheckService.checkSafety(scrapedLinks);

    // AI Metadata extraction stage
    const { metadataExtractedLinks, failedMetadataExtractionLinks } =
      await ExtractLinkMetadataService.extractMetadata(scannedLinks);

    failedLinks.push(
      ...failedScrapingLinks,
      ...failedVirusLinks,
      ...failedMetadataExtractionLinks
    );

    return { successfulLinks: metadataExtractedLinks, failedLinks };
  },
};
