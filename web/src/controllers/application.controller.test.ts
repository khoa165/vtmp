import request from 'supertest';
import { expect } from 'chai';
import bcrypt from 'bcryptjs';

import app from '@/app';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { EnvConfig } from '@/config/env';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
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
import { InterviewRepository } from '@/repositories/interview.repository';
import { InterviewType } from '@common/enums';
import { differenceInSeconds } from 'date-fns';

describe('ApplicationController', () => {
  useMongoDB();
  const sandbox = useSandbox();

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
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);

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
      const savedJobPostingId = (
        await JobPostingRepository.createJobPosting(mockJobPosting)
      ).id;

      await ApplicationRepository.createApplication({
        jobPostingId: savedJobPostingId,
        userId: savedUserId,
      });

      const res = await request(app)
        .post('/api/applications')
        .send({ jobPostingId: savedJobPostingId })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 409, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Application already exists');
    });

    it('should return application object if an application is created successfully', async () => {
      const savedJobPostingId = (
        await JobPostingRepository.createJobPosting(mockJobPosting)
      ).id;

      const res = await request(app)
        .post('/api/applications')
        .send({ jobPostingId: savedJobPostingId })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 201 });
      expect(res.body.data).to.have.property('jobPostingId', savedJobPostingId);
      expect(res.body.data).to.have.property('userId', savedUserId);
    });
  });

  describe('GET /applications', () => {
    it('should return all application objects that belong to the authorized user', async () => {
      const application1 = await ApplicationRepository.createApplication({
        jobPostingId: getNewMongoId(),
        userId: savedUserId,
      });
      const application2 = await ApplicationRepository.createApplication({
        jobPostingId: getNewMongoId(),
        userId: savedUserId,
      });

      const res = await request(app)
        .get('/api/applications')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(2);
      expect(
        res.body.data.map((application: IApplication) => application._id)
      ).to.have.members([application1.id, application2.id]);
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

    it('should return 404 if application is not found or does not belong to authorized user', async () => {
      const invalidApplicationId = getNewMongoId();
      const res = await request(app)
        .get(`/api/applications/${invalidApplicationId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Application not found');
    });

    it('should return an application if found and belongs to authorized user', async () => {
      const application = await ApplicationRepository.createApplication({
        jobPostingId: getNewMongoId(),
        userId: savedUserId,
      });

      const res = await request(app)
        .get(`/api/applications/${application.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.have.property('_id', application.id);
      expect(res.body.data).to.have.property(
        'jobPostingId',
        application.jobPostingId.toString()
      );
      expect(res.body.data).to.have.property('userId', savedUserId);
    });
  });

  describe('PATCH /applications/:applicationId/status', () => {
    let application: IApplication;

    beforeEach(async () => {
      application = await ApplicationRepository.createApplication({
        jobPostingId: getNewMongoId(),
        userId: savedUserId,
      });
    });

    it('should return error message with 400 status code if applicationId param is invalid', async () => {
      const res = await request(app)
        .patch('/api/applications/123456789/status')
        .send({ updatedStatus: 'IN_PROGRESS' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Invalid application ID format');
    });

    it('should return error message with 400 status code if attempting to update other fields other than status', async () => {
      const validApplicationId = getNewMongoId();
      const res = await request(app)
        .patch(`/api/applications/${validApplicationId}/status`)
        .send({ note: 'some note', referrer: 'Khoa' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 2 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Invalid application status');
      expect(errors[1].message).to.equal('Only allow updating status');
    });

    it('should return error message with 400 status code if updated status is invalid', async () => {
      const validApplicationId = getNewMongoId();
      const res = await request(app)
        .patch(`/api/applications/${validApplicationId}/status`)
        .send({ updatedStatus: 'INVALID_STATUS' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Invalid application status');
    });

    it('should return 404 if application is not found or does not belong to authorized user', async () => {
      const invalidApplicationId = getNewMongoId();
      const res = await request(app)
        .patch(`/api/applications/${invalidApplicationId}/status`)
        .send({ updatedStatus: 'IN_PROGRESS' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Application not found');
    });

    it('should update the application status to REJECTED and return the updated application', async () => {
      const res = await request(app)
        .patch(`/api/applications/${application.id}/status`)
        .send({ updatedStatus: 'REJECTED' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.have.property('_id', application.id);
      expect(res.body.data).to.have.property('status', 'REJECTED');
    });

    it('should update the application status to a valid non-REJECTED status and return the updated application', async () => {
      const res = await request(app)
        .patch(`/api/applications/${application.id}/status`)
        .send({ updatedStatus: 'OFFER' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.have.property('_id', application.id);
      expect(res.body.data).to.have.property('status', 'OFFER');
    });
  });

  describe('PATCH /applications/:applicationId/metadata', () => {
    let application: IApplication;

    beforeEach(async () => {
      application = await ApplicationRepository.createApplication({
        jobPostingId: getNewMongoId(),
        userId: savedUserId,
      });
    });

    it('should return error message with 400 status code if applicationId param is invalid', async () => {
      const res = await request(app)
        .patch('/api/applications/123456789/metadata')
        .send({ note: 'Updated note' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Invalid application ID format');
    });

    it('should return error message with 400 status code if trying to update status', async () => {
      const res = await request(app)
        .patch(`/api/applications/${application.id}/metadata`)
        .send({ status: 'OFFER' }) // Invalid metadata field
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal(
        'Only allow updating valid metadata fields'
      );
    });

    it('should return error message with 400 status code trying to update interest level with invalid parameter', async () => {
      const res = await request(app)
        .patch(`/api/applications/${application.id}/metadata`)
        .send({ interest: 'VERY_HIGH' }) // Invalid interest level
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Invalid interest level');
    });

    it('should return 404 if application is not found or does not belong to authorized user', async () => {
      const invalidApplicationId = getNewMongoId();
      const res = await request(app)
        .patch(`/api/applications/${invalidApplicationId}/metadata`)
        .send({ note: 'Updated note' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Application not found');
    });

    it('should update the application metadata and return the updated application', async () => {
      const res = await request(app)
        .patch(`/api/applications/${application.id}/metadata`)
        .send({
          note: 'Updated note',
          referrer: 'Khoa',
          portalLink: 'http://abc.com',
          interest: 'HIGH',
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.have.property('_id', application.id);
      expect(res.body.data).to.have.property('note', 'Updated note');
      expect(res.body.data).to.have.property('referrer', 'Khoa');
      expect(res.body.data).to.have.property('portalLink', 'http://abc.com');
      expect(res.body.data).to.have.property('interest', 'HIGH');
    });
  });

  describe('DELETE /applications/:applicationId', () => {
    let application: IApplication;

    beforeEach(async () => {
      application = await ApplicationRepository.createApplication({
        jobPostingId: getNewMongoId(),
        userId: savedUserId,
      });
    });

    it('should return error message with 400 status code if applicationId param is invalid', async () => {
      const res = await request(app)
        .delete('/api/applications/123456789')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Invalid application ID format');
    });

    it('should return error message with 404 status code if application is not found or does not belong to authorized user', async () => {
      const invalidApplicationId = getNewMongoId();
      const res = await request(app)
        .delete(`/api/applications/${invalidApplicationId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Application not found');
    });

    it('should return error message with 403 status code if trying to delete an application that has interviews', async () => {
      await InterviewRepository.createInterview({
        applicationId: application.id,
        userId: savedUserId,
        type: [InterviewType.CODE_REVIEW],
        interviewOnDate: new Date(),
      });

      const res = await request(app)
        .delete(`/api/applications/${application.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal(
        'Cannot delete application that has interviews'
      );
    });

    it('should delete the application successfully and return the deleted application', async () => {
      const res = await request(app)
        .delete(`/api/applications/${application.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      const deletedApplication = res.body.data;
      expect(deletedApplication).to.have.property('_id', application.id);
      const timeDiff = differenceInSeconds(
        deletedApplication.deletedAt,
        new Date()
      );
      expect(timeDiff).to.lessThan(3);
    });
  });
});
