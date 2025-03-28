import * as chai from 'chai';
import chaiSubset from 'chai-subset';

import JobPostingRepository from './jobPosting.repository';
import JobPosting from '@/models/jobPosting.model';
import { useMongoDB } from '@/config/mongodb.testutils';
import mongoose from 'mongoose';
import { ObjectId } from 'mongoose';

chai.use(chaiSubset);
const { expect } = chai;

describe('JobPostingRepository', () => {
  useMongoDB();

  const mockJobPosting = {
    linkId: new mongoose.Types.ObjectId(), // This should be a valid ObjectId from a Link document in your test database
    url: 'http://example.com/job-posting', // Example URL
    jobTitle: 'Software Engineer', // Example job title
    companyName: 'Example Company', // Example company name
    submittedBy: new mongoose.Types.ObjectId(), // This should be a valid ObjectId from a User document in your test database
  };

  describe('CreateJobPost for JobPostingRepository', () => {
    it('should be able to create a new job posting', async () => {
      const newJobPosting = await JobPostingRepository.createJobPost(
        mockJobPosting
      );
      
      expect(newJobPosting).to.not.be.null;
      expect(newJobPosting).to.containSubset(mockJobPosting);
    });
  });

  describe('FindbyId for JobPostingRepository', () => {
    it('should be able to find a job post by id', async () => {
      const newJobPosting = await JobPosting.create(mockJobPosting);

      const jobId: string = (newJobPosting._id as ObjectId).toString();
      const foundJobPosting = await JobPostingRepository.findById(
        jobId
      );

      expect(foundJobPosting).to.not.be.null;
      expect(foundJobPosting).to.containSubset(mockJobPosting);
    });
  });

  describe('UpdateById for JobPostingRepository', () => {
    it('should be able to update detail of a job post by id', async () => {
      const newJobPosting = await JobPosting.create(mockJobPosting);

      const newUpdate = {
        jobTitle: 'Senior Software Engineer', // Updated job title
        companyName: 'Updated Company', // Updated company name
        jobDescription: 'This is an updated job description.', // Updated job description
      };

      const jobId: string = (newJobPosting._id as ObjectId).toString();
      const updatedJobPosting = await JobPostingRepository.updateById(
        jobId,
        newUpdate
      );

      expect(updatedJobPosting).to.containSubset(newUpdate);
    });
  });

  describe('DeleteById for JobPostingRepository', () => {
    it('should be able to set a delete-timestamp for a job posting by id', async () => {
      const newJobPosting = await JobPosting.create(mockJobPosting);

      const currentDate: Date = new Date();
      const dateDeleted: Date = new Date(currentDate.getDate() + 7);
      const updateDelete = {
        deletedAt: dateDeleted,
      };

      const jobId: string = (newJobPosting._id as ObjectId).toString();
      const deletedJobPosting = await JobPostingRepository.deleteById(
        jobId
      );

      expect(deletedJobPosting).to.containSubset(updateDelete);
    });
  });
});
