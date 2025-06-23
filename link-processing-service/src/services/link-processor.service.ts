// import { LinkValidatorService } from '@/services/link-validator.service';
import { ExtractLinkMetadataService } from '@/services/extract-link-metadata.service';
import { WebScrapingService } from '@/services/web-scraping.service';
import {
  SubmittedLink,
  MetadataExtractedLink,
  FailedProcessedLink,
} from '@/types/link-processing.types';

export const LinkProcessorService = {
  processLinks: async (
    linksData: SubmittedLink[]
  ): Promise<{
    successfulLinks: MetadataExtractedLink[];
    failedLinks: FailedProcessedLink[];
  }> => {
    const failedLinks: FailedProcessedLink[] = [];
    // const { validatedLinks, failedValidationLinks } =
    //   LinkValidatorService.validateLinks(linksData);

    // Simulate Validation stage: get validatedLinks and failedValidationLinks
    // To be removed in Link Validation Service PR
    const validatedLinks = linksData.map((linkData) => ({
      originalRequest: linkData,
      url: linkData.originalUrl,
    }));
    const failedValidationLinks: FailedProcessedLink[] = [];

    // Scraping stage:
    const { scrapedLinks, failedScrapingLinks } =
      await WebScrapingService.scrapeLinks(validatedLinks);

    // AI Metadata extraction stage
    const { metadataExtractedLinks, failedMetadataExtractionLinks } =
      await ExtractLinkMetadataService.extractMetadata(scrapedLinks);

    failedLinks.push(
      ...failedValidationLinks,
      ...failedScrapingLinks,
      ...failedMetadataExtractionLinks
    );

    return { successfulLinks: metadataExtractedLinks, failedLinks };
  },
};
