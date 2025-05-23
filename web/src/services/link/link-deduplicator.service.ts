import { JobPostingMetaData } from '@/services/link/validations';
import { LinkDeduplicatorRepo } from '@/repositories/link/link-deduplicator.repository';
export class LinkDeduplicatorService {
  static async checkDuplicate(metadata: JobPostingMetaData): Promise<void> {
    const foundLink = await LinkDeduplicatorRepo.findLinkByUrl(metadata.url);
    if (foundLink) {
      throw new Error('Duplicate link found');
    }
  }
}
