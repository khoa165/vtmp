import { LinkNormalizerService } from '@/services/link-normalizer.service';
import { LinkValidatorService } from '@/services/link-validator.service';
import { LinkMetaData } from '@/services/link-metadata-validation';
import { ExtractLinkMetadataService } from '@/services/extract-link-metadata.service';
import { ScraperService } from '@/services/scraper.service';
// import { LinkDeduplicatorService } from '@/services/link/link-deduplicator.service';

export const LinkProcessorService = {
  async processLink(url: string): Promise<LinkMetaData | { url: string }> {
    const validUrl = await LinkValidatorService.validateLink(url);
    const extractedText = await ScraperService.scrapeWebsite(validUrl);
    const metaData = await ExtractLinkMetadataService.extractMetadata(
      validUrl,
      extractedText
    );
    const normalizedUrl = LinkNormalizerService.normalizeLink(metaData.url);
    console.log('Normalized url:', normalizedUrl);
    // await LinkDeduplicatorService.checkDuplicate(normalizedUrl);
    return metaData;
    // Ideally at the end of this, we should send a POST request to main API server submitLink endpoint
    // The payload should have:
    // If the links failed to be processing => should stay at PENDING status
    // If the link got processed => need to update status to PROCESSED
  },
};
