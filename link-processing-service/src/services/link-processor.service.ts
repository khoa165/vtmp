import { LinkNormalizerService } from '@/services/link-normalizer.service';
import { LinkValidatorService } from '@/services/link-validator.service';
import { LinkMetaData } from '@/services/link-metadata-validation';
import { ExtractLinkMetadataService } from '@/services/extract-link-metadata.service';
// import { LinkDeduplicatorService } from '@/services/link/link-deduplicator.service';

export const LinkProcessorService = {
  async processLink(url: string): Promise<LinkMetaData | { url: string }> {
    const validUrl = await LinkValidatorService.validateLink(url);
    const metaData: LinkMetaData | { url: string } =
      await ExtractLinkMetadataService.extractMetadata(validUrl);
    const normalizedUrl = LinkNormalizerService.normalizeLink(metaData.url);
    console.log('Normalized url:', normalizedUrl);
    // await LinkDeduplicatorService.checkDuplicate(normalizedUrl);
    return metaData;
  },
};
