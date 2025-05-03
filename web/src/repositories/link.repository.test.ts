import { LinkStatus } from '@vtmp/common/constants';
import { expect } from 'chai';
import { differenceInSeconds } from 'date-fns';
import { LinkRepository } from '@/repositories/link.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import assert from 'assert';
import { getNewMongoId } from '@/testutils/mongoID.testutil';

describe('LinkRepository', () => {
  useMongoDB();

  describe('getLinkById', () => {
    it('should be able to find link by id', async () => {
      const googleLink = await LinkRepository.createLink('google.com');
      const link = await LinkRepository.getLinkById(googleLink.id);

      assert(link);
    });
  });

  describe('createLink', () => {
    it('should be able to create new link with expected fields', async () => {
      const URL = 'google.com';
      const link = await LinkRepository.createLink(URL);
      const timeDiff = differenceInSeconds(new Date(), link.submittedOn);

      expect(link.url).to.equal(URL);
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
      const googleLink = await LinkRepository.createLink('google.com');
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
      await LinkRepository.createLink('google.com');
      const linkCounts = await LinkRepository.getLinkCountByStatus();

      expect(linkCounts).to.deep.include({
        [LinkStatus.PENDING]: 1,
      });
    });

    it('should be able to get multiple links by status', async () => {
      await LinkRepository.createLink('google.com');
      await LinkRepository.createLink('nvidia.com');
      const linkCounts = await LinkRepository.getLinkCountByStatus();

      expect(linkCounts).to.deep.include({
        [LinkStatus.PENDING]: 2,
      });
    });

    it('should be able to get multiple links by multiple statuses', async () => {
      const googleLink = await LinkRepository.createLink('google.com');
      await LinkRepository.createLink('nvidia.com');
      await LinkRepository.createLink('microsoft.com');

      await LinkRepository.updateLinkStatus({
        id: googleLink.id,
        status: LinkStatus.APPROVED,
      });

      const afterUpdateLinks = await LinkRepository.getLinkCountByStatus();
      expect(afterUpdateLinks).to.deep.include({
        [LinkStatus.PENDING]: 2,
        [LinkStatus.APPROVED]: 1,
      });
    });
  });
});
