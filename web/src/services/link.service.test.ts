import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { LinkStatus } from '@/types/enums';
import { differenceInSeconds } from 'date-fns';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { LinkService } from './link.service';
import assert from 'assert';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { ResourceNotFoundError } from '@/utils/errors';
import { LinkRepository } from '@/repositories/link.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('LinkService', () => {
  useMongoDB();

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
    it('approve link and create job posting', async () => {
      const COMPANY_NAME = 'Google';
      const newLink = await LinkService.submitLink('google.com');
      const newJobPosting = await LinkService.approveLinkAndCreateJobPosting(
        newLink.id,
        {
          jobTitle: 'Software Engineering Intern',
          companyName: COMPANY_NAME,
        }
      );
      assert(newJobPosting);

      const link = await LinkRepository.getLinkById(newLink.id);
      assert(link);
      expect(link.status).to.equal(LinkStatus.APPROVED);

      const jobPosting = await JobPostingRepository.getJobPostingById(
        newJobPosting._id.toString()
      );
      assert(jobPosting);
      expect(jobPosting.linkId.toString()).to.equal(link.id);
      expect(jobPosting.companyName).to.equal(COMPANY_NAME);
    });
  });

  describe('rejectLink', () => {
    it('should not throw when link exists', async () => {
      const link = await LinkService.submitLink('google.com');
      await expect(LinkService.rejectLink(link.id)).eventually.fulfilled;
    });

    it('should be able to reject link by id', async () => {
      const link = await LinkService.submitLink('google.com');
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

  describe('getPendingLinks', () => {
    it('should be able to get all pending links', async () => {
      const googleLink = await LinkService.submitLink('google.com');
      const nvidia = await LinkService.submitLink('nvidia.com');

      const pendingLinks = await LinkService.getPendingLinks();

      const urls = pendingLinks.map((link) => link.url);
      expect(urls).to.have.members([googleLink.url, nvidia.url]);
    });

    it('should be able to get all pending links after a link is rejected', async () => {
      const googleLink = await LinkService.submitLink('google.com');
      await LinkService.submitLink('nvidia.com');
      await LinkService.submitLink('microsoft.com');

      const beforeUpdateLinks = await LinkService.getPendingLinks();
      expect(beforeUpdateLinks).to.have.lengthOf(3);

      await LinkService.rejectLink(googleLink.id);
      const afterUpdateLinks = await LinkService.getPendingLinks();
      expect(afterUpdateLinks).to.have.lengthOf(2);
    });
  });
});
