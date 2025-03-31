import * as chai from 'chai';

import JobPostingService from './jobPosting.service';
import JobPostingModel from '@/models/jobPosting.model';
import { useMongoDB } from '@/config/mongodb.testutils';
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
      await JobPostingModel.create(mockJobPosting);
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
      const newJobPosting = await JobPostingModel.create(mockJobPosting);
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
      await JobPostingModel.create(mockJobPosting);

      expect(
        JobPostingService.deleteJobPostingById(
          new mongoose.Types.ObjectId().toString()
        )
      ).to.throw;
    });

    it('should not throw an error when a job posting is found', async () => {
      const newJobPosting = await JobPostingModel.create(mockJobPosting);

      expect(JobPostingService.deleteJobPostingById(newJobPosting.id)).to.not
        .throw;
    });
  });
});
