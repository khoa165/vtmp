import * as chai from 'chai';
import chaiSubset from 'chai-subset';
import assert from 'assert';
import JobPostingRepository from './jobPosting.repository';
import JobPosting from '@/models/jobPosting.model';
import { useMongoDB } from '@/config/mongodb.testutils';
import mongoose from 'mongoose';
import { differenceInSeconds } from 'date-fns';

chai.use(chaiSubset);
const { expect } = chai;

describe('JobPostingRepository', () => {
  useMongoDB();

  const mockJobPosting = {
    linkId: new mongoose.Types.ObjectId(),
    url: 'http://example.com/job-posting',
    jobTitle: 'Software Engineer',
    companyName: 'Example Company',
    submittedBy: new mongoose.Types.ObjectId(),
  };

  describe('createJobPosting', () => {
    it('should be able to create a new job posting', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting(
        mockJobPosting
      );

      expect(newJobPosting).to.containSubset(mockJobPosting);
    });
  });

  describe('getJobPostingById', () => {
    it('should be able to find a job post by id', async () => {
      const newJobPosting = await JobPosting.create(mockJobPosting);

      const foundJobPosting = await JobPostingRepository.getJobPostingById(
        newJobPosting.id
      );

      expect(foundJobPosting).to.not.be.null;
      expect(foundJobPosting).to.containSubset(mockJobPosting);
    });
  });

  describe('updateJobPostingById', () => {
    it('should be able to update detail of a job post by id', async () => {
      const newJobPosting = await JobPosting.create(mockJobPosting);

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
      const newJobPosting = await JobPosting.create(mockJobPosting);
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
