import * as chai from 'chai';

import JobPostingService from './jobPosting.service';
import JobPostingRepository from '@/repositories/jobPosting.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import mongoose from 'mongoose';
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

  describe('updateJobPostingById', () => {
    it('should throw an error when no job posting is found', async () => {
      await JobPostingRepository.createJobPosting(mockJobPosting);
      const newUpdate = {
        jobTitle: 'Senior Software Engineer',
        companyName: 'Updated Company',
        jobDescription: 'This is an updated job description.',
      };

      expect(
        JobPostingService.updateJobPostingById(
          new mongoose.Types.ObjectId().toString(),
          newUpdate
        )
      ).to.throw;
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
      ).to.not.throw;
    });
  });

  describe('deleteJobPostingById', () => {
    it('should throw an error when no job posting is found', async () => {
      await JobPostingRepository.createJobPosting(mockJobPosting);

      expect(
        JobPostingService.deleteJobPostingById(
          new mongoose.Types.ObjectId().toString()
        )
      ).to.throw;
    });

    it('should not throw an error when a job posting is found', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting(
        mockJobPosting
      );

      expect(JobPostingService.deleteJobPostingById(newJobPosting.id)).to.not
        .throw;
    });
  });
});
