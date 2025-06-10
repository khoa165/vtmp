import { LinkNormalizerService } from '@/services/link/link-normalizer.service';
import { LinkValidatorService } from '@/services/link/link-validator.service';
import { LinkMetaData } from '@/services/link/link-metadata-validation';
import { ExtractLinkMetadataService } from '@/services/link/extract-link-metadata.service';
import { LinkDeduplicatorService } from '@/services/link/link-deduplicator.service';

export const LinkProcessorService = {
  async processLink(url: string): Promise<LinkMetaData> {
    const validUrl = await LinkValidatorService.validateLink(url);
    const normalizedUrl = LinkNormalizerService.normalizeLink(validUrl);
    await LinkDeduplicatorService.checkDuplicate(normalizedUrl);
    const metaData: LinkMetaData =
      await ExtractLinkMetadataService.extractMetadata(normalizedUrl);

    return metaData;
  },
};
