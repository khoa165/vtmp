import { LinkNormalizerService } from '@/services/link/link-normalizer.service';
import { LinkValidatorService } from '@/services/link/link-validator.service';
import { JobPostingMetaData } from './validations';
import { ExtractMetadataService } from '@/services/link/link-metadata-extraction.service';
import { LinkDeduplicatorService } from '@/services/link/link-deduplicator.service';
import { LinkService } from '@/services/link.service';

export class LinkProcessorService {
  static async processLink(rawUrl: string): Promise<void> {
    const validUrl = await LinkValidatorService.validateLink(rawUrl);
    const metaData: JobPostingMetaData =
      await ExtractMetadataService.extractMetadata(validUrl);
    const normalizedUrl = await LinkNormalizerService.normalizeProcess(
      metaData.url
    );
    await LinkDeduplicatorService.checkDuplicate(normalizedUrl);
    LinkService.submitLink(rawUrl);
  }
}
