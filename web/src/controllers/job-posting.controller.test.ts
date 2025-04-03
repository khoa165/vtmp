import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { beforeEach, describe } from 'mocha';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import app from '@/app';
import request from 'supertest';
import * as chai from 'chai';
import { expect } from 'chai';
import chaiSubset from 'chai-subset';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { EnvConfig } from '@/config/env';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import {
  expectErrorsArray,
  expectSuccessfulResponse,
} from '@/testutils/response-assertion.testutil';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';
import { differenceInSeconds } from 'date-fns';

chai.use(chaiSubset);
describe('JobPostingController', () => {
  useMongoDB();
  const sandbox = useSandbox();
  beforeEach(() => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
  });

  let jobId: string;

  beforeEach(async () => {
    const mockJobPosting = {
      linkId: getNewObjectId(),
      url: 'http://example.com/job-posting',
      jobTitle: 'Software Engineer',
      companyName: 'Example Company',
      submittedBy: getNewObjectId(),
    };
    const newJobPosting = await JobPostingRepository.createJobPosting(
      mockJobPosting
    );
    jobId = newJobPosting.id;
  });

  describe('updateJobPosting', () => {
    it('should return error message for no job posting found', async () => {
      const newJobPostingUpdate = {
        jobTitle: 'Senior Software Engineer',
        companyName: 'Updated Company',
        jobDescription: 'This is an updated job description.',
      };
      const res = await request(app)
        .put(`/api/job-postings/${getNewMongoId()}`)
        .send(newJobPostingUpdate)
        .set('Accept', 'application/json');

      expectErrorsArray({ res: res, statusCode: 404, errorsCount: 1 });

      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Job posting not found');
    });

    it('should return a updated job posting', async () => {
      const newJobPostingUpdate = {
        jobTitle: 'Senior Software Engineer',
        companyName: 'Updated Company',
        jobDescription: 'This is an updated job description.',
      };
      const res = await request(app)
        .put(`/api/job-postings/${jobId}`)
        .send(newJobPostingUpdate)
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.containSubset(newJobPostingUpdate);
    });
  });

  describe('deleteJobPosting', () => {
    it('should return an error message for no job posting found', async () => {
      const res = await request(app).delete(
        `/api/job-postings/${getNewMongoId()}`
      );

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });

      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Job posting not found');
    });

    it('should return a deleted job posting', async () => {
      const res = await request(app).delete(`/api/job-postings/${jobId}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.have.property('deletedAt');

      const deletedJobPosting = res.body.data;
      const timeDiff = differenceInSeconds(
        deletedJobPosting.deletedAt,
        new Date()
      );
      expect(timeDiff).to.lessThan(3);
    });
  });
});
