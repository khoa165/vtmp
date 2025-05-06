import request from 'supertest';
import { expect } from 'chai';
import bcrypt from 'bcryptjs';
import * as R from 'remeda';

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
import {
  ApplicationStatus,
  InterviewStatus,
  InterviewType,
} from '@vtmp/common/constants';
import { differenceInSeconds } from 'date-fns';
import assert from 'assert';

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

    it('should return application object if an application (that was previously soft deleted) is created successfully', async () => {
      const jobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
      assert(jobPosting);

      const softDeletedApplication =
        await ApplicationRepository.createApplication({
          jobPostingId: jobPosting.id,
          userId: savedUserId,
        });

      await ApplicationRepository.deleteApplicationById({
        applicationId: softDeletedApplication.id,
        userId: savedUserId,
      });

      const res = await request(app)
        .post('/api/applications')
        .send({ jobPostingId: jobPosting.id })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 201 });
      expect(res.body.data).to.have.property('jobPostingId', jobPosting.id);
      expect(res.body.data).to.have.property('userId', savedUserId);
      expect(res.body.data).to.have.property('_id', softDeletedApplication.id);
      expect(res.body.data).to.have.property('deletedAt', null);
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

    it('should not return soft-deleted applications', async () => {
      const application = await ApplicationRepository.createApplication({
        jobPostingId: getNewMongoId(),
        userId: savedUserId,
      });

      await ApplicationRepository.deleteApplicationById({
        applicationId: application.id,
        userId: savedUserId,
      });

      const res = await request(app)
        .get('/api/applications')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(0);
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
    let application: IApplication;

    beforeEach(async () => {
      application = await ApplicationRepository.createApplication({
        jobPostingId: getNewMongoId(),
        userId: savedUserId,
      });
    });

    it('should return error message with 400 status code if applicationId param is invalid', async () => {
      const res = await request(app)
        .get('/api/applications/123456789')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Invalid application ID format');
    });

    it('should return error message with 404 status code if application is not found', async () => {
      const invalidApplicationId = getNewMongoId();
      const res = await request(app)
        .get(`/api/applications/${invalidApplicationId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Application not found');
    });

    it('should return error message with 404 status code if application does not belong to authorized user', async () => {
      const otherApplication = await ApplicationRepository.createApplication({
        jobPostingId: getNewMongoId(),
        userId: getNewMongoId(),
      });

      const res = await request(app)
        .get(`/api/applications/${otherApplication.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Application not found');
    });

    it('should return error message with 404 status code if application is soft-deleted', async () => {
      await ApplicationRepository.deleteApplicationById({
        applicationId: application.id,
        userId: savedUserId,
      });

      const res = await request(app)
        .get(`/api/applications/${application.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Application not found');
    });

    it('should return an application if found and belongs to authorized user', async () => {
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

  describe('PUT /applications/:applicationId/updateStatus', () => {
    let application: IApplication;

    const multipleInterviews = [
      {
        type: [InterviewType.CRITICAL_THINKING, InterviewType.DEBUGGING],
        interviewOnDate: new Date(),
      },
      {
        type: [InterviewType.PRACTICAL_CODING, InterviewType.TRIVIA_CONCEPT],
        interviewOnDate: new Date(),
      },
      {
        type: [InterviewType.OVERALL_BEHAVIORAL],
        interviewOnDate: new Date(),
        status: InterviewStatus.PASSED,
      },
    ];

    beforeEach(async () => {
      application = await ApplicationRepository.createApplication({
        jobPostingId: getNewMongoId(),
        userId: savedUserId,
      });
    });

    it('should return error message with 400 status code if applicationId param is invalid', async () => {
      const res = await request(app)
        .put('/api/applications/123456789/updateStatus')
        .send({ updatedStatus: 'OFFERED' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Invalid application ID format');
    });

    it('should return error message with 400 status code if attempting to update other fields other than status', async () => {
      const validApplicationId = getNewMongoId();
      const res = await request(app)
        .put(`/api/applications/${validApplicationId}/updateStatus`)
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
        .put(`/api/applications/${validApplicationId}/updateStatus`)
        .send({ updatedStatus: 'INVALID_STATUS' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Invalid application status');
    });

    it('should return error message with 404 status code if application is not found or does not belong to authorized user', async () => {
      const invalidApplicationId = getNewMongoId();
      const res = await request(app)
        .put(`/api/applications/${invalidApplicationId}/updateStatus`)
        .send({ updatedStatus: 'OFFERED' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Application not found');
    });

    it('should return error message with 404 status code if trying to update the status of a soft-deleted application', async () => {
      await ApplicationRepository.deleteApplicationById({
        applicationId: application.id,
        userId: savedUserId,
      });

      const res = await request(app)
        .put(`/api/applications/${application.id}/updateStatus`)
        .send({ updatedStatus: 'OFFERED' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Application not found');
    });

    it('should update the application status to REJECTED and should return the updated application, when application does not have interviews', async () => {
      const res = await request(app)
        .put(`/api/applications/${application.id}/updateStatus`)
        .send({ updatedStatus: 'REJECTED' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.have.property('_id', application.id);
      expect(res.body.data).to.have.property('status', 'REJECTED');
    });

    it('should update the application status to REJECTED, and update all pending interviews status to FAILED. All non-pending interviews status should not be affected. Should return the updated application', async () => {
      const [pendingInterview1, pendingInterview2, nonPendingInterview] =
        await Promise.all(
          multipleInterviews.map((interview) =>
            InterviewRepository.createInterview({
              ...interview,
              applicationId: application.id,
              userId: savedUserId,
            })
          )
        );

      const res = await request(app)
        .put(`/api/applications/${application.id}/updateStatus`)
        .send({ updatedStatus: 'REJECTED' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.have.property('_id', application.id);
      expect(res.body.data).to.have.property('status', 'REJECTED');

      const interviews = await InterviewRepository.getInterviews({
        userId: savedUserId,
        filters: {
          applicationId: application.id,
          status: InterviewStatus.FAILED,
        },
      });
      expect(interviews).to.be.an('array').that.have.lengthOf(2);
      expect(interviews.map((interview) => interview.id)).to.have.members([
        pendingInterview1?.id,
        pendingInterview2?.id,
      ]);

      const interview = await InterviewRepository.getInterviewById({
        interviewId: nonPendingInterview?.id,
        userId: savedUserId,
      });
      assert(interview);
      expect(interview.status).to.equal(InterviewStatus.PASSED);
    });

    it('should update the application status to a valid non-REJECTED status and return the updated application. Also associated interviews status should not be affected', async () => {
      const res = await request(app)
        .put(`/api/applications/${application.id}/updateStatus`)
        .send({ updatedStatus: 'OFFERED' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.have.property('_id', application.id);
      expect(res.body.data).to.have.property('status', 'OFFERED');
    });
  });

  describe('PUT /applications/:applicationId', () => {
    let application: IApplication;

    beforeEach(async () => {
      application = await ApplicationRepository.createApplication({
        jobPostingId: getNewMongoId(),
        userId: savedUserId,
      });
    });

    it('should return error message with 400 status code if applicationId param is invalid', async () => {
      const res = await request(app)
        .put('/api/applications/123456789')
        .send({ note: 'Updated note' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Invalid application ID format');
    });

    it('should return error message with 400 status code if trying to update status', async () => {
      const res = await request(app)
        .put(`/api/applications/${application.id}`)
        .send({ status: 'OFFERED' })
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
        .put(`/api/applications/${application.id}`)
        .send({ interest: 'VERY_HIGH' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Invalid interest level');
    });

    it('should return error message with 404 status code if application is not found or does not belong to authorized user', async () => {
      const invalidApplicationId = getNewMongoId();
      const res = await request(app)
        .put(`/api/applications/${invalidApplicationId}`)
        .send({ note: 'Updated note' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Application not found');
    });

    it('should return error message with 404 status code if trying to update metadata of a soft-deleted application', async () => {
      await ApplicationRepository.deleteApplicationById({
        applicationId: application.id,
        userId: savedUserId,
      });

      const res = await request(app)
        .put(`/api/applications/${application.id}`)
        .send({ note: 'Updated note' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Application not found');
    });

    it('should update the application metadata and return the updated application', async () => {
      const updateApplicationMetadata = {
        note: 'Updated note',
        referrer: 'Khoa',
        portalLink: 'http://abc.com',
        interest: 'HIGH',
      };

      const res = await request(app)
        .put(`/api/applications/${application.id}`)
        .send({
          note: 'Updated note',
          referrer: 'Khoa',
          portalLink: 'http://abc.com',
          interest: 'HIGH',
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.containSubset(updateApplicationMetadata);
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

    it('should return error message with 404 status code if trying to delete an already soft-deleted application', async () => {
      await ApplicationRepository.deleteApplicationById({
        applicationId: application.id,
        userId: savedUserId,
      });

      const res = await request(app)
        .delete(`/api/applications/${application.id}`)
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

  describe('GET /applications/count-by-status', () => {
    const updatedStatus = [
      ApplicationStatus.SUBMITTED,
      ApplicationStatus.WITHDRAWN,
      ApplicationStatus.OFFERED,
      ApplicationStatus.OFFERED,
      ApplicationStatus.REJECTED,
    ] as const;

    it('should return correct counts grouped by status for the authorized user', async () => {
      const applications = await Promise.all(
        R.times(updatedStatus.length, () =>
          ApplicationRepository.createApplication({
            jobPostingId: getNewMongoId(),
            userId: savedUserId,
          })
        )
      );
      await Promise.all(
        R.zip(applications, updatedStatus).map(([application, status]) =>
          ApplicationRepository.updateApplicationById({
            userId: savedUserId,
            applicationId: application.id,
            updatedMetadata: {
              status,
            },
          })
        )
      );
      const res = await request(app)
        .get('/api/applications/count-by-status')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.deep.equal({
        [ApplicationStatus.SUBMITTED]: 1,
        [ApplicationStatus.WITHDRAWN]: 1,
        [ApplicationStatus.OFFERED]: 2,
        [ApplicationStatus.REJECTED]: 1,
        [ApplicationStatus.INTERVIEWING]: 0,
        [ApplicationStatus.OA]: 0,
      });
    });

    it('should return an object with all application status count of 0 if no applications exist for the user', async () => {
      const res = await request(app)
        .get('/api/applications/count-by-status')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.deep.equal({
        [ApplicationStatus.SUBMITTED]: 0,
        [ApplicationStatus.WITHDRAWN]: 0,
        [ApplicationStatus.OFFERED]: 0,
        [ApplicationStatus.REJECTED]: 0,
        [ApplicationStatus.INTERVIEWING]: 0,
        [ApplicationStatus.OA]: 0,
      });
    });

    it('should exclude soft-deleted applications from the count', async () => {
      await ApplicationRepository.createApplication({
        jobPostingId: getNewMongoId(),
        userId: savedUserId,
      });
      const applicationToDelete = await ApplicationRepository.createApplication(
        {
          jobPostingId: getNewMongoId(),
          userId: savedUserId,
        }
      );
      await ApplicationRepository.deleteApplicationById({
        applicationId: applicationToDelete.id,
        userId: savedUserId,
      });

      const res = await request(app)
        .get('/api/applications/count-by-status')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.deep.equal({
        [ApplicationStatus.SUBMITTED]: 1,
        [ApplicationStatus.WITHDRAWN]: 0,
        [ApplicationStatus.OFFERED]: 0,
        [ApplicationStatus.REJECTED]: 0,
        [ApplicationStatus.INTERVIEWING]: 0,
        [ApplicationStatus.OA]: 0,
      });
    });
  });
});
