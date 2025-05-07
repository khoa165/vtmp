import { LinkStatus } from '@vtmp/common/constants';
import { expect } from 'chai';
import { differenceInSeconds } from 'date-fns';
import { LinkRepository } from '@/repositories/link.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import assert from 'assert';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { ILink } from '@/models/link.model';

describe('LinkRepository', () => {
  useMongoDB();

  let googleLink: ILink;
  beforeEach(async () => {
    googleLink = await LinkRepository.createLink('google.com');
  });
  describe('getLinkById', () => {
    it('should be able to find link by id', async () => {
      const link = await LinkRepository.getLinkById(googleLink.id);

      assert(link);
    });

    it('should throw error when the link does not exist', async () => {
      const link = await LinkRepository.getLinkById(getNewMongoId());

      assert(!link);
    });
  });

  describe('createLink', () => {
    it('should be able to create new link with expected fields', async () => {
      const timeDiff = differenceInSeconds(new Date(), googleLink.submittedOn);

      expect(googleLink.url).to.equal('google.com');
      expect(googleLink.status).to.equal(LinkStatus.PENDING);
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
      const link = await LinkRepository.updateLinkStatus({
        id: googleLink.id,
        status: LinkStatus.APPROVED,
      });

      assert(link);
      expect(link.status).to.equal(LinkStatus.APPROVED);
    });
  });

  describe('getLinksByStatus', () => {
    it('should be able to get multiple links by a status', async () => {
      await LinkRepository.createLink('nvidia.com');
      const links = await LinkRepository.getLinksByStatus(LinkStatus.PENDING);

      expect(links).to.have.lengthOf(2);
    });

    it('should return empty array when no links exist with given status', async () => {
      const links = await LinkRepository.getLinksByStatus(LinkStatus.APPROVED);
      expect(links).to.have.lengthOf(0);
    });

    it('should be able to get link by a status after update', async () => {
      await LinkRepository.updateLinkStatus({
        id: googleLink.id,
        status: LinkStatus.APPROVED,
      });

      const links = await LinkRepository.getLinksByStatus(LinkStatus.APPROVED);

      expect(links).to.have.lengthOf(1);
    });

    it('should not include link of different status', async () => {
      await LinkRepository.createLink('nvidia.com');
      await LinkRepository.createLink('microsoft.com');

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
