import { expect } from 'chai';
import { differenceInSeconds } from 'date-fns';

import assert from 'assert';

import {
  JobType,
  LinkStatus,
  JobFunction,
  LinkRegion,
  LinkProcessingFailureStage,
} from '@vtmp/common/constants';

import { ILink } from '@/models/link.model';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { LinkRepository } from '@/repositories/link.repository';
import { LinkService } from '@/services/link.service';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';
import {
  DuplicateResourceError,
  InternalServerError,
  LinkProcessingBadRequest,
  ResourceNotFoundError,
} from '@/utils/errors';

describe('LinkService', () => {
  useMongoDB();
  const sandbox = useSandbox();

  const mockLinkData = {
    originalUrl: 'https://google.com',
    jobTitle: 'Software Engineer',
    companyName: 'Example Company',
    submittedBy: getNewObjectId(),
  };

  const mockMultipleLinks = [
    {
      originalUrl: 'https://nvida.com',
      jobTitle: 'Software Engineer',
      companyName: 'Example Company',
      submittedBy: getNewObjectId(),
    },

    {
      originalUrl: 'https://microsoft',
      jobTitle: 'Software Engineer',
      companyName: 'Example Company',
      submittedBy: getNewObjectId(),
    },
  ];

  let googleLink: ILink;
  beforeEach(async () => {
    googleLink = await LinkRepository.createLink(mockLinkData);
  });

  describe('submitLink', () => {
    it('should throw error when link with same url already exists', async () => {
      await expect(
        LinkService.submitLink(mockLinkData)
      ).eventually.rejectedWith(DuplicateResourceError);
    });

    it('should throw an error if invalid enum value is passed', async () => {
      const invalidEnumData = {
        ...mockLinkData,
        jobFunction: 'NOT_A_REAL_FUNCTION',
      };

      await expect(
        LinkService.submitLink(invalidEnumData)
      ).eventually.rejectedWith(Error);
    });

    it('should throw error if repository throws unexpected error', async () => {
      sandbox
        .stub(LinkRepository, 'createLink')
        .rejects(new InternalServerError('Unexpected DB failure', {}));

      await expect(
        LinkService.submitLink(mockLinkData)
      ).eventually.rejectedWith('Unexpected DB failure');
    });

    it('should be able to create new link with expected fields', async () => {
      const timeDiff = differenceInSeconds(new Date(), googleLink.submittedOn);

      expect(googleLink.originalUrl).to.equal(mockLinkData.originalUrl);
      expect(googleLink.url).to.equal(mockLinkData.originalUrl);
      expect(googleLink.status).to.equal(LinkStatus.PENDING_PROCESSING);
      expect(timeDiff).to.lessThan(3);
    });
  });

  describe('approveLinkAndCreateJobPosting', () => {
    it('should throw error when link does not exist', async () => {
      await expect(
        LinkService.approveLinkAndCreateJobPosting(getNewMongoId(), {
          jobTitle: 'Software Engineering Intern',
          companyName: 'Google',
        })
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it("should throw an error if job posting can't be created", async () => {
      sandbox.stub(JobPostingRepository, 'createJobPosting').throws();

      await expect(
        LinkService.approveLinkAndCreateJobPosting(googleLink.id, {
          jobTitle: 'Software Engineering Intern',
          companyName: 'Google',
        })
      ).eventually.rejectedWith(Error);
    });

    it("should not approve link if job posting can't be created", async () => {
      sandbox.stub(JobPostingRepository, 'createJobPosting').throws();

      await expect(
        LinkService.approveLinkAndCreateJobPosting(googleLink.id, {
          jobTitle: 'Software Engineering Intern',
          companyName: 'Google',
        })
      ).eventually.rejectedWith(Error);
      const link = await LinkRepository.getLinkById(googleLink.id);
      assert(link);
      expect(link.status).to.equal(LinkStatus.PENDING_PROCESSING);
    });

    it('should not throw error when job posting data is valid', async () => {
      await expect(
        LinkService.approveLinkAndCreateJobPosting(googleLink.id, {
          jobTitle: 'Software Engineering Intern',
          companyName: 'Google',
        })
      ).eventually.fulfilled;
    });

    it('should approve link and create job posting', async () => {
      const COMPANY_NAME = 'Google';

      const newJobPosting = await LinkService.approveLinkAndCreateJobPosting(
        googleLink.id,
        {
          jobTitle: 'Software Engineering Intern',
          companyName: COMPANY_NAME,
        }
      );
      assert(newJobPosting);

      const link = await LinkRepository.getLinkById(googleLink.id);
      assert(link);
      expect(link.status).to.equal(LinkStatus.ADMIN_APPROVED);

      const jobPosting = await JobPostingRepository.getJobPostingById(
        newJobPosting.id
      );
      assert(jobPosting);

      expect(jobPosting.linkId.toString()).to.equal(link._id.toString());
      expect(jobPosting.companyName).to.equal(COMPANY_NAME);
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

    it('should throw error when link does not exist', async () => {
      await expect(
        LinkService.updateLinkMetaData(getNewMongoId(), mockLinkMetaData)
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should throw error when failure stage included without status failed', async () => {
      await expect(
        LinkService.updateLinkMetaData(googleLink.id, {
          ...mockLinkMetaData,
          failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
        })
      ).eventually.rejectedWith(LinkProcessingBadRequest);
    });

    it('should throw error when status failed included with failureStage is null', async () => {
      await expect(
        LinkService.updateLinkMetaData(googleLink.id, {
          ...mockLinkMetaData,
          status: LinkStatus.PIPELINE_FAILED,
          failureStage: null, // Adding failureStage to satisfy type requirement
        })
      ).eventually.rejectedWith(LinkProcessingBadRequest);
    });

    it('should throw when attemptsCount is 0 for failed status', async () => {
      await expect(
        LinkService.updateLinkMetaData(googleLink.id, {
          ...mockLinkMetaData,
          status: LinkStatus.PENDING_RETRY,
          failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
          attemptsCount: 0,
        })
      ).eventually.rejectedWith(LinkProcessingBadRequest);
    });

    it('should throw when status is set to PENDING_PROCESSING', async () => {
      await expect(
        LinkService.updateLinkMetaData(googleLink.id, {
          ...mockLinkMetaData,
          status: LinkStatus.PENDING_PROCESSING,
        })
      ).eventually.rejectedWith(LinkProcessingBadRequest);
    });

    it('should throw when status is set to PENDING_PROCESSING', async () => {
      await expect(
        LinkService.updateLinkMetaData(googleLink.id, {
          ...mockLinkMetaData,
          status: LinkStatus.PENDING_PROCESSING,
        })
      ).eventually.rejectedWith(LinkProcessingBadRequest);
    });

    it('should be able to update link metadata with status not failed', async () => {
      await expect(
        LinkService.updateLinkMetaData(googleLink.id, mockLinkMetaData)
      ).eventually.fulfilled;
    });

    it('should be able to update link metadata with status failed', async () => {
      await expect(
        LinkService.updateLinkMetaData(googleLink.id, {
          ...mockLinkMetaData,
          status: LinkStatus.PIPELINE_REJECTED,
          failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
        })
      ).eventually.fulfilled;
    });
  });

  describe('rejectLink', () => {
    it('should not throw when link exists', async () => {
      await expect(LinkService.rejectLink(googleLink.id)).eventually.fulfilled;
    });

    it('should be able to reject link by id', async () => {
      const rejectedLink = await LinkService.rejectLink(googleLink.id);

      assert(rejectedLink);
      expect(rejectedLink.status).to.equal(LinkStatus.ADMIN_REJECTED);
    });

    it('should throw error when link is not found', async () => {
      await expect(
        LinkService.rejectLink(getNewMongoId())
      ).eventually.rejectedWith(ResourceNotFoundError);
    });
  });

  describe('getLinkCountByStatus', () => {
    beforeEach(async () => {
      await Promise.all(
        mockMultipleLinks.map((link) => LinkRepository.createLink(link))
      );
    });

    it('should be able to get links by pending status without given status', async () => {
      const linkCounts = await LinkService.getLinkCountByStatus();

      expect(linkCounts).to.deep.equal({
        [LinkStatus.PENDING_PROCESSING]: 3,
        [LinkStatus.ADMIN_APPROVED]: 0,
        [LinkStatus.ADMIN_REJECTED]: 0,
        [LinkStatus.PENDING_ADMIN_REVIEW]: 0,
        [LinkStatus.PENDING_RETRY]: 0,
        [LinkStatus.PIPELINE_FAILED]: 0,
        [LinkStatus.PIPELINE_REJECTED]: 0,
      });
    });

    it('should be able to get multiple links by multiple statuses', async () => {
      await LinkRepository.updateLinkStatus({
        id: googleLink.id,
        status: LinkStatus.ADMIN_APPROVED,
      });

      const afterUpdateLinks = await LinkService.getLinkCountByStatus();
      expect(afterUpdateLinks).to.deep.equal({
        [LinkStatus.PENDING_PROCESSING]: 2,
        [LinkStatus.ADMIN_APPROVED]: 1,
        [LinkStatus.ADMIN_REJECTED]: 0,
        [LinkStatus.PENDING_ADMIN_REVIEW]: 0,
        [LinkStatus.PENDING_RETRY]: 0,
        [LinkStatus.PIPELINE_FAILED]: 0,
        [LinkStatus.PIPELINE_REJECTED]: 0,
      });
    });
  });

  describe('getLinks', () => {
    beforeEach(async () => {
      await Promise.all(
        mockMultipleLinks.map((link) => LinkRepository.createLink(link))
      );
    });
    describe('when no filter is provided', () => {
      it('should be able to get all links without status filter', async () => {
        await LinkRepository.updateLinkStatus({
          id: googleLink.id,
          status: LinkStatus.ADMIN_APPROVED,
        });
        const links = await LinkService.getLinks();

        expect(links).to.be.an('array').that.have.lengthOf(3);
        expect(links.map((link) => link.status)).to.deep.equal([
          LinkStatus.ADMIN_APPROVED,
          LinkStatus.PENDING_PROCESSING,
          LinkStatus.PENDING_PROCESSING,
        ]);
      });
    });

    describe('when filter is provided', () => {
      it('should return empty array when no links exist with given status', async () => {
        const links = await LinkService.getLinks({
          status: LinkStatus.ADMIN_APPROVED,
        });
        expect(links).to.be.an('array').that.have.lengthOf(0);
      });

      it('should be able to get multiple links by a status', async () => {
        const links = await LinkService.getLinks({
          status: LinkStatus.PENDING_PROCESSING,
        });

        expect(links).to.be.an('array').that.have.lengthOf(3);
        expect(links.map((link) => link.status)).to.deep.equal([
          LinkStatus.PENDING_PROCESSING,
          LinkStatus.PENDING_PROCESSING,
          LinkStatus.PENDING_PROCESSING,
        ]);
      });

      it('should be able to get link by given status after update', async () => {
        await LinkRepository.updateLinkStatus({
          id: googleLink.id,
          status: LinkStatus.ADMIN_APPROVED,
        });
        const links = await LinkService.getLinks({
          status: LinkStatus.ADMIN_APPROVED,
        });

        expect(links).to.be.an('array').that.have.lengthOf(1);
        expect(links.map((link) => link.status)).to.deep.equal([
          LinkStatus.ADMIN_APPROVED,
        ]);
      });

      it('should not include link of different status', async () => {
        const beforeUpdateLinks = await LinkService.getLinks({
          status: LinkStatus.PENDING_PROCESSING,
        });

        expect(beforeUpdateLinks).to.be.an('array').that.have.lengthOf(3);

        await LinkRepository.updateLinkStatus({
          id: googleLink.id,
          status: LinkStatus.ADMIN_APPROVED,
        });
        const afterUpdateLinks = await LinkService.getLinks({
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
});
