import { expect } from 'chai';
import assert from 'assert';
import JobPostingService from './jobPosting.service';
import JobPostingRepository from '@/repositories/jobPosting.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import mongoose from 'mongoose';
import { ResourceNotFoundError } from '@/utils/errors';
import { differenceInSeconds } from 'date-fns';

describe('JobPostingService', () => {
  useMongoDB();

  const mockJobPosting = {
    linkId: new mongoose.Types.ObjectId(),
    url: 'http://example.com/job-posting',
    jobTitle: 'Software Engineer',
    companyName: 'Example Company',
    submittedBy: new mongoose.Types.ObjectId(),
  };

  describe('updateJobPostingById', () => {
    it('should throw an error when no job posting is found', async () => {
      const newUpdate = {
        jobTitle: 'Senior Software Engineer',
        companyName: 'Updated Company',
        jobDescription: 'This is an updated job description.',
      };

      await expect(
        JobPostingService.updateJobPostingById(
          new mongoose.Types.ObjectId().toString(),
          newUpdate
        )
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should not throw an error when a job posting is found', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting(
        mockJobPosting
      );
      const newUpdate = {
        jobTitle: 'Senior Software Engineer',
        companyName: 'Updated Company',
        jobDescription: 'This is an updated job description.',
      };

      await expect(
        JobPostingService.updateJobPostingById(newJobPosting.id, newUpdate)
      ).eventually.fulfilled;
    });

    it('should be able to update detail of a job post by id', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting(
        mockJobPosting
      );

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
    it('should throw an error when no job posting is found', async () => {
      await expect(
        JobPostingService.deleteJobPostingById(
          new mongoose.Types.ObjectId().toString()
        )
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should not throw an error when a job posting is found', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting(
        mockJobPosting
      );

      await expect(JobPostingService.deleteJobPostingById(newJobPosting.id))
        .eventually.fulfilled;
    });

    it('should be able to set a delete-timestamp for a job posting by id', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting(
        mockJobPosting
      );
      const deletedJobPosting = await JobPostingRepository.deleteJobPostingById(
        newJobPosting.id
      );

      assert(deletedJobPosting);
      assert(deletedJobPosting.deletedAt);

      const timeDiff = differenceInSeconds(
        new Date(),
        deletedJobPosting.deletedAt
      );

      expect(timeDiff).to.lessThan(3);
    });
  });
});
