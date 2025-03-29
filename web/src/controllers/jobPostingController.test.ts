import app from '@/app';
import request from 'supertest';
import * as chai from 'chai';
import { expect } from 'chai';
import chaiSubset from 'chai-subset';

import { useMongoDB } from '@/config/mongodb.testutils';
import mongoose from 'mongoose';
import JobPostingModel from '@/models/jobPosting.model';

chai.use(chaiSubset);
describe('JobPostingController', () => {
  useMongoDB();

  const mockJobPosting = {
    linkId: new mongoose.Types.ObjectId(), // This should be a valid ObjectId from a Link document in your test database
    url: 'http://example.com/job-posting', // Example URL
    jobTitle: 'Software Engineer', // Example job title
    companyName: 'Example Company', // Example company name
    submittedBy: new mongoose.Types.ObjectId(), // This should be a valid ObjectId from a User document in your test database
  };
  let jobId: string;
  beforeEach(async () => {
    const newJobPosting = await JobPostingModel.create(mockJobPosting);

    jobId = newJobPosting.id;
  });
  describe('updateJobPosting', () => {
    it('should return 404 if job posting does not exist', async () => {
      const randomId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .put(`/api/job-postings/${randomId}`)
        .send({
          jobTitle: 'Senior Software Engineer',
          companyName: 'Updated Company',
          jobDescription: 'This is an updated job description.',
        });

      expect(response.status).to.equal(404);
    });

    it('should return 200 if job posting is updated successfully', async () => {
      const response = await request(app)
        .put(`/api/job-postings/${jobId}`)
        .send({
          jobTitle: 'Senior Software Engineer',
          companyName: 'Updated Company',
          jobDescription: 'This is an updated job description.',
        })
        .set('Accept', 'application/json');

      expect(response.status).to.equal(200);
      expect(response.body.data.jobTitle).to.equal('Senior Software Engineer');
    });
  });

  describe('deleteJobPosting', () => {
    it('should return 404 if job posting does not exist', async () => {
      const randomId = new mongoose.Types.ObjectId().toString();
      const response = await request(app).delete(
        `/api/job-postings/${randomId}`
      );

      expect(response.status).to.equal(404);
    });

    it('should return 200 if job posting is deleted successfully', async () => {
      const newJobPosting = await JobPostingModel.create(mockJobPosting);

      const jobId = newJobPosting.id;

      const response = await request(app).delete(`/api/job-postings/${jobId}`);

      const currentDate = new Date();
      const deleteDate = new Date(currentDate.getDate() + 7);
      const dateToDelete = {
        deletedAt: deleteDate.toISOString(),
      };

      expect(response.status).to.equal(200);
      expect(response.body.data).to.containSubset(dateToDelete);
    });
  });
});
