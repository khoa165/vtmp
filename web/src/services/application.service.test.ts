import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import assert from 'assert';
import { differenceInSeconds } from 'date-fns';

import { ApplicationRepository } from '@/repositories/application.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { ApplicationService } from '@/services/application.service';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { ResourceNotFoundError, DuplicateResourceError } from '@/utils/errors';
import { ApplicationStatus } from '@/types/enums';
import {
  getNewMongoId,
  getNewObjectId,
  toMongoId,
} from '@/testutils/mongoID.testutil';

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
      const timeDiff = differenceInSeconds(
        new Date(),
        newApplication.appliedOnDate
      );

      assert(newApplication);
      expect(newApplication.jobPostingId.toString()).to.equal(
        mockApplication.jobPostingId
      );
      expect(newApplication.userId.toString()).to.equal(mockApplication.userId);
      expect(newApplication.hasApplied).to.equal(true);
      expect(newApplication.status).to.equal(ApplicationStatus.SUBMITTED);
      expect(timeDiff).to.lessThan(3);
    });
  });

  describe('getAllApplications', () => {
    it('should only return applications associated with a userId', async () => {
      const mockApplicationId_A0 = (
        await ApplicationRepository.createApplication(mockApplication_A0)
      ).id;
      const mockApplicationId_A1 = (
        await ApplicationRepository.createApplication(mockApplication_A1)
      ).id;
      await ApplicationRepository.createApplication(mockApplication_B);
      const applications =
        await ApplicationService.getAllApplications(userId_A);

      assert(applications);
      expect(applications).to.be.an('array').that.have.lengthOf(2);
      expect(applications.map((application) => application.id)).to.have.members(
        [mockApplicationId_A0, mockApplicationId_A1]
      );
    });

    it('should return no application if authenticated user has no application', async () => {
      const applications =
        await ApplicationService.getAllApplications(userId_A);

      assert(applications);
      expect(applications).to.be.an('array').that.have.lengthOf(0);
    });
  });

  describe('getOneApplication', () => {
    it('should throw an error if no application is associated with the authenticated user', async () => {
      const mockApplicationId_B = (
        await ApplicationRepository.createApplication(mockApplication_B)
      ).id;

      await expect(
        ApplicationService.getOneApplication({
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
        ApplicationService.getOneApplication({
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
      const application = await ApplicationService.getOneApplication({
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
});
