import { LinkNormalizerService } from '@/services/link-normalizer.service';
import { LinkValidatorService } from '@/services/link-validator.service';
import { LinkMetaData } from '@/services/link-metadata-validation';
import { ExtractLinkMetadataService } from '@/services/extract-link-metadata.service';
import { ScraperService } from '@/services/web-scraper.service';
import { handleError, LinkProcessingStatus } from '@/utils/errors';
// import { LinkDeduplicatorService } from '@/services/link/link-deduplicator.service';

export const LinkProcessorService = {
  processLink: async (
    url: string
  ): Promise<
    | (LinkMetaData & { linkProcessingStatus: LinkProcessingStatus })
    | { url: string; linkProcessingStatus: LinkProcessingStatus }
  > => {
    try {
      const validUrl = await LinkValidatorService.validateLink(url);
      const extractedText = await ScraperService.scrapeWebsite(validUrl);
      const extractedMetadata =
        await ExtractLinkMetadataService.extractMetadata(
          validUrl,
          extractedText
        );
      const normalizedUrl = LinkNormalizerService.normalizeLink(
        extractedMetadata.url
      );
      console.log('Normalized url:', normalizedUrl);
      // await LinkDeduplicatorService.checkDuplicate(normalizedUrl);
      return {
        ...extractedMetadata,
        linkProcessingStatus: LinkProcessingStatus.SUCCESS,
      };
      // Ideally at the end of this, we should send a POST request to main API server submitLink endpoint
      // The payload should have:
      // If the links failed to be processing => should stay at PENDING status
      // If the link got processed => need to update status to PROCESSED
    } catch (error: unknown) {
      return handleError(error, url);
    }

    // try {
    //   const response = await postWithAuthRetry('/links', result);

    //   if (response.status === 201) {
    //     console.log('Job link and metadata deposited successfully!');
    //   } else {
    //     console.log('Failed to deposit job link!');
    //   }
    //   return result;
    // } catch (error: unknown) {
    //   console.error('Failed to POST to /links: ', error);
    //   return result;
    // }
  },
};
