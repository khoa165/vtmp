import request from 'supertest';
import { expect } from 'chai';
import bcrypt from 'bcryptjs';

import app from '@/app';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { UserRepository } from '@/repositories/user.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { ApplicationRepository } from '@/repositories/application.repository';
import { AuthService } from '@/services/auth.service';
import {
  expectErrorsArray,
  expectSuccessfulResponse,
} from '@/testutils/response-assertion.testutil';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';
import { IApplication } from '@/models/application.model';
import assert from 'assert';

describe('ApplicationController', () => {
  useMongoDB();

  let savedUserId: string;
  let mockToken: string;
  const mockJobPosting = {
    linkId: getNewObjectId(),
    url: 'vtmp.com',
    jobTitle: 'SWE',
    companyName: 'Apple',
    submittedBy: getNewObjectId(),
  };

  beforeEach(async () => {
    const encryptedPassword = await bcrypt.hash('test password', 10);
    const mockUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@gmail.com',
      encryptedPassword,
    };

    savedUserId = (await UserRepository.createUser(mockUser)).id;
    mockToken = await AuthService.login({
      email: mockUser.email,
      password: 'test password',
    });
  });

  describe('POST /applications', () => {
    it('should return error message with 400 status code if request body schema is invalid', async () => {
      const res = await request(app)
        .post('/api/applications')
        .send({ invalidIdSchema: getNewMongoId() })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Job posting ID is required');
    });

    it('should return error message with 400 status code if jobPostingId format is invalid', async () => {
      const res = await request(app)
        .post('/api/applications')
        .send({ jobPostingId: '123456789' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Invalid job posting ID format');
    });

    it('should return error message with status code 404 if job posting does not exist', async () => {
      const res = await request(app)
        .post('/api/applications')
        .send({ jobPostingId: getNewMongoId() })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Job posting not found');
    });

    it('should return error message with status code 409 if duplicate application exists', async () => {
      const jobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
      assert(jobPosting);

      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting.id,
        userId: savedUserId,
      });

      const res = await request(app)
        .post('/api/applications')
        .send({ jobPostingId: jobPosting.id })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 409, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Application already exists');
    });

    it('should return application object if an application is created successfully', async () => {
      const jobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
      assert(jobPosting);

      const res = await request(app)
        .post('/api/applications')
        .send({ jobPostingId: jobPosting.id })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 201 });
      expect(res.body.data).to.have.property('jobPostingId', jobPosting.id);
      expect(res.body.data).to.have.property('userId', savedUserId);
    });
  });

  describe('GET /applications', () => {
    it('should return all application objects that belong to the authenticated user', async () => {
      const mockApplication1 = {
        jobPostingId: getNewMongoId(),
        userId: savedUserId,
      };
      const mockApplication2 = {
        jobPostingId: getNewMongoId(),
        userId: savedUserId,
      };
      const savedApplicationId1 = (
        await ApplicationRepository.createApplication(mockApplication1)
      ).id;
      const savedApplicationId2 = (
        await ApplicationRepository.createApplication(mockApplication2)
      ).id;

      const res = await request(app)
        .get('/api/applications')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(2);
      expect(
        res.body.data.map((application: IApplication) => application._id)
      ).to.have.members([savedApplicationId1, savedApplicationId2]);
    });

    it('should return an empty array of applications if user does not have any applications', async () => {
      const res = await request(app)
        .get('/api/applications')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(0);
    });
  });

  describe('GET /applications/:id', () => {
    it('should return error message with 400 status code if applicationId param is invalid', async () => {
      const res = await request(app)
        .get('/api/applications/123456789')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Invalid application ID format');
    });

    it('should return 404 if application is not found or does not belong to authenticated user', async () => {
      const invalidApplicationId = getNewMongoId();
      const res = await request(app)
        .get(`/api/applications/${invalidApplicationId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Application not found');
    });

    it('should return an application if found and belongs to authenticated user', async () => {
      const mockApplication = {
        jobPostingId: getNewMongoId(),
        userId: savedUserId,
      };
      const savedApplicationId = (
        await ApplicationRepository.createApplication(mockApplication)
      ).id;

      const res = await request(app)
        .get(`/api/applications/${savedApplicationId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.have.property('_id', savedApplicationId);
      expect(res.body.data).to.have.property(
        'jobPostingId',
        mockApplication.jobPostingId
      );
      expect(res.body.data).to.have.property('userId', savedUserId);
    });
  });
});
