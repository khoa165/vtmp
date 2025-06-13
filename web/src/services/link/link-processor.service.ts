import { LinkNormalizerService } from '@/services/link/link-normalizer.service';
import { LinkValidatorService } from '@/services/link/link-validator.service';
import { ExtractLinkMetadataService } from '@/services/link/extract-link-metadata.service';
import { LinkDeduplicatorService } from '@/services/link/link-deduplicator.service';
import { LinkService } from '@/services/link.service';

export const LinkProcessorService = {
  async processLink(url: string): Promise<void> {
    const validUrl = await LinkValidatorService.validateLink(url);
    const metaData = await ExtractLinkMetadataService.extractMetadata(validUrl);
    const normalizedUrl = await LinkNormalizerService.normalizeLink(
      metaData.url
    );
    await LinkDeduplicatorService.checkDuplicate(normalizedUrl);
    await LinkService.submitLink(metaData);
  },
};
