import * as chai from 'chai';
import chaiSubset from 'chai-subset';
import assert from 'assert';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewObjectId } from '@/testutils/mongoID.testutil';
import { differenceInSeconds } from 'date-fns';

chai.use(chaiSubset);
const { expect } = chai;

describe('JobPostingRepository', () => {
  useMongoDB();

  const mockJobPosting = {
    linkId: getNewObjectId(),
    url: 'http://example.com/job-posting',
    jobTitle: 'Software Engineer',
    companyName: 'Example Company',
    submittedBy: getNewObjectId(),
  };

  describe('createJobPosting', () => {
    it('should be able to create a new job posting', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });

      expect(newJobPosting).to.containSubset(mockJobPosting);
    });
  });

  describe('getJobPostingById', () => {
    it('should be able to find a job post by id', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
      assert(newJobPosting);

      const foundJobPosting = await JobPostingRepository.getJobPostingById(
        newJobPosting.id
      );

      assert(foundJobPosting);
      expect(foundJobPosting).to.containSubset(mockJobPosting);
    });
  });

  describe('updateJobPostingById', () => {
    it('should be able to update detail of a job post by id', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
      assert(newJobPosting);

      const newUpdate = {
        jobTitle: 'Senior Software Engineer',
        companyName: 'Updated Company',
        jobDescription: 'This is an updated job description.',
      };

      const updatedJobPosting = await JobPostingRepository.updateJobPostingById(
        newJobPosting.id,
        newUpdate
      );

      expect(updatedJobPosting).to.containSubset(newUpdate);
    });
  });

  describe('deleteJobPostingById', () => {
    it('should be able to set a delete-timestamp for a job posting by id', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
      assert(newJobPosting);

      const deletedJobPosting = await JobPostingRepository.deleteJobPostingById(
        newJobPosting.id
      );

      assert(
        deletedJobPosting !== null,
        'Deleted job posting must not be null'
      );
      assert(
        'deletedAt' in deletedJobPosting,
        'Deleted job posting must have a deletedAt property'
      );

      const timeDiff = differenceInSeconds(
        new Date(),
        deletedJobPosting.deletedAt
      );

      assert(deletedJobPosting);
      expect(timeDiff).to.lessThan(3);
    });
  });
});
