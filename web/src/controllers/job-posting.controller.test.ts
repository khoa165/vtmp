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
import { JobPostingRegion, UserRole } from '@vtmp/common/constants';
import {
  HTTPMethod,
  runDefaultAuthMiddlewareTests,
} from '@/testutils/auth.testutils';

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
      location: JobPostingRegion.CANADA,
    },
    {
      linkId: getNewObjectId(),
      url: 'http://example3.com/job-posting',
      jobTitle: 'Software Engineer 3',
      companyName: 'Example Company 3',
      submittedBy: getNewObjectId(),
      datePosted: new Date('2024-05-01'),
    },
    {
      linkId: getNewObjectId(),
      url: 'http://example4.com/job-posting',
      jobTitle: 'Software Engineer 4',
      companyName: 'Example Company 4',
      submittedBy: getNewObjectId(),
      datePosted: new Date('2023-7-31'),
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
      role: UserRole.ADMIN,
    };

    userIdA = (await UserRepository.createUser(mockUser)).id;
    ({ token: mockToken } = await AuthService.login({
      email: mockUser.email,
      password: 'test password',
    }));
  });

  describe('updateJobPosting', () => {
    const jobPostingUpdateBody = {
      jobTitle: 'Senior Software Engineer',
      companyName: 'Updated Company',
      jobDescription: 'This is an updated job description.',
    };

    runDefaultAuthMiddlewareTests({
      route: `/api/job-postings/${getNewMongoId()}`,
      method: HTTPMethod.PUT,
      body: jobPostingUpdateBody,
    });

    it('should return error message for no job posting found', async () => {
      const newJobPostingUpdate = {
        jobTitle: 'Senior Software Engineer',
        companyName: 'Updated Company',
        jobDescription: 'This is an updated job description.',
      };
      const res = await request(app)
        .put(`/api/job-postings/${getNewMongoId()}`)
        .send(newJobPostingUpdate)
        .set('Authorization', `Bearer ${mockToken}`)
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
        .set('Authorization', `Bearer ${mockToken}`)
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.deep.include(newJobPostingUpdate);
    });
  });

  describe('deleteJobPosting', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/job-postings/${getNewMongoId()}`,
      method: HTTPMethod.DELETE,
    });

    it('should return an error message for no job posting found', async () => {
      const res = await request(app)
        .delete(`/api/job-postings/${getNewMongoId()}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });

      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Job posting not found');
    });

    it('should return a deleted job posting', async () => {
      const res = await request(app)
        .delete(`/api/job-postings/${jobPostings[0]?.id}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .set('Accept', 'application/json');

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
    runDefaultAuthMiddlewareTests({
      route: `/api/job-postings/not-applied`,
      method: HTTPMethod.GET,
    });

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

  describe('getJobPostingsUserHasNotAppliedTo with Filter', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/job-postings/not-applied`,
      method: HTTPMethod.GET,
      body: {},
    });

    it('should return an empty array if user has applied to all available job postings in the system', async () => {
      const mockCompany = 'Company';
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
        .query({ companyName: mockCompany })
        .set('Authorization', `Bearer ${mockToken}`)
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return only the job postings not applied by the user and matching the company name filter', async () => {
      const mockCompany = 'Company 1';
      const jobPosting1 = jobPostings[0];

      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .query({ companyName: mockCompany })
        .set('Authorization', `Bearer ${mockToken}`)
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(1);
      expect(res.body.data[0]._id).to.equal(jobPosting1?.id);
    });

    it('should return job postings not applied by user after applying to one, matching the filter criteria', async () => {
      const mockCompany = 'Company';
      const [jobPosting1, jobPosting2, jobPosting3, jobPosting4] = jobPostings;

      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting1?.id,
        userId: userIdA,
      });
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting2?.id,
        userId: userIdA,
      });

      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .query({ companyName: mockCompany })
        .set('Authorization', `Bearer ${mockToken}`)
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(2);
      expect(res.body.data.map((job: IJobPosting) => job._id)).to.have.members([
        jobPosting3?.id,
        jobPosting4?.id,
      ]);
    });

    it('should return job postings matching the date filter', async () => {
      const jobPosting3 = jobPostings[2];
      const mockStartDate = new Date('2023-12-31');
      const mockEndDate = new Date('2025-1-1');

      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .query({
          postingDateRangeStart: mockStartDate,
          postingDateRangeEnd: mockEndDate,
        })
        .set('Authorization', `Bearer ${mockToken}`)
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(1);
      expect(res.body.data[0]._id).to.equal(jobPosting3?.id);
    });

    it('should return an empty array when filter by field with no matching postings', async () => {
      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .query({ companyName: 'PD' })
        .set('Authorization', `Bearer ${mockToken}`)
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return job postings matching jobTitle, companyName, and location', async () => {
      const jobPosting2 = jobPostings[1];
      const mockCompany = 'Company 2';
      const mockJobTitle = 'Engineer 2';
      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .query({
          companyName: mockCompany,
          jobTitle: mockJobTitle,
          location: JobPostingRegion.CANADA,
        })
        .set('Authorization', `Bearer ${mockToken}`)
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(1);
      expect(res.body.data[0]._id).to.equal(jobPosting2?.id);
    });

    it('should return job posting if user deleted the application', async () => {
      const mockCompany = 'Company';
      const jobPosting2 = jobPostings[1];
      const applications = await Promise.all(
        jobPostings.map((jobPosting) =>
          ApplicationRepository.createApplication({
            jobPostingId: jobPosting?.id,
            userId: userIdA,
          })
        )
      );
      await ApplicationRepository.deleteApplicationById({
        applicationId: applications[1]?.id,
        userId: userIdA,
      });

      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .query({
          companyName: mockCompany,
        })
        .set('Authorization', `Bearer ${mockToken}`)
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(1);
      expect(res.body.data[0]._id).to.equal(jobPosting2?.id);
    });
  });
});
