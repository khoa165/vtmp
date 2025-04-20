import * as chai from 'chai';
import chaiSubset from 'chai-subset';
import { LinkStatus } from '@vtmp/common/constants';
import { differenceInSeconds } from 'date-fns';
import LinkRepository from '@/repositories/link.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import assert from 'assert';

chai.use(chaiSubset);
const { expect } = chai;

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

  describe('getLinksByStatus', () => {
    it('should be able to get one link by status', async () => {
      await LinkRepository.createLink('google.com');
      const links = await LinkRepository.getLinksByStatus(LinkStatus.PENDING);

      expect(links).to.have.lengthOf(1);
    });

    it('should be able to get multiple links by status', async () => {
      await LinkRepository.createLink('google.com');
      await LinkRepository.createLink('nvidia.com');
      const links = await LinkRepository.getLinksByStatus(LinkStatus.PENDING);

      expect(links).to.have.lengthOf(2);
    });

    it('should not include link of different status', async () => {
      const googleLink = await LinkRepository.createLink('google.com');
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
