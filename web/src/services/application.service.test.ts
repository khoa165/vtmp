import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import assert from 'assert';
import { differenceInSeconds } from 'date-fns';

import { ApplicationRepository } from '@/repositories/application.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { ApplicationService } from '@/services/application.service';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { ResourceNotFoundError, DuplicateResourceError } from '@/utils/errors';
import {
  ApplicationStatus,
  InterestLevel,
  InterviewStatus,
  InterviewType,
} from '@common/enums';
import {
  getNewMongoId,
  getNewObjectId,
  toMongoId,
} from '@/testutils/mongoID.testutil';
import { InterviewRepository } from '@/repositories/interview.repository';
import sinon from 'sinon';
import { IApplication } from '@/models/application.model';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('ApplicationService', () => {
  useMongoDB();

  const userId_A = getNewMongoId();
  const userId_B = getNewMongoId();

  const mockApplication_A0 = {
    jobPostingId: getNewMongoId(),
    userId: userId_A,
  };
  const mockApplication_A1 = {
    jobPostingId: getNewMongoId(),
    userId: userId_A,
  };
  const mockApplication_B = {
    jobPostingId: getNewMongoId(),
    userId: userId_B,
  };

  const mockJobPosting = {
    linkId: getNewObjectId(),
    url: 'vtmp.com',
    jobTitle: 'SWE',
    companyName: 'Apple',
    submittedBy: getNewObjectId(),
  };

  describe('createApplication', () => {
    it('should throw error if job posting does not exist', async () => {
      const mockApplication = {
        jobPostingId: getNewMongoId(),
        userId: getNewMongoId(),
      };

      await expect(
        ApplicationService.createApplication(mockApplication)
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should throw error if an application associated with this job posting and user already exist', async () => {
      const newJobPosting =
        await JobPostingRepository.createJobPosting(mockJobPosting);
      const mockApplication = {
        jobPostingId: newJobPosting.id,
        userId: getNewMongoId(),
      };
      await ApplicationRepository.createApplication(mockApplication);

      await expect(
        ApplicationService.createApplication(mockApplication)
      ).eventually.rejectedWith(DuplicateResourceError);
    });

    it('should create an application successfully', async () => {
      const newJobPosting =
        await JobPostingRepository.createJobPosting(mockJobPosting);
      const mockApplication = {
        jobPostingId: newJobPosting.id,
        userId: getNewMongoId(),
      };

      await expect(ApplicationService.createApplication(mockApplication))
        .eventually.fulfilled;
    });

    it('should create an application successfully and return valid new application', async () => {
      const newJobPosting =
        await JobPostingRepository.createJobPosting(mockJobPosting);
      const mockApplication = {
        jobPostingId: newJobPosting.id,
        userId: getNewMongoId(),
      };
      const newApplication =
        await ApplicationService.createApplication(mockApplication);
      assert(newApplication);
      const timeDiff = differenceInSeconds(
        new Date(),
        newApplication.appliedOnDate
      );

      expect(newApplication.jobPostingId.toString()).to.equal(
        mockApplication.jobPostingId
      );
      expect(newApplication.userId.toString()).to.equal(mockApplication.userId);
      expect(newApplication.hasApplied).to.equal(true);
      expect(newApplication.status).to.equal(ApplicationStatus.SUBMITTED);
      expect(timeDiff).to.lessThan(3);
    });
  });

  describe('getApplications', () => {
    it('should only return applications associated with a userId', async () => {
      const mockApplicationId_A0 = (
        await ApplicationRepository.createApplication(mockApplication_A0)
      ).id;
      const mockApplicationId_A1 = (
        await ApplicationRepository.createApplication(mockApplication_A1)
      ).id;
      await ApplicationRepository.createApplication(mockApplication_B);
      const applications = await ApplicationService.getApplications(userId_A);

      assert(applications);
      expect(applications).to.be.an('array').that.have.lengthOf(2);
      expect(applications.map((application) => application.id)).to.have.members(
        [mockApplicationId_A0, mockApplicationId_A1]
      );
    });

    it('should return no application if authenticated user has no application', async () => {
      const applications = await ApplicationService.getApplications(userId_A);

      assert(applications);
      expect(applications).to.be.an('array').that.have.lengthOf(0);
    });
  });

  describe('getApplicationById', () => {
    it('should throw an error if no application is associated with the authenticated user', async () => {
      const mockApplicationId_B = (
        await ApplicationRepository.createApplication(mockApplication_B)
      ).id;

      await expect(
        ApplicationService.getApplicationById({
          applicationId: mockApplicationId_B,
          userId: userId_A,
        })
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should not throw an error when an application associated with the authenticated user is found', async () => {
      const mockApplicationId_A1 = (
        await ApplicationRepository.createApplication(mockApplication_A1)
      ).id;

      await expect(
        ApplicationService.getApplicationById({
          applicationId: mockApplicationId_A1,
          userId: userId_A,
        })
      ).eventually.fulfilled;
    });

    it('should only return application associated with an applicationId and a userId', async () => {
      await ApplicationRepository.createApplication(mockApplication_A0);
      await ApplicationRepository.createApplication(mockApplication_B);
      const mockApplicationId_A1 = (
        await ApplicationRepository.createApplication(mockApplication_A1)
      ).id;
      const application = await ApplicationService.getApplicationById({
        applicationId: mockApplicationId_A1,
        userId: userId_A,
      });

      assert(application);
      expect(application).to.containSubset({
        jobPostingId: toMongoId(mockApplication_A1.jobPostingId),
        userId: toMongoId(mockApplication_A1.userId),
      });
    });
  });

  describe('updateApplicationById', () => {
    let application_A0: IApplication;
    let application_B: IApplication;
    beforeEach(async () => {
      application_A0 =
        await ApplicationRepository.createApplication(mockApplication_A0);
      application_B =
        await ApplicationRepository.createApplication(mockApplication_B);
    });

    it('should throw an error if no application is associated with the authenticated user is found', async () => {
      await expect(
        ApplicationService.updateApplicationById({
          applicationId: application_B.id,
          userId: userId_A,
          updatedMetadata: {},
        })
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should not throw an error when update an application successfully', async () => {
      await expect(
        ApplicationService.updateApplicationById({
          applicationId: application_A0.id,
          userId: userId_A,
          updatedMetadata: {
            note: 'application note',
            referrer: 'Khoa',
            portalLink: 'abc.com',
            interest: InterestLevel.HIGH,
            status: ApplicationStatus.OFFER,
          },
        })
      ).eventually.fulfilled;
    });

    it('should update application successfully and return updated application', async () => {
      const updatedApplication = await ApplicationService.updateApplicationById(
        {
          applicationId: application_A0.id,
          userId: userId_A,
          updatedMetadata: {
            note: 'application note',
            referrer: 'Khoa',
            portalLink: 'abc.com',
            interest: InterestLevel.HIGH,
            status: ApplicationStatus.OFFER,
          },
        }
      );

      assert(updatedApplication);
      expect(updatedApplication.note).to.equal('application note');
      expect(updatedApplication.referrer).to.equal('Khoa');
      expect(updatedApplication.portalLink).to.equal('abc.com');
      expect(updatedApplication.interest).to.equal(InterestLevel.HIGH);
      expect(updatedApplication.status).to.equal(ApplicationStatus.OFFER);
    });
  });

  describe('markApplicationAsRejected', () => {
    it('should throw an error if no application is associated with the authenticated user', async () => {
      await ApplicationRepository.createApplication(mockApplication_A0);
      const application_B =
        await ApplicationRepository.createApplication(mockApplication_B);

      await expect(
        ApplicationService.markApplicationAsRejected({
          applicationId: application_B.id,
          userId: userId_A,
        })
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should not throw an error when transaction ended successfully when application has pending interview', async () => {
      const application_A0 =
        await ApplicationRepository.createApplication(mockApplication_A0);
      // Create pending interviews for the application
      await InterviewRepository.createInterview({
        applicationId: application_A0.id,
        userId: userId_A,
        type: [InterviewType.CRITICAL_THINKING, InterviewType.DEBUGGING],
        interviewOnDate: new Date(),
      });

      await expect(
        ApplicationService.markApplicationAsRejected({
          applicationId: application_A0.id,
          userId: userId_A,
        })
      ).eventually.fulfilled;
    });

    it('should not throw an error when transaction ended successfully when application has no pending interview', async () => {
      const application_A0 =
        await ApplicationRepository.createApplication(mockApplication_A0);
      // Create non-pending interviews for the application
      await InterviewRepository.createInterview({
        applicationId: application_A0.id,
        userId: userId_A,
        type: [InterviewType.CRITICAL_THINKING, InterviewType.DEBUGGING],
        interviewOnDate: new Date(),
        status: InterviewStatus.UPCOMING,
      });

      await expect(
        ApplicationService.markApplicationAsRejected({
          applicationId: application_A0.id,
          userId: userId_A,
        })
      ).eventually.fulfilled;
    });

    it('should return updated application, after successfully updating application (which has no interviews) status to REJECTED.', async () => {
      const application_A0 =
        await ApplicationRepository.createApplication(mockApplication_A0);
      const updatedApplication =
        await ApplicationService.markApplicationAsRejected({
          applicationId: application_A0.id,
          userId: userId_A,
        });

      assert(updatedApplication);
      expect(updatedApplication.status).to.equal(ApplicationStatus.REJECTED);
    });

    it('should return updated application, after successfully updating application status to REJECTED. Should not update interviews if no PENDING interviews exist', async () => {
      const application_A0 =
        await ApplicationRepository.createApplication(mockApplication_A0);
      // Create 1 non-pending interview for the application
      const nonPendingInterview = await InterviewRepository.createInterview({
        applicationId: application_A0.id,
        userId: userId_A,
        type: [InterviewType.CRITICAL_THINKING, InterviewType.DEBUGGING],
        interviewOnDate: new Date(),
        status: InterviewStatus.PASSED,
      });

      const updatedApplication =
        await ApplicationService.markApplicationAsRejected({
          applicationId: application_A0.id,
          userId: userId_A,
        });
      assert(updatedApplication);
      expect(updatedApplication.status).to.equal(ApplicationStatus.REJECTED);

      // Ensure the original interview were not updated to FAILED
      const updatedInterviews =
        await InterviewRepository.getInterviewsByApplicatonId({
          applicationId: application_A0.id,
          userId: userId_A,
          filters: { status: InterviewStatus.FAILED },
        });
      expect(updatedInterviews).to.be.an('array').that.have.lengthOf(0);

      // Ensure the original interview still have status UPCOMING
      const interview = await InterviewRepository.getInterviewById({
        interviewId: nonPendingInterview.id,
        userId: userId_A,
      });
      assert(interview);
      expect(interview.status).to.not.equal(InterviewStatus.FAILED);
      expect(interview.status).to.equal(InterviewStatus.PASSED);
    });

    it('should only update PENDING interviews to FAILED, and leave other interviews status unchanged. Should return updated application with REJECTED status', async () => {
      const application_A0 =
        await ApplicationRepository.createApplication(mockApplication_A0);
      // Create pending 2 interviews and 1 non-pending interview for the application
      const nonPendingInterview = await InterviewRepository.createInterview({
        applicationId: application_A0.id,
        userId: userId_A,
        type: [InterviewType.CODE_REVIEW, InterviewType.SYSTEM_DESIGN],
        interviewOnDate: new Date(),
        status: InterviewStatus.PASSED,
      });
      const pendingInterview1 = await InterviewRepository.createInterview({
        applicationId: application_A0.id,
        userId: userId_A,
        type: [InterviewType.CRITICAL_THINKING, InterviewType.DEBUGGING],
        interviewOnDate: new Date(),
      });
      const pendingInterview2 = await InterviewRepository.createInterview({
        applicationId: application_A0.id,
        userId: userId_A,
        type: [InterviewType.PROJECT_WALKTHROUGH],
        interviewOnDate: new Date(),
      });
      const pendingInterviews =
        await InterviewRepository.getInterviewsByApplicatonId({
          applicationId: application_A0.id,
          userId: userId_A,
          filters: { status: InterviewStatus.PENDING },
        });
      expect(pendingInterviews).to.be.an('array').that.have.lengthOf(2);

      const updatedApplication =
        await ApplicationService.markApplicationAsRejected({
          applicationId: application_A0.id,
          userId: userId_A,
        });
      assert(updatedApplication);
      expect(updatedApplication.status).to.equal(ApplicationStatus.REJECTED);

      // Ensure only PENDING interviews were updated to FAILED status
      const failedInterviews =
        await InterviewRepository.getInterviewsByApplicatonId({
          applicationId: application_A0.id,
          userId: userId_A,
          filters: { status: InterviewStatus.FAILED },
        });
      assert(failedInterviews);
      expect(failedInterviews).to.be.an('array').that.have.lengthOf(2);
      expect(failedInterviews.map((interview) => interview.id)).to.have.members(
        [pendingInterview1.id, pendingInterview2.id]
      );

      // Ensure other non-pending interview were not updated to FAILED status
      const interview = await InterviewRepository.getInterviewById({
        interviewId: nonPendingInterview.id,
        userId: userId_A,
      });
      assert(interview);
      expect(interview.status).to.equal(InterviewStatus.PASSED);
    });

    it('should roll back the transaction if an error occurs', async () => {
      const application_A0 =
        await ApplicationRepository.createApplication(mockApplication_A0);
      // Create 1 pending interview for the application
      const pendingInterview1 = await InterviewRepository.createInterview({
        applicationId: application_A0.id,
        userId: userId_A,
        type: [InterviewType.CRITICAL_THINKING, InterviewType.DEBUGGING],
        interviewOnDate: new Date(),
      });

      // Stub updateInterviewsWithStatus to throw an error
      sinon
        .stub(InterviewRepository, 'updateInterviewsWithStatus')
        .throws(new Error('Simulated transaction failure'));

      // Expect service call to throw error
      await expect(
        ApplicationService.markApplicationAsRejected({
          applicationId: application_A0.id,
          userId: userId_A,
        })
      ).eventually.rejectedWith(Error, 'Simulated transaction failure');

      // Verify that the application status was not updated to REJECTED
      const updatedApplication = await ApplicationRepository.getApplicationById(
        {
          applicationId: application_A0.id,
          userId: userId_A,
        }
      );
      assert(updatedApplication);
      expect(updatedApplication.status).to.not.equal(
        ApplicationStatus.REJECTED
      );
      expect(updatedApplication.status).to.equal(ApplicationStatus.SUBMITTED);

      // Verify that the interview status was not updated to FAILED
      const updatedInterview = await InterviewRepository.getInterviewById({
        interviewId: pendingInterview1.id,
        userId: userId_A,
      });
      assert(updatedInterview);
      expect(updatedInterview.status).to.not.equal(InterviewStatus.FAILED);
      expect(updatedInterview.status).to.equal(InterviewStatus.PENDING);

      sinon.restore();
    });
  });

  describe('deleteApplicationById', () => {
    it('should throw an error if no application is associated with the authenticated user', async () => {
      await ApplicationRepository.createApplication(mockApplication_A0);
      const application_B =
        await ApplicationRepository.createApplication(mockApplication_B);

      await expect(
        ApplicationService.deleteApplicationById({
          applicationId: application_B.id,
          userId: userId_A,
        })
      ).eventually.rejectedWith(ResourceNotFoundError);
    });
  });
});
