import { LinkRepository } from '@/repositories/link.repository';
import { DuplicateResourceError } from '@/utils/errors';

export const LinkDeduplicatorService = {
  async checkDuplicate(url: string): Promise<void> {
    const foundLink = await LinkRepository.getLinkByUrl(url);
    if (foundLink) {
      throw new DuplicateResourceError('Duplicate link found', { url });
    }
  },
};
