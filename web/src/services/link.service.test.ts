import { expect } from 'chai';
import { LinkStatus } from '@vtmp/common/constants';
import { differenceInSeconds } from 'date-fns';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { LinkService } from '@/services/link.service';
import assert from 'assert';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';
import { ResourceNotFoundError } from '@/utils/errors';
import { LinkRepository } from '@/repositories/link.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { useSandbox } from '@/testutils/sandbox.testutil';

describe('LinkService', () => {
  useMongoDB();
  const sandbox = useSandbox();

  const mockJobData = {
    linkId: getNewObjectId(),
    url: 'google.com',
    jobTitle: 'Software Engineer',
    companyName: 'Google',
    submittedBy: getNewObjectId(),
  };
  const mockLinkData = {
    url: 'facebook.com',
    status: LinkStatus.PENDING,
    submittedBy: getNewObjectId(),
  };

  describe('submitLink', () => {
    it('should be able to create new link with expected fields', async () => {
      const URL = 'google.com';
      const link = await LinkService.submitLink(URL);

      const timeDiff = differenceInSeconds(new Date(), link.submittedOn);

      expect(link.url).to.equal(URL);
      expect(link.status).to.equal(LinkStatus.PENDING);
      expect(timeDiff).to.lessThan(3);
    });
  });

  describe('approveLinkAndCreateJobPosting', () => {
    it('should throw error when link does not exist', async () => {
      await expect(
        LinkService.approveLinkAndCreateJobPosting(getNewMongoId(), mockJobData)
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it("should throw an error if job posting can't be created", async () => {
      sandbox.stub(JobPostingRepository, 'createJobPosting').throws();
      const newLink = await LinkRepository.createLink(mockLinkData);

      await expect(
        LinkService.approveLinkAndCreateJobPosting(newLink.id, mockJobData)
      ).eventually.rejectedWith(Error);
    });

    it("should not approve link if job posting can't be created", async () => {
      sandbox.stub(JobPostingRepository, 'createJobPosting').throws();
      const newLink = await LinkRepository.createLink(mockLinkData);

      await expect(
        LinkService.approveLinkAndCreateJobPosting(newLink.id, mockJobData)
      ).eventually.rejectedWith(Error);
      const link = await LinkRepository.getLinkById(newLink.id);
      assert(link);
      expect(link.status).to.equal(LinkStatus.PENDING);
    });

    it('should not throw error when job posting data is valid', async () => {
      const newLink = await LinkRepository.createLink(mockLinkData);

      await expect(
        LinkService.approveLinkAndCreateJobPosting(newLink.id, mockJobData)
      ).eventually.fulfilled;
    });

    it('should approve link and create job posting', async () => {
      const COMPANY_NAME = 'Google';
      const newLink = await LinkRepository.createLink(mockLinkData);

      const newJobPosting = await LinkService.approveLinkAndCreateJobPosting(
        newLink.id,
        mockJobData
      );
      assert(newJobPosting);

      const link = await LinkRepository.getLinkById(newLink.id);
      assert(link);
      expect(link.status).to.equal(LinkStatus.APPROVED);

      const jobPosting = await JobPostingRepository.getJobPostingById(
        newJobPosting.id
      );
      assert(jobPosting);

      expect(jobPosting.linkId.toString()).to.equal(link._id.toString());
      expect(jobPosting.companyName).to.equal(COMPANY_NAME);
    });
  });

  describe('rejectLink', () => {
    it('should not throw when link exists', async () => {
      const link = await LinkRepository.createLink(mockLinkData);

      await expect(LinkService.rejectLink(link.id)).eventually.fulfilled;
    });

    it('should be able to reject link by id', async () => {
      const link = await LinkRepository.createLink(mockLinkData);

      const rejectedLink = await LinkService.rejectLink(link.id);

      assert(rejectedLink);
      expect(rejectedLink.status).to.equal(LinkStatus.REJECTED);
    });

    it('should throw error when link is not found', async () => {
      await expect(
        LinkService.rejectLink(getNewMongoId())
      ).eventually.rejectedWith(ResourceNotFoundError);
    });
  });

  describe('getLinkCountByStatus', () => {
    it('should return 0 links for all statuses when no links exist', async () => {
      const linkCounts = await LinkService.getLinkCountByStatus();
      expect(linkCounts).to.deep.equal({
        [LinkStatus.PENDING]: 0,
        [LinkStatus.APPROVED]: 0,
        [LinkStatus.REJECTED]: 0,
      });
    });

    it('should return correct link counts for multiple statuses when multiple links exist', async () => {
      const googleLink = await LinkRepository.createLink(mockLinkData);

      await LinkRepository.createLink({ ...mockLinkData, url: 'nvidia.com' });
      await LinkRepository.createLink({
        ...mockLinkData,
        url: 'microsoft.com',
      });

      await LinkService.rejectLink(googleLink.id);
      const afterUpdateLinks = await LinkService.getLinkCountByStatus();
      expect(afterUpdateLinks).to.deep.equal({
        [LinkStatus.PENDING]: 2,
        [LinkStatus.APPROVED]: 0,
        [LinkStatus.REJECTED]: 1,
      });
    });
  });
});
