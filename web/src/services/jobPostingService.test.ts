import * as chai from 'chai';
import assert from 'assert';

import JobPostingService from './jobPosting.service';
import JobPostingRepository from '@/repositories/jobPosting.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import mongoose from 'mongoose';
import { ResourceNotFoundError } from '@/utils/errors';
import { differenceInSeconds } from 'date-fns';

const { expect } = chai;

describe('JobPostingService', () => {
  useMongoDB();

  const mockJobPosting = {
    linkId: new mongoose.Types.ObjectId(),
    url: 'http://example.com/job-posting',
    jobTitle: 'Software Engineer',
    companyName: 'Example Company',
    submittedBy: new mongoose.Types.ObjectId(),
  };

  describe.only('updateJobPostingById', () => {
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

      expect(
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

  describe.only('deleteJobPostingById', () => {
    it('should throw an error when no job posting is found', async () => {
      expect(
        JobPostingService.deleteJobPostingById(
          new mongoose.Types.ObjectId().toString()
        )
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should not throw an error when a job posting is found', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting(
        mockJobPosting
      );

      expect(JobPostingService.deleteJobPostingById(newJobPosting.id)).eventually.fulfilled;
    });

    it('should be able to set a delete-timestamp for a job posting by id', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting(
        mockJobPosting
      );
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

      expect(deletedJobPosting).to.not.be.null;
      expect(timeDiff).to.lessThan(3);
    });
  });
});
