import { expect } from 'chai';
import {
  // JobType,
  LinkStatus,
  // JobFunction,
  // LinkRegion,
  // LinkProcessingFailureStage,
} from '@vtmp/common/constants';
import { differenceInSeconds } from 'date-fns';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { LinkService } from '@/services/link.service';
import assert from 'assert';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';
import { DuplicateResourceError, ResourceNotFoundError } from '@/utils/errors';
import { LinkRepository } from '@/repositories/link.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { ILink } from '@/models/link.model';
describe('LinkService', () => {
  useMongoDB();
  const sandbox = useSandbox();

  const mockLinkData = {
    url: 'google.com',
    jobTitle: 'Software Engineer',
    companyName: 'Example Company',
    submittedBy: getNewObjectId(),
  };

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

  let googleLink: ILink;
  beforeEach(async () => {
    googleLink = await LinkRepository.createLink(mockLinkData);
  });

  describe('submitLink', () => {
    it('should be able to create new link with expected fields', async () => {
      const timeDiff = differenceInSeconds(new Date(), googleLink.submittedOn);

      expect(googleLink.url).to.equal(mockLinkData.url);
      expect(googleLink.status).to.equal(LinkStatus.PENDING_PROCESSING);
      expect(timeDiff).to.lessThan(3);
    });

    it('should throw error when link with same url already exists', async () => {
      await expect(
        LinkService.submitLink(mockLinkData)
      ).eventually.rejectedWith(DuplicateResourceError);
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

  // describe('updateLinkMetaData', () => {
  //   const mockLinkMetaData = {
  //     url: 'google.com',
  //     status: LinkStatus.PENDING,
  //     location: LinkRegion.US,
  //     jobFunction: JobFunction.SOFTWARE_ENGINEER,
  //     jobType: JobType.INTERNSHIP,
  //     datePosted: new Date(),
  //     attemptsCount: 1,
  //     lastProcessedAt: new Date(),
  //   };

  //   it('should throw error when link does not exist', async () => {
  //     await expect(
  //       LinkService.updateLinkMetaData(getNewMongoId(), mockLinkMetaData)
  //     ).eventually.rejectedWith(ResourceNotFoundError);
  //   });

  //   it('should throw error when substatus included without status failed', async () => {
  //     await expect(
  //       LinkService.updateLinkMetaData(googleLink.id, {
  //         ...mockLinkMetaData,
  //         subStatus: LinkProcessingFailureStage.SCRAPING_FAILED,
  //       })
  //     ).eventually.rejectedWith(Error);
  //   });

  //   it('should throw error when status failed included without substatus', async () => {
  //     await expect(
  //       LinkService.updateLinkMetaData(googleLink.id, {
  //         ...mockLinkMetaData,
  //         status: LinkStatus.FAILED,
  //       })
  //     ).eventually.rejectedWith(Error);
  //   });

  //   it('should be able to update link metadata with status not failed', async () => {
  //     await expect(
  //       LinkService.updateLinkMetaData(googleLink.id, mockLinkMetaData)
  //     ).eventually.fulfilled;
  //   });

  //   it('should be able to update link metadata with status failed', async () => {
  //     await expect(
  //       LinkService.updateLinkMetaData(googleLink.id, {
  //         subStatus: LinkProcessingSubStatus.SCRAPING_FAILED,
  //         ...mockLinkMetaData,
  //         status: LinkStatus.FAILED,
  //       })
  //     ).eventually.fulfilled;
  //   });
  // });

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
