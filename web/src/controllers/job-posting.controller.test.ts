import assert from 'assert';
import request from 'supertest';
import { expect } from 'chai';
import { differenceInSeconds } from 'date-fns';
import app from '@/app';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { IJobPosting } from '@/models/job-posting.model';
import { ApplicationRepository } from '@/repositories/application.repository';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { EnvConfig } from '@/config/env';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import {
  expectErrorsArray,
  expectSuccessfulResponse,
} from '@/testutils/response-assertion.testutil';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';
import {
  HTTPMethod,
  runDefaultAuthMiddlewareTests,
  runUserLogin,
} from '@/testutils/auth.testutils';

describe('JobPostingController', () => {
  useMongoDB();
  const sandbox = useSandbox();
  let mockUserId: string, mockUserToken: string;
  const userIdB = getNewMongoId();
  let jobPostings: (IJobPosting | undefined)[];
  const newJobPostingUpdate = {
    jobTitle: 'Senior Software Engineer',
    companyName: 'Updated Company',
    jobDescription: 'This is an updated job description.',
  };
  const mockMultipleJobPostings = [
    {
      linkId: getNewObjectId(),
      url: 'http://example1.com/job-posting',
      jobTitle: 'Software Engineer 1',
      companyName: 'Example Company 1',
      submittedBy: getNewObjectId(),
    },
    {
      linkId: getNewObjectId(),
      url: 'http://example2.com/job-posting',
      jobTitle: 'Software Engineer 2',
      companyName: 'Example Company 2',
      submittedBy: getNewObjectId(),
    },
    {
      linkId: getNewObjectId(),
      url: 'http://example3.com/job-posting',
      jobTitle: 'Software Engineer 3',
      companyName: 'Example Company 3',
      submittedBy: getNewObjectId(),
    },
    {
      linkId: getNewObjectId(),
      url: 'http://example4.com/job-posting',
      jobTitle: 'Software Engineer 4',
      companyName: 'Example Company 4',
      submittedBy: getNewObjectId(),
    },
  ];

  beforeEach(async () => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
    ({ mockUserId, mockUserToken } = await runUserLogin());

    jobPostings = await Promise.all(
      mockMultipleJobPostings.map((jobPosting) =>
        JobPostingRepository.createJobPosting({
          jobPostingData: jobPosting,
        })
      )
    );
    assert(jobPostings);
  });

  describe('PUT /job-postings/:jobId', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/job-postings/${getNewMongoId()}`,
      method: HTTPMethod.PUT,
    });

    it('should return 400 for invalid job posting ID format', async () => {
      const res = await request(app)
        .put('/api/job-postings/invalid-id')
        .send({ jobTitle: 'Invalid Test' })
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Invalid job posting ID format'
      );
    });

    it('should return 400 for invalid job title type', async () => {
      const res = await request(app)
        .put(`/api/job-postings/${jobPostings[0]?.id}`)
        .send({ jobTitle: 123 })
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Invalid job title format');
    });

    it('should return 400 for field not allow to update', async () => {
      const res = await request(app)
        .put(`/api/job-postings/${jobPostings[0]?.id}`)
        .send({ userId: 'test' })
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'field is not allowed to update'
      );
    });

    it('should return error message for no job posting found', async () => {
      const res = await request(app)
        .put(`/api/job-postings/${getNewMongoId()}`)
        .send(newJobPostingUpdate)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Job posting not found');
    });

    it('should return a updated job posting', async () => {
      const res = await request(app)
        .put(`/api/job-postings/${jobPostings[0]?.id}`)
        .send(newJobPostingUpdate)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.deep.include(newJobPostingUpdate);
    });
  });

  describe('DELETE /job-postings/:jobId', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/job-postings/${getNewMongoId()}`,
      method: HTTPMethod.DELETE,
    });

    it('should return 401 if no auth token is provided', async () => {
      const res = await request(app).delete(
        `/api/job-postings/${jobPostings[0]?.id}`
      );

      expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Unauthorized');
    });

    it('should return 400 for invalid job posting ID format', async () => {
      const res = await request(app)
        .delete('/api/job-postings/invalid-id-format')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Invalid job posting ID format'
      );
    });

    it('should return 404 if job posting was already deleted', async () => {
      await request(app)
        .delete(`/api/job-postings/${jobPostings[1]?.id}`)
        .set('Authorization', `Bearer ${mockUserToken}`);

      const res = await request(app)
        .delete(`/api/job-postings/${jobPostings[1]?.id}`)
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Job posting not found');
    });

    it('should return an error message for no job posting found', async () => {
      const res = await request(app)
        .delete(`/api/job-postings/${getNewMongoId()}`)
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Job posting not found');
    });

    it('should return a deleted job posting', async () => {
      const res = await request(app)
        .delete(`/api/job-postings/${jobPostings[0]?.id}`)
        .set('Authorization', `Bearer ${mockUserToken}`);

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

  describe('GET /job-postings/not-applied', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/job-postings/not-applies`,
      method: HTTPMethod.GET,
    });

    it('should return an empty array if user has applied to all available job postings in the system', async () => {
      await Promise.all(
        jobPostings.map((jobPosting) =>
          ApplicationRepository.createApplication({
            jobPostingId: jobPosting?.id,
            userId: mockUserId,
          })
        )
      );

      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return all job postings if user has not applied to any posting', async () => {
      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data)
        .to.be.an('array')
        .that.have.lengthOf(mockMultipleJobPostings.length);
      expect(res.body.data.map((job: IJobPosting) => job._id)).to.have.members(
        jobPostings.map((jobPosting) => jobPosting?.id)
      );
    });

    it('should exclude soft-deleted job postings from the returned array', async () => {
      const [jobPosting1, jobPosting2, jobPosting3, jobPosting4] = jobPostings;
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting1?.id,
        userId: mockUserId,
      });
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting2?.id,
        userId: mockUserId,
      });
      await JobPostingRepository.deleteJobPostingById(jobPosting3?.id);

      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(1);
      expect(res.body.data[0]._id).to.equal(jobPosting4?.id);
    });

    it('should not exclude a job posting if the user applied to it but later deleted the application', async () => {
      const applications = await Promise.all(
        jobPostings.map((jobPosting) =>
          ApplicationRepository.createApplication({
            jobPostingId: jobPosting?.id,
            userId: mockUserId,
          })
        )
      );
      await ApplicationRepository.deleteApplicationById({
        applicationId: applications[0]?.id,
        userId: mockUserId,
      });

      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(1);
      expect(res.body.data[0]._id).to.equal(jobPostings[0]?.id);
    });

    it('should return all job postings that user has not applied to. Should not exclude job postings applied by another user', async () => {
      const [jobPosting1, jobPosting2, jobPosting3, jobPosting4] = jobPostings;
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting1?.id,
        userId: mockUserId,
      });
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting2?.id,
        userId: mockUserId,
      });
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting3?.id,
        userId: userIdB,
      });

      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(2);
      expect(res.body.data.map((job: IJobPosting) => job._id)).to.have.members([
        jobPosting3?.id,
        jobPosting4?.id,
      ]);
    });
  });
});
