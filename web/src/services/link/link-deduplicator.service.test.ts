import { expect } from 'chai';

import { ILink } from '@/models/link.model';
import { LinkRepository } from '@/repositories/link.repository';
import { LinkDeduplicatorService } from '@/services/link/link-deduplicator.service';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { DuplicateResourceError } from '@/utils/errors';

describe('LinkDeduplicatorService', () => {
  useMongoDB();

  describe('checkDuplicate', () => {
    it('should throw error when link already exists', async () => {
      const mockLinkData = {
        originalUrl: 'https://google.com',
        jobTitle: 'Software Engineer',
        companyName: 'Example Company',
      };
      const googleLink: ILink = await LinkRepository.createLink(mockLinkData);
      const newLink = {
        originalUrl: googleLink.originalUrl,
        jobTitle: 'Software Engineer',
        companyName: 'Example Company',
      };

      await expect(
        LinkDeduplicatorService.checkDuplicate(newLink.originalUrl)
      ).to.be.rejectedWith(DuplicateResourceError);
    });

    it('should not throw error when link does not exist', async () => {
      await expect(
        LinkDeduplicatorService.checkDuplicate('nonexistent.com')
      ).to.not.be.rejectedWith(DuplicateResourceError);
    });
  });
});
