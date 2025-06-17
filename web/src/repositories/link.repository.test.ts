import {
  JobFunction,
  JobType,
  LinkRegion,
  LinkStatus,
  LinkProcessingSubStatus,
} from '@vtmp/common/constants';
import { expect } from 'chai';
import { differenceInSeconds } from 'date-fns';
import { LinkRepository } from '@/repositories/link.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import assert from 'assert';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';
import { ILink } from '@/models/link.model';

describe('LinkRepository', () => {
  useMongoDB();
  const mockLinkData = {
    url: 'google.com',
    jobTitle: 'Software Engineer',
    companyName: 'Example Company',
    submittedBy: getNewObjectId(),
  };

  let googleLink: ILink;
  beforeEach(async () => {
    googleLink = await LinkRepository.createLink(mockLinkData);
  });

  describe('getLinkById', () => {
    it('should be able to find link by id', async () => {
      const link = await LinkRepository.getLinkById(googleLink.id);

      assert(link);
    });
  });

  describe('createLink', () => {
    it('should be able to create new link with expected fields', async () => {
      const timeDiff = differenceInSeconds(new Date(), googleLink.submittedOn);

      expect(googleLink).to.deep.include(mockLinkData);
      expect(googleLink.status).to.equal(LinkStatus.PENDING);
      expect(timeDiff).to.lessThan(3);
    });
  });

  describe('updateLinkStatus', () => {
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

  describe('updateLinkMetaData', () => {
    const mockLinkMetaData = {
      url: 'google.com',
      status: LinkStatus.PENDING,
      location: LinkRegion.US,
      jobFunction: JobFunction.SOFTWARE_ENGINEER,
      jobType: JobType.INTERNSHIP,
      datePosted: new Date(),
      attemptsCount: 1,
      lastProcessedAt: new Date(),
    };

    it('should throw error when link does not exist', async () => {
      const link = await LinkRepository.updateLinkMetaData(
        getNewMongoId(),
        mockLinkMetaData
      );
      assert(!link);
    });

    it('should be able to update link metadata with status not failed', async () => {
      const link = await LinkRepository.updateLinkMetaData(
        googleLink.id,
        mockLinkMetaData
      );

      assert(link);
      expect(link).to.deep.include(mockLinkMetaData);
    });

    it('should be able to update link metadata with status failed', async () => {
      const link = await LinkRepository.updateLinkMetaData(googleLink.id, {
        subStatus: LinkProcessingSubStatus.SCRAPING_FAILED,
        ...mockLinkMetaData,
        status: LinkStatus.FAILED,
      });

      assert(link);
      expect(link).to.deep.include({
        subStatus: LinkProcessingSubStatus.SCRAPING_FAILED,
        ...mockLinkMetaData,
        status: LinkStatus.FAILED,
      });
    });
  });

  describe('getLinkCountByStatus', () => {
    beforeEach(async () => {
      const mockMultipleLinks = [
        {
          url: 'nvida.com',
          jobTitle: 'Software Engineer',
          companyName: 'Example Company',
          submittedBy: getNewObjectId(),
        },

        {
          url: 'microsoft.com',
          jobTitle: 'Software Engineer',
          companyName: 'Example Company',
          submittedBy: getNewObjectId(),
        },
      ];

      await Promise.all(
        mockMultipleLinks.map((link) => LinkRepository.createLink(link))
      );
    });

    it('should be able to get links by pending status without given status', async () => {
      await expect(LinkRepository.getLinkCountByStatus()).eventually.fulfilled;
    });

    it('should be able to get multiple links by multiple statuses', async () => {
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

  describe('getLinks', () => {
    beforeEach(async () => {
      const mockMultipleLinks = [
        {
          url: 'nvida.com',
          jobTitle: 'Software Engineer',
          companyName: 'Example Company',
          submittedBy: getNewObjectId(),
        },

        {
          url: 'microsoft.com',
          jobTitle: 'Software Engineer',
          companyName: 'Example Company',
          submittedBy: getNewObjectId(),
        },
      ];

      await Promise.all(
        mockMultipleLinks.map((link) => LinkRepository.createLink(link))
      );
    });
    describe('when no filter is provided', () => {
      it('should be able to get all links without status filter', async () => {
        await LinkRepository.updateLinkStatus({
          id: googleLink.id,
          status: LinkStatus.APPROVED,
        });
        const links = await LinkRepository.getLinks();

        expect(links).to.be.an('array').that.have.lengthOf(3);
        expect(links.map((link) => link.status)).to.deep.equal([
          LinkStatus.APPROVED,
          LinkStatus.PENDING,
          LinkStatus.PENDING,
        ]);
      });
    });

    describe('when filter is provided', () => {
      it('should return empty array when no links exist with given status', async () => {
        const links = await LinkRepository.getLinks({
          status: LinkStatus.APPROVED,
        });
        expect(links).to.have.lengthOf(0);
      });

      it('should be able to get multiple links by a status', async () => {
        const links = await LinkRepository.getLinks({
          status: LinkStatus.PENDING,
        });

        expect(links).to.be.an('array').that.have.lengthOf(3);
        expect(links.map((link) => link.status)).to.deep.equal([
          LinkStatus.PENDING,
          LinkStatus.PENDING,
          LinkStatus.PENDING,
        ]);
      });

      it('should be able to get link by given status after update', async () => {
        await LinkRepository.updateLinkStatus({
          id: googleLink.id,
          status: LinkStatus.APPROVED,
        });
        const links = await LinkRepository.getLinks({
          status: LinkStatus.APPROVED,
        });

        expect(links).to.be.an('array').that.have.lengthOf(1);
        expect(links.map((link) => link.status)).to.deep.equal([
          LinkStatus.APPROVED,
        ]);
      });

      it('should not include link of different status', async () => {
        const beforeUpdateLinks = await LinkRepository.getLinks({
          status: LinkStatus.PENDING,
        });

        expect(beforeUpdateLinks).to.be.an('array').that.have.lengthOf(3);

        await LinkRepository.updateLinkStatus({
          id: googleLink.id,
          status: LinkStatus.APPROVED,
        });
        const afterUpdateLinks = await LinkRepository.getLinks({
          status: LinkStatus.PENDING,
        });

        expect(afterUpdateLinks).to.be.an('array').that.have.lengthOf(2);
        expect(afterUpdateLinks.map((link) => link.status)).to.deep.equal([
          LinkStatus.PENDING,
          LinkStatus.PENDING,
        ]);
      });
    });
  });

  describe('getLinkByUrl', () => {
    it('should be able to get link by url', async () => {
      const link = await LinkRepository.getLinkByUrl(googleLink.url);

      assert(link);
      expect(link).to.deep.include(mockLinkData);
    });

    it('should return null when no link exists with given url', async () => {
      const link = await LinkRepository.getLinkByUrl('nonexistent.com');

      assert(!link);
    });
  });
});
