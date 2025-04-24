import { expect } from 'chai';
import assert from 'assert';
import { differenceInSeconds } from 'date-fns';

import { ApplicationRepository } from '@/repositories/application.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { ApplicationService } from '@/services/application.service';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import {
  ResourceNotFoundError,
  DuplicateResourceError,
  ForbiddenError,
} from '@/utils/errors';
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
import { IApplication } from '@/models/application.model';
import { IJobPosting } from '@/models/job-posting.model';
import { useSandbox } from '@/testutils/sandbox.testutil';

describe('ApplicationService', () => {
  useMongoDB();
  const sandbox = useSandbox();

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
    let newJobPosting: IJobPosting | undefined;

    beforeEach(async () => {
      newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
    });

    it('should throw error if job posting does not exist', async () => {
      const mockApplication = {
        jobPostingId: getNewMongoId(),
        userId: getNewMongoId(),
      };

      await expect(
        ApplicationService.createApplication(mockApplication)
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should throw error if an application associated with this job posting and user already exist (but was not soft deleted)', async () => {
      assert(newJobPosting);
      const mockApplication = {
        jobPostingId: newJobPosting.id,
        userId: getNewMongoId(),
      };
      await ApplicationRepository.createApplication(mockApplication);

      await expect(
        ApplicationService.createApplication(mockApplication)
      ).eventually.rejectedWith(DuplicateResourceError);
    });

    it('should not throw an error if create an application successfully', async () => {
      assert(newJobPosting);
      const mockApplication = {
        jobPostingId: newJobPosting.id,
        userId: getNewMongoId(),
      };

      await expect(ApplicationService.createApplication(mockApplication))
        .eventually.fulfilled;
    });

    it('should not throw an error if trying to create an application with certain jobPostingId and userId but was soft-deleted', async () => {
      assert(newJobPosting);
      const mockApplication = {
        jobPostingId: newJobPosting.id,
        userId: userId_B,
      };
      const application =
        await ApplicationRepository.createApplication(mockApplication);
      await ApplicationRepository.deleteApplicationById({
        applicationId: application.id,
        userId: userId_B,
      });

      await expect(ApplicationService.createApplication(mockApplication))
        .eventually.fulfilled;
    });

    it('should restore a soft-deleted application if it already exists', async () => {
      assert(newJobPosting);
      const mockApplication = {
        jobPostingId: newJobPosting.id,
        userId: userId_B,
      };
      const application =
        await ApplicationRepository.createApplication(mockApplication);

      await ApplicationRepository.deleteApplicationById({
        applicationId: application.id,
        userId: userId_B,
      });

      const restoredApplication =
        await ApplicationService.createApplication(mockApplication);

      assert(restoredApplication);
      assert(!restoredApplication.deletedAt);
      expect(restoredApplication.id).to.equal(application.id);
    });

    it('should create an application successfully and return valid new application', async () => {
      assert(newJobPosting);
      const mockApplication = {
        jobPostingId: newJobPosting.id,
        userId: userId_B,
      };
      const application =
        await ApplicationService.createApplication(mockApplication);
      assert(application);
      const timeDiff = differenceInSeconds(
        new Date(),
        application.appliedOnDate
      );

      expect(application).to.containSubset({
        jobPostingId: toMongoId(mockApplication.jobPostingId),
        userId: toMongoId(mockApplication.userId),
        hasApplied: true,
        status: ApplicationStatus.SUBMITTED,
      });
      expect(timeDiff).to.lessThan(3);
    });
  });

  describe('getApplications', () => {
    it('should only return applications associated with a userId', async () => {
      const application_A0 =
        await ApplicationRepository.createApplication(mockApplication_A0);
      const application_A1 =
        await ApplicationRepository.createApplication(mockApplication_A1);
      await ApplicationRepository.createApplication(mockApplication_B);
      const applications = await ApplicationService.getApplications(userId_A);

      expect(applications).to.be.an('array').that.have.lengthOf(2);
      expect(applications.map((application) => application.id)).to.have.members(
        [application_A0.id, application_A1.id]
      );
    });

    it('should only return applications that was not soft deleted', async () => {
      const application_A0 =
        await ApplicationRepository.createApplication(mockApplication_A0);
      const application_A1 =
        await ApplicationRepository.createApplication(mockApplication_A1);
      await ApplicationRepository.createApplication(mockApplication_B);

      await ApplicationRepository.deleteApplicationById({
        applicationId: application_A1.id,
        userId: userId_A,
      });
      const applications = await ApplicationService.getApplications(userId_A);

      expect(applications).to.be.an('array').that.have.lengthOf(1);
      expect(applications[0]?.id).to.equal(application_A0.id);
    });

    it('should return no application if authorized user has no application', async () => {
      await ApplicationRepository.createApplication(mockApplication_B);
      const applications = await ApplicationService.getApplications(userId_A);

      expect(applications).to.be.an('array').that.have.lengthOf(0);
    });
  });

  describe('getApplicationById', () => {
    it('should throw an error if no application is associated with the authorized user', async () => {
      const application_B =
        await ApplicationRepository.createApplication(mockApplication_B);
      await expect(
        ApplicationService.getApplicationById({
          applicationId: application_B.id,
          userId: userId_A,
        })
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should throw an error if trying to get a soft deleted application', async () => {
      const application_B =
        await ApplicationRepository.createApplication(mockApplication_B);
      await ApplicationRepository.deleteApplicationById({
        applicationId: application_B.id,
        userId: userId_B,
      });

      await expect(
        ApplicationService.getApplicationById({
          applicationId: application_B.id,
          userId: userId_B,
        })
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should not throw an error when an application associated with the authorized user is found', async () => {
      const application_A1 =
        await ApplicationRepository.createApplication(mockApplication_A1);
      await expect(
        ApplicationService.getApplicationById({
          applicationId: application_A1.id,
          userId: userId_A,
        })
      ).eventually.fulfilled;
    });

    it('should only return application associated with an applicationId and a userId', async () => {
      await ApplicationRepository.createApplication(mockApplication_B);
      await ApplicationRepository.createApplication(mockApplication_A0);
      const application_A1 =
        await ApplicationRepository.createApplication(mockApplication_A1);
      const application = await ApplicationService.getApplicationById({
        applicationId: application_A1.id,
        userId: userId_A,
      });

      assert(application);
      expect(application).to.deep.include({
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

    it('should throw an error if no application is associated with the authorized user is found', async () => {
      await expect(
        ApplicationService.updateApplicationById({
          applicationId: application_B.id,
          userId: userId_A,
          updatedMetadata: {},
        })
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should throw an error if trying to update a soft deleted application', async () => {
      await ApplicationRepository.deleteApplicationById({
        applicationId: application_B.id,
        userId: userId_B,
      });
      await expect(
        ApplicationService.updateApplicationById({
          applicationId: application_B.id,
          userId: userId_B,
          updatedMetadata: {},
        })
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should not throw an error when updating an application successfully', async () => {
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

    it('should update application successfully and return the updated application', async () => {
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
      expect(updatedApplication).to.containSubset({
        note: 'application note',
        referrer: 'Khoa',
        portalLink: 'abc.com',
        interest: InterestLevel.HIGH,
        status: ApplicationStatus.OFFER,
      });
    });
  });

  describe('markApplicationAsRejected', () => {
    let application_A0: IApplication;

    const multipleInterviews = [
      {
        userId: userId_A,
        type: [InterviewType.CODE_REVIEW, InterviewType.SYSTEM_DESIGN],
        interviewOnDate: new Date(),
        status: InterviewStatus.PASSED,
      },
      {
        userId: userId_A,
        type: [InterviewType.CRITICAL_THINKING, InterviewType.DEBUGGING],
        interviewOnDate: new Date(),
      },
      {
        userId: userId_A,
        type: [InterviewType.PROJECT_WALKTHROUGH],
        interviewOnDate: new Date(),
      },
    ];

    beforeEach(async () => {
      application_A0 =
        await ApplicationRepository.createApplication(mockApplication_A0);
    });

    it('should throw an error if no application is associated with the authorized user', async () => {
      const application_B =
        await ApplicationRepository.createApplication(mockApplication_B);

      await expect(
        ApplicationService.markApplicationAsRejected({
          applicationId: application_B.id,
          userId: userId_A,
        })
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should throw an error if trying to reject a soft deleted application', async () => {
      const application_B =
        await ApplicationRepository.createApplication(mockApplication_B);
      await ApplicationRepository.deleteApplicationById({
        applicationId: application_B.id,
        userId: userId_B,
      });

      await expect(
        ApplicationService.markApplicationAsRejected({
          applicationId: application_B.id,
          userId: userId_B,
        })
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should not throw an error if rejecting an application successfully (application has pending interview)', async () => {
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

    it('should not throw an error if rejecting an application successfully (application does not have pending interview)', async () => {
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

    it('should return updated application, if rejecting an application successfully (application does not have any interview)', async () => {
      const updatedApplication =
        await ApplicationService.markApplicationAsRejected({
          applicationId: application_A0.id,
          userId: userId_A,
        });

      assert(updatedApplication);
      expect(updatedApplication.status).to.equal(ApplicationStatus.REJECTED);
    });

    it('should only update PENDING interviews to FAILED, and leave other interviews status unchanged. Should return updated application with REJECTED status', async () => {
      const [nonPendingInterview, pendingInterview1, pendingInterview2] =
        await Promise.all(
          multipleInterviews.map((interview) =>
            InterviewRepository.createInterview({
              ...interview,
              applicationId: application_A0.id,
            })
          )
        );
      const pendingInterviewsBefore = await InterviewRepository.getInterviews({
        userId: userId_A,
        filters: {
          applicationId: application_A0.id,
          status: InterviewStatus.PENDING,
        },
      });
      expect(pendingInterviewsBefore).to.be.an('array').that.have.lengthOf(2);

      const updatedApplication =
        await ApplicationService.markApplicationAsRejected({
          applicationId: application_A0.id,
          userId: userId_A,
        });
      assert(updatedApplication);
      expect(updatedApplication.status).to.equal(ApplicationStatus.REJECTED);

      const failedInterviews = await InterviewRepository.getInterviews({
        userId: userId_A,
        filters: {
          applicationId: application_A0.id,
          status: InterviewStatus.FAILED,
        },
      });
      expect(failedInterviews).to.be.an('array').that.have.lengthOf(2);
      expect(failedInterviews.map((interview) => interview.id)).to.have.members(
        [pendingInterview1?.id, pendingInterview2?.id]
      );

      const passedInterview = await InterviewRepository.getInterviewById({
        interviewId: nonPendingInterview?.id,
        userId: userId_A,
      });
      assert(passedInterview);
      expect(passedInterview.status).to.equal(InterviewStatus.PASSED);

      const pendingInterviewsAfter = await InterviewRepository.getInterviews({
        userId: userId_A,
        filters: {
          applicationId: application_A0.id,
          status: InterviewStatus.PENDING,
        },
      });
      expect(pendingInterviewsAfter).to.be.an('array').that.have.lengthOf(0);
    });

    it('should not reject the application and not update PENDING interview to FAILED if an error occurs during the transaction', async () => {
      const pendingInterview1 = await InterviewRepository.createInterview({
        applicationId: application_A0.id,
        userId: userId_A,
        type: [InterviewType.CRITICAL_THINKING, InterviewType.DEBUGGING],
        interviewOnDate: new Date(),
      });

      sandbox
        .stub(InterviewRepository, 'updateInterviewsWithStatus')
        .throws(new Error('Simulated transaction failure'));

      await expect(
        ApplicationService.markApplicationAsRejected({
          applicationId: application_A0.id,
          userId: userId_A,
        })
      ).eventually.rejectedWith(Error, 'Simulated transaction failure');

      const updatedApplication = await ApplicationRepository.getApplicationById(
        {
          applicationId: application_A0.id,
          userId: userId_A,
        }
      );
      assert(updatedApplication);
      expect(updatedApplication.status).to.equal(ApplicationStatus.SUBMITTED);

      const updatedInterview = await InterviewRepository.getInterviewById({
        interviewId: pendingInterview1.id,
        userId: userId_A,
      });
      assert(updatedInterview);
      expect(updatedInterview.status).to.equal(InterviewStatus.PENDING);
    });
  });

  describe('deleteApplicationById', () => {
    let application_A0: IApplication;
    let application_B: IApplication;
    beforeEach(async () => {
      application_A0 =
        await ApplicationRepository.createApplication(mockApplication_A0);
      application_B =
        await ApplicationRepository.createApplication(mockApplication_B);
    });

    it('should throw an error if no application is associated with the authorized user', async () => {
      await expect(
        ApplicationService.deleteApplicationById({
          applicationId: application_B.id,
          userId: userId_A,
        })
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should throw an error if trying to delete an already soft deleted application', async () => {
      await ApplicationRepository.deleteApplicationById({
        applicationId: application_B.id,
        userId: userId_B,
      });

      await expect(
        ApplicationService.deleteApplicationById({
          applicationId: application_B.id,
          userId: userId_B,
        })
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should throw an error if trying to delete an application that has interviews', async () => {
      // Create pending 2 interviews for application_A0
      await InterviewRepository.createInterview({
        applicationId: application_A0.id,
        userId: userId_A,
        type: [InterviewType.CODE_REVIEW, InterviewType.SYSTEM_DESIGN],
        interviewOnDate: new Date(),
        status: InterviewStatus.PASSED,
      });
      await InterviewRepository.createInterview({
        applicationId: application_A0.id,
        userId: userId_A,
        type: [InterviewType.CRITICAL_THINKING, InterviewType.DEBUGGING],
        interviewOnDate: new Date(),
      });

      await expect(
        ApplicationService.deleteApplicationById({
          applicationId: application_A0.id,
          userId: userId_A,
        })
      ).eventually.rejectedWith(ForbiddenError);
    });

    it('should not throw an error if deleting an application that has no interviews', async () => {
      await expect(
        ApplicationService.deleteApplicationById({
          applicationId: application_A0.id,
          userId: userId_A,
        })
      ).eventually.fulfilled;
    });

    it('should delete application that has no interviews successfully and return soft deleted application with deletedAt field set', async () => {
      const deletedApplication = await ApplicationService.deleteApplicationById(
        {
          applicationId: application_A0.id,
          userId: userId_A,
        }
      );

      assert(deletedApplication);
      assert(deletedApplication.deletedAt);
      const timeDiff = differenceInSeconds(
        new Date(),
        deletedApplication.deletedAt
      );
      expect(timeDiff).to.lessThan(3);

      const foundApplication = await ApplicationRepository.getApplicationById({
        applicationId: application_A0.id,
        userId: userId_A,
      });
      assert(!foundApplication);
    });
  });
});
