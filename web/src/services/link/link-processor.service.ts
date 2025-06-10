import { LinkNormalizerService } from '@/services/link/link-normalizer.service';
import { LinkValidatorService } from '@/services/link/link-validator.service';
import { LinkMetaData } from '@/services/link/link-metadata-validation';
import { ExtractLinkMetadataService } from '@/services/link/extract-link-metadata.service';
import { LinkDeduplicatorService } from '@/services/link/link-deduplicator.service';

export const LinkProcessorService = {
  async processLink(url: string): Promise<LinkMetaData | { url: string }> {
    const validUrl = await LinkValidatorService.validateLink(url);
    const metaData: LinkMetaData =
      await ExtractLinkMetadataService.extractMetadata(validUrl);
    const normalizedUrl = LinkNormalizerService.normalizeLink(metaData.url);
    await LinkDeduplicatorService.checkDuplicate(normalizedUrl);
    return metaData;
  },
};
