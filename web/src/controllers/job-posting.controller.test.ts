import assert from 'assert';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { expect } from 'chai';
import { differenceInSeconds } from 'date-fns';

import app from '@/app';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { IJobPosting } from '@/models/job-posting.model';
import { ApplicationRepository } from '@/repositories/application.repository';
import { UserRepository } from '@/repositories/user.repository';
import { AuthService } from '@/services/auth.service';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { EnvConfig } from '@/config/env';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import {
  expectErrorsArray,
  expectSuccessfulResponse,
} from '@/testutils/response-assertion.testutil';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';

describe('JobPostingController', () => {
  useMongoDB();
  const sandbox = useSandbox();

  let mockToken: string;
  let userIdA: string;
  const userIdB = getNewMongoId();
  let jobPostings: (IJobPosting | undefined)[];

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

    jobPostings = await Promise.all(
      mockMultipleJobPostings.map((jobPosting) =>
        JobPostingRepository.createJobPosting({
          jobPostingData: jobPosting,
        })
      )
    );
    assert(jobPostings);

    const encryptedPassword = await bcrypt.hash('test password', 10);
    const mockUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@gmail.com',
      encryptedPassword,
    };

    userIdA = (await UserRepository.createUser(mockUser)).id;
    ({ token: mockToken } = await AuthService.login({
      email: mockUser.email,
      password: 'test password',
    }));
  });

  describe.only('updateJobPosting', () => {
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

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });

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
        .put(`/api/job-postings/${jobPostings[0]?.id}`)
        .send(newJobPostingUpdate)
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.deep.include(newJobPostingUpdate);
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
      const res = await request(app).delete(
        `/api/job-postings/${jobPostings[0]?.id}`
      );

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

  describe('getJobPostingsUserHasNotAppliedTo', () => {
    it('should return an empty array if user has applied to all available job postings in the system', async () => {
      await Promise.all(
        jobPostings.map((jobPosting) =>
          ApplicationRepository.createApplication({
            jobPostingId: jobPosting?.id,
            userId: userIdA,
          })
        )
      );

      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return all job postings if user has not applied to any posting', async () => {
      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

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
        userId: userIdA,
      });
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting2?.id,
        userId: userIdA,
      });
      await JobPostingRepository.deleteJobPostingById(jobPosting3?.id);

      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(1);
      expect(res.body.data[0]._id).to.equal(jobPosting4?.id);
    });

    it('should not exclude a job posting if the user applied to it but later deleted the application', async () => {
      const applications = await Promise.all(
        jobPostings.map((jobPosting) =>
          ApplicationRepository.createApplication({
            jobPostingId: jobPosting?.id,
            userId: userIdA,
          })
        )
      );
      await ApplicationRepository.deleteApplicationById({
        applicationId: applications[0]?.id,
        userId: userIdA,
      });

      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(1);
      expect(res.body.data[0]._id).to.equal(jobPostings[0]?.id);
    });

    it('should return all job postings that user has not applied to. Should not exclude job postings applied by another user', async () => {
      const [jobPosting1, jobPosting2, jobPosting3, jobPosting4] = jobPostings;
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting1?.id,
        userId: userIdA,
      });
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting2?.id,
        userId: userIdA,
      });
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting3?.id,
        userId: userIdB,
      });

      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(2);
      expect(res.body.data.map((job: IJobPosting) => job._id)).to.have.members([
        jobPosting3?.id,
        jobPosting4?.id,
      ]);
    });
  });
});
