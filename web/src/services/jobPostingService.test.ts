import * as chai from 'chai';

import JobPostingService from './jobPosting.service';
import JobPosting from '@/models/jobPosting.model';
import { useMongoDB } from '@/config/mongodb.testutils';
import mongoose from 'mongoose';
import { ObjectId } from 'mongoose';
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

  describe('UpdateById for JobPostingService', () => {
    it('should throw an error', async () => {
      await JobPosting.create(mockJobPosting);
      const newUpdate = {
        jobTitle: 'Senior Software Engineer', // Updated job title
        companyName: 'Updated Company', // Updated company name
        jobDescription: 'This is an updated job description.', // Updated job description
      };
      const randomId = new mongoose.Types.ObjectId();

      expect(JobPostingService.updateById(randomId.toString(), newUpdate)).to
        .throw;
    });

    it('should not throw an error', async () => {
      const newJobPosting = await JobPosting.create(mockJobPosting);
      const newUpdate = {
        jobTitle: 'Senior Software Engineer', // Updated job title
        companyName: 'Updated Company', // Updated company name
        jobDescription: 'This is an updated job description.', // Updated job description
      };
      const jobId: string = (newJobPosting._id as ObjectId).toString();

      expect(JobPostingService.updateById(jobId, newUpdate)).to.not
        .throw;
    });
  });

  describe('DeleteById for JobPostingService', () => {
    it('should throw an error', async () => {
      await JobPosting.create(mockJobPosting);
      const randomId = new mongoose.Types.ObjectId();

      expect(JobPostingService.deleteById(randomId.toString())).to.throw;
    });
    it('should not throw an error', async () => {
      const newJobPosting = await JobPosting.create(mockJobPosting);
      const jobId: string = (newJobPosting._id as ObjectId).toString();
      
      expect(JobPostingService.deleteById(jobId)).to.not.throw;
    });
  });
});
