import { LinkStatus } from '@vtmp/common/constants';
import { expect } from 'chai';
import { differenceInSeconds } from 'date-fns';
import { LinkRepository } from '@/repositories/link.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import assert from 'assert';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';

describe('LinkRepository', () => {
  useMongoDB();
  const mockLinkData = {
    url: 'google.com',
    jobTitle: 'Software Engineer',
    companyName: 'Example Company',
    submittedBy: getNewObjectId(),
  };

  describe('getLinkById', () => {
    it('should be able to find link by id', async () => {
      const googleLink = await LinkRepository.createLink(mockLinkData);

      const link = await LinkRepository.getLinkById(googleLink.id);

      assert(link);
    });
  });

  describe('createLink', () => {
    it('should be able to create new link with expected fields', async () => {
      const link = await LinkRepository.createLink(mockLinkData);

      const timeDiff = differenceInSeconds(new Date(), link.submittedOn);

      expect(link).to.deep.include(mockLinkData);
      expect(link.status).to.equal(LinkStatus.PENDING);
      expect(timeDiff).to.lessThan(3);
    });
  });

  describe('updateStatus', () => {
    it('should throw error when link does not exist', async () => {
      const link = await LinkRepository.updateLinkStatus({
        id: getNewMongoId(),
        status: LinkStatus.APPROVED,
      });
      assert(!link);
    });

    it('should be able to update link status', async () => {
      const googleLink = await LinkRepository.createLink(mockLinkData);

      const link = await LinkRepository.updateLinkStatus({
        id: googleLink.id,
        status: LinkStatus.APPROVED,
      });

      assert(link);
      expect(link.status).to.equal(LinkStatus.APPROVED);
    });
  });

  describe('getLinkCountByStatus', () => {
    it('should return empty array when no links exist', async () => {
      const linkCounts = await LinkRepository.getLinkCountByStatus();
      expect(linkCounts).to.deep.equal({});
    });

    it('should be able to get one link by status', async () => {
      await LinkRepository.createLink(mockLinkData);
      const linkCounts = await LinkRepository.getLinkCountByStatus();

      expect(linkCounts).to.deep.equal({
        [LinkStatus.PENDING]: 1,
      });
    });

    it('should be able to get multiple links by status', async () => {
      await LinkRepository.createLink(mockLinkData);
      await LinkRepository.createLink(mockLinkData);
      const linkCounts = await LinkRepository.getLinkCountByStatus();

      expect(linkCounts).to.deep.equal({
        [LinkStatus.PENDING]: 2,
      });
    });

    it('should be able to get multiple links by multiple statuses', async () => {
      const googleLink = await LinkRepository.createLink(mockLinkData);

      await LinkRepository.createLink({ ...mockLinkData, url: 'nvidia.com' });
      await LinkRepository.createLink({
        ...mockLinkData,
        url: 'microsoft.com',
      });

      await LinkRepository.updateLinkStatus({
        id: googleLink.id,
        status: LinkStatus.APPROVED,
      });

      const afterUpdateLinks = await LinkRepository.getLinkCountByStatus();
      expect(afterUpdateLinks).to.deep.equal({
        [LinkStatus.PENDING]: 2,
        [LinkStatus.APPROVED]: 1,
      });
    });
  });

  describe('getLinksByStatus', () => {
    it('should be able to get multiple links by a status', async () => {
      await LinkRepository.createLink(mockLinkData);
      await LinkRepository.createLink({ ...mockLinkData, url: 'nvidia.com' });
      const links = await LinkRepository.getLinksByStatus(LinkStatus.PENDING);

      expect(links).to.have.lengthOf(2);
    });

    it('should return empty array when no links exist with given status', async () => {
      await LinkRepository.createLink(mockLinkData);
      const links = await LinkRepository.getLinksByStatus(LinkStatus.APPROVED);
      expect(links).to.have.lengthOf(0);
    });

    it('should be able to get link by a status after update', async () => {
      const googleLink = await LinkRepository.createLink(mockLinkData);

      await LinkRepository.updateLinkStatus({
        id: googleLink.id,
        status: LinkStatus.APPROVED,
      });
      const links = await LinkRepository.getLinksByStatus(LinkStatus.APPROVED);

      expect(links).to.have.lengthOf(1);
    });

    it('should not include link of different status', async () => {
      const googleLink = await LinkRepository.createLink(mockLinkData);

      await LinkRepository.createLink({ ...mockLinkData, url: 'nvidia.com' });
      await LinkRepository.createLink({
        ...mockLinkData,
        url: 'microsoft.com',
      });

      const beforeUpdateLinks = await LinkRepository.getLinksByStatus(
        LinkStatus.PENDING
      );
      expect(beforeUpdateLinks).to.have.lengthOf(3);
      await LinkRepository.updateLinkStatus({
        id: googleLink.id,
        status: LinkStatus.APPROVED,
      });
      const afterUpdateLinks = await LinkRepository.getLinksByStatus(
        LinkStatus.PENDING
      );
      expect(afterUpdateLinks).to.have.lengthOf(2);
    });
  });
});
