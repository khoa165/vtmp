import { expect } from 'chai';
import { differenceInSeconds } from 'date-fns';

import assert from 'assert';

import {
  JobFunction,
  JobType,
  LinkRegion,
  LinkStatus,
  LinkProcessingFailureStage,
} from '@vtmp/common/constants';

import { ILink } from '@/models/link.model';
// eslint-disable-next-line boundaries/element-types
import { LinkRepository } from '@/repositories/link.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';

describe('LinkRepository', () => {
  useMongoDB();

  const submittedBy = getNewObjectId();
  const mockLinkData = {
    originalUrl: 'https://google.com',
    jobTitle: 'Software Engineer',
    companyName: 'Example Company',
    submittedBy,
  };

  let googleLink: ILink;
  beforeEach(async () => {
    googleLink = await LinkRepository.createLink(
      submittedBy.toHexString(),
      mockLinkData
    );
  });

  describe('getLinkById', () => {
    it('should be able to find link by id', async () => {
      const link = await LinkRepository.getLinkById(googleLink.id);

      assert(link);
    });
    it('should return null if no link is found for the given id', async () => {
      const link = await LinkRepository.getLinkById(getNewMongoId());

      assert(!link);
    });
  });

  describe('createLink', () => {
    it('should be able to create a new link with expected fields', async () => {
      const timeDiff = differenceInSeconds(new Date(), googleLink.submittedOn);

      expect(googleLink.originalUrl).equal(mockLinkData.originalUrl);
      expect(googleLink.status).to.equal(LinkStatus.PENDING_PROCESSING);
      expect(timeDiff).to.be.lessThan(3);
    });
  });

  describe('updateLinkMetaData', () => {
    const mockLinkMetaData = {
      url: 'https://google.com',
      status: LinkStatus.PENDING_ADMIN_REVIEW,
      failureStage: null,
      location: LinkRegion.US,
      jobFunction: JobFunction.SOFTWARE_ENGINEER,
      jobType: JobType.INTERNSHIP,
      datePosted: new Date(),
      attemptsCount: 1,
      lastProcessedAt: new Date(),
    };

    it('should return null when link does not exist', async () => {
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

    it('should be able to update link metadata with failed status', async () => {
      const link = await LinkRepository.updateLinkMetaData(googleLink.id, {
        ...mockLinkMetaData,
        status: LinkStatus.PENDING_RETRY,
        failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
      });

      assert(link);
      expect(link).to.deep.include({
        ...mockLinkMetaData,
        status: LinkStatus.PENDING_RETRY,
        failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
      });
    });
  });

  describe('getLinkCountByStatus', () => {
    beforeEach(async () => {
      const mockMultipleLinks = [
        {
          originalUrl: 'https://nvida.com',
          jobTitle: 'Software Engineer',
          companyName: 'Example Company',
          submittedBy: getNewObjectId(),
        },

        {
          originalUrl: 'https://microsoft.com',
          jobTitle: 'Software Engineer',
          companyName: 'Example Company',
          submittedBy: getNewObjectId(),
        },
      ];
      await Promise.all(
        mockMultipleLinks.map((link) =>
          LinkRepository.createLink(getNewMongoId(), link)
        )
      );
    });

    it('should return correct count for PENDING_PROCESSING by default', async () => {
      const counts = await LinkRepository.getLinkCountByStatus();

      expect(counts).to.deep.equal({
        [LinkStatus.PENDING_PROCESSING]: 3,
      });
    });

    it('should be able to get multiple links by multiple statuses', async () => {
      await LinkRepository.updateLinkMetaData(googleLink.id, {
        status: LinkStatus.ADMIN_APPROVED,
        failureStage: null,
      });

      const afterUpdateLinks = await LinkRepository.getLinkCountByStatus();
      expect(afterUpdateLinks).to.deep.equal({
        [LinkStatus.PENDING_PROCESSING]: 2,
        [LinkStatus.ADMIN_APPROVED]: 1,
      });
    });
  });

  describe('getLinks', () => {
    const mockMultipleLinks = [
      {
        originalUrl: 'https://nvida.com',
        jobTitle: 'Software Engineer',
        companyName: 'Example Company',
        submittedBy: getNewObjectId(),
      },

      {
        originalUrl: 'https://microsoft.com',
        jobTitle: 'Software Engineer',
        companyName: 'Example Company',
        submittedBy: getNewObjectId(),
      },
    ];
    beforeEach(async () => {
      await Promise.all(
        mockMultipleLinks.map((link) =>
          LinkRepository.createLink(getNewMongoId(), link)
        )
      );
    });
    describe('when no filter is provided', () => {
      it('should be able to get all links without status filter', async () => {
        await LinkRepository.updateLinkMetaData(googleLink.id, {
          status: LinkStatus.ADMIN_APPROVED,
          failureStage: null,
        });
        const links = await LinkRepository.getLinks();

        expect(links).to.be.an('array').that.have.lengthOf(3);
        expect(links.map((link) => link.status)).to.have.members([
          LinkStatus.PENDING_PROCESSING,
          LinkStatus.PENDING_PROCESSING,
          LinkStatus.ADMIN_APPROVED,
        ]);
      });
    });

    describe('when filter is provided', () => {
      it('should return empty array when no links exist with given status', async () => {
        const links = await LinkRepository.getLinks({
          status: LinkStatus.ADMIN_APPROVED,
        });
        expect(links).to.have.lengthOf(0);
      });

      it('should be able to get multiple links by a status', async () => {
        const links = await LinkRepository.getLinks({
          status: LinkStatus.PENDING_PROCESSING,
        });

        expect(links).to.be.an('array').that.have.lengthOf(3);
        expect(links.map((link) => link.status)).to.have.members([
          LinkStatus.PENDING_PROCESSING,
          LinkStatus.PENDING_PROCESSING,
          LinkStatus.PENDING_PROCESSING,
        ]);
      });

      it('should be able to get link by given status after update', async () => {
        await LinkRepository.updateLinkMetaData(googleLink.id, {
          status: LinkStatus.ADMIN_APPROVED,
          failureStage: null,
        });
        const links = await LinkRepository.getLinks({
          status: LinkStatus.ADMIN_APPROVED,
        });

        expect(links).to.be.an('array').that.have.lengthOf(1);
        expect(links.map((link) => link.status)).to.have.members([
          LinkStatus.ADMIN_APPROVED,
        ]);
      });

      it('should not include link of different status', async () => {
        const beforeUpdateLinks = await LinkRepository.getLinks({
          status: LinkStatus.PENDING_PROCESSING,
        });

        expect(beforeUpdateLinks).to.be.an('array').that.have.lengthOf(3);

        await LinkRepository.updateLinkMetaData(googleLink.id, {
          status: LinkStatus.ADMIN_APPROVED,
          failureStage: null,
        });
        const afterUpdateLinks = await LinkRepository.getLinks({
          status: LinkStatus.PENDING_PROCESSING,
        });

        expect(afterUpdateLinks).to.be.an('array').that.have.lengthOf(2);
        expect(afterUpdateLinks.map((link) => link.status)).to.deep.equal([
          LinkStatus.PENDING_PROCESSING,
          LinkStatus.PENDING_PROCESSING,
        ]);
      });
    });
  });

  describe('getLinkByUrl', () => {
    it('should be able to get link by url', async () => {
      const link = await LinkRepository.getLinkByUrl(googleLink.originalUrl);

      assert(link);
      expect(link).to.deep.include(mockLinkData);
    });

    it('should return null when no link exists with given url', async () => {
      const link = await LinkRepository.getLinkByUrl('nonexistent.com');

      assert(!link);
    });
  });
});
