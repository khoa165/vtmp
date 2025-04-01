import app from '@/app';
import request from 'supertest';
import * as chai from 'chai';
import { expect } from 'chai';
import chaiSubset from 'chai-subset';

import { useMongoDB } from '@/testutils/mongoDB.testutil';
import mongoose from 'mongoose';
import { JobPostingRepository } from '@/repositories/job-posting.repository';

chai.use(chaiSubset);
describe('JobPostingController', () => {
  useMongoDB();

  const mockJobPosting = {
    linkId: new mongoose.Types.ObjectId(),
    url: 'http://example.com/job-posting',
    jobTitle: 'Software Engineer',
    companyName: 'Example Company',
    submittedBy: new mongoose.Types.ObjectId(),
  };
  let jobId: string;
  beforeEach(async () => {
    const newJobPosting = await JobPostingRepository.createJobPosting(
      mockJobPosting
    );
    jobId = newJobPosting.id;
  });

  describe('updateJobPosting', () => {
    it('should return 404 if job posting does not exist', async () => {
      const response = await request(app)
        .put(`/api/job-postings/${new mongoose.Types.ObjectId().toString()}`)
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
    });
  });

  describe('deleteJobPosting', () => {
    it('should return 404 if job posting does not exist', async () => {
      const response = await request(app).delete(
        `/api/job-postings/${new mongoose.Types.ObjectId().toString()}`
      );

      expect(response.status).to.equal(404);
    });

    it('should return 200 if job posting is deleted successfully', async () => {
      const response = await request(app).delete(`/api/job-postings/${jobId}`);

      expect(response.status).to.equal(200);
    });
  });
});
