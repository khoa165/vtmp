import * as chai from 'chai';

import JobPostingService from './jobPosting.service';
import JobPostingModel from '@/models/jobPosting.model';
import { useMongoDB } from '@/config/mongodb.testutils';
import mongoose from 'mongoose';
const { expect } = chai;

describe('JobPostingService', () => {
  useMongoDB();

  const mockJobPosting = {
    linkId: new mongoose.Types.ObjectId(), // This should be a valid ObjectId from a Link document in your test database
    url: 'http://example.com/job-posting', // Example URL
    jobTitle: 'Software Engineer', // Example job title
    companyName: 'Example Company', // Example company name
    submittedBy: new mongoose.Types.ObjectId(), // This should be a valid ObjectId from a User document in your test database
  };

  describe('updateJobPostingById', () => {
    it('should throw an error when no job posting is found', async () => {
      await JobPostingModel.create(mockJobPosting);
      const newUpdate = {
        jobTitle: 'Senior Software Engineer', // Updated job title
        companyName: 'Updated Company', // Updated company name
        jobDescription: 'This is an updated job description.', // Updated job description
      };
      const randomId = new mongoose.Types.ObjectId();

      expect(
        JobPostingService.updateJobPostingById(randomId.toString(), newUpdate)
      ).to.throw;
    });

    it('should not throw an error when a job posting is found', async () => {
      const newJobPosting = await JobPostingModel.create(mockJobPosting);
      const newUpdate = {
        jobTitle: 'Senior Software Engineer', // Updated job title
        companyName: 'Updated Company', // Updated company name
        jobDescription: 'This is an updated job description.', // Updated job description
      };
      const jobId = newJobPosting.id;

      expect(JobPostingService.updateJobPostingById(jobId, newUpdate)).to.not
        .throw;
    });
  });

  describe('deleteJobPostingById', () => {
    it('should throw an error when no job posting is found', async () => {
      await JobPostingModel.create(mockJobPosting);
      const randomId = new mongoose.Types.ObjectId();

      expect(JobPostingService.deleteJobPostingById(randomId.toString())).to
        .throw;
    });

    it('should not throw an error when a job posting is found', async () => {
      const newJobPosting = await JobPostingModel.create(mockJobPosting);
      const jobId = newJobPosting.id;

      expect(JobPostingService.deleteJobPostingById(jobId)).to.not.throw;
    });
  });
});
