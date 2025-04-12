import { expect } from 'chai';
import assert from 'assert';
import { differenceInSeconds } from 'date-fns';

import { ApplicationRepository } from './application.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { ApplicationStatus, InterestLevel } from '@/types/enums';
import { getNewMongoId, toMongoId } from '@/testutils/mongoID.testutil';

describe('ApplicationRepository', () => {
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

  describe('createApplication', () => {
    it('should create a new application successfully', async () => {
      const newApplication =
        await ApplicationRepository.createApplication(mockApplication_B);
      const timeDiff = differenceInSeconds(
        new Date(),
        newApplication.appliedOnDate
      );

      assert(newApplication);
      expect(newApplication.jobPostingId.toString()).to.equal(
        mockApplication_B.jobPostingId
      );
      expect(newApplication.userId.toString()).to.equal(
        mockApplication_B.userId
      );
      expect(newApplication.hasApplied).to.equal(true);
      expect(newApplication.status).to.equal(ApplicationStatus.SUBMITTED);
      expect(timeDiff).to.lessThan(3);
    });
  });

  describe('getApplicationIfExists', () => {
    it('should return an application if an application with certain jobPostingId and userId already exists', async () => {
      await ApplicationRepository.createApplication(mockApplication_B);
      const application =
        await ApplicationRepository.getApplicationIfExists(mockApplication_B);

      assert(application);
      expect(application).to.containSubset({
        jobPostingId: toMongoId(mockApplication_B.jobPostingId),
        userId: toMongoId(mockApplication_B.userId),
      });
    });

    it('should return null if an application with certain jobPostingId and userId does not exist', async () => {
      const application =
        await ApplicationRepository.getApplicationIfExists(mockApplication_B);

      assert(!application);
    });
  });

  describe('getApplications', () => {
    it('should return only applications associated with given userId', async () => {
      await ApplicationRepository.createApplication(mockApplication_A0);
      await ApplicationRepository.createApplication(mockApplication_A1);
      await ApplicationRepository.createApplication(mockApplication_B);
      const applications =
        await ApplicationRepository.getApplications(userId_A);

      assert(applications);
      expect(applications).to.be.an('array').that.have.lengthOf(2);
      expect(applications[0]).to.containSubset({
        jobPostingId: toMongoId(mockApplication_A0.jobPostingId),
        userId: toMongoId(mockApplication_A0.userId),
      });
      expect(applications[1]).to.containSubset({
        jobPostingId: toMongoId(mockApplication_A1.jobPostingId),
        userId: toMongoId(mockApplication_A1.userId),
      });
    });

    it('should exclude soft-deleted application from list of returned application', async () => {
      await ApplicationRepository.createApplication(mockApplication_A0);
      const mockApplicationId_A1 = (
        await ApplicationRepository.createApplication(mockApplication_A1)
      ).id;
      await ApplicationRepository.deleteApplicationById({
        userId: userId_A,
        applicationId: mockApplicationId_A1,
      });
      const applications =
        await ApplicationRepository.getApplications(userId_A);

      assert(applications);
      expect(applications).to.be.an('array').that.have.lengthOf(1);
      expect(applications[0]).to.containSubset({
        jobPostingId: toMongoId(mockApplication_A0.jobPostingId),
        userId: toMongoId(mockApplication_A0.userId),
      });
    });

    it('should return an empty array if no applications found for userId', async () => {
      await ApplicationRepository.createApplication(mockApplication_B);
      const applications =
        await ApplicationRepository.getApplications(userId_A);

      assert(applications);
      expect(applications).to.be.an('array').that.have.lengthOf(0);
    });
  });

  describe('getApplicationById', () => {
    it('should return null if the application does not belong to the authorized user', async () => {
      const mockApplicationId_B = (
        await ApplicationRepository.createApplication(mockApplication_B)
      ).id;
      const application = await ApplicationRepository.getApplicationById({
        applicationId: mockApplicationId_B,
        userId: userId_A,
      });

      assert(!application);
    });

    it('should return null if trying to get soft-deleted application', async () => {
      const mockApplicationId_B = (
        await ApplicationRepository.createApplication(mockApplication_B)
      ).id;
      await ApplicationRepository.deleteApplicationById({
        userId: userId_B,
        applicationId: mockApplicationId_B,
      });
      const foundApplication = await ApplicationRepository.getApplicationById({
        applicationId: mockApplicationId_B,
        userId: userId_B,
      });

      assert(!foundApplication);
    });

    it('should return an application if there exists an application for authorized user', async () => {
      await ApplicationRepository.createApplication(mockApplication_A0);
      await ApplicationRepository.createApplication(mockApplication_B);
      const mockApplicationId_A1 = (
        await ApplicationRepository.createApplication(mockApplication_A1)
      ).id;
      const application = await ApplicationRepository.getApplicationById({
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
    it('should return null if application does not exist', async () => {
      const updatedApplication =
        await ApplicationRepository.updateApplicationById({
          userId: userId_A,
          applicationId: getNewMongoId(),
          updatedMetadata: {},
        });

      assert(!updatedApplication);
    });

    it('should return null if trying to update metadata of a soft-deleted application', async () => {
      const mockApplicationId_B = (
        await ApplicationRepository.createApplication(mockApplication_B)
      ).id;
      await ApplicationRepository.deleteApplicationById({
        userId: userId_B,
        applicationId: mockApplicationId_B,
      });
      const updatedApplication =
        await ApplicationRepository.updateApplicationById({
          userId: userId_A,
          applicationId: getNewMongoId(),
          updatedMetadata: {},
        });

      assert(!updatedApplication);
    });

    it('should return updated application with new metadata if application found', async () => {
      const mockApplicationId_B = (
        await ApplicationRepository.createApplication(mockApplication_B)
      ).id;
      const updatedApplication =
        await ApplicationRepository.updateApplicationById({
          userId: userId_B,
          applicationId: mockApplicationId_B,
          updatedMetadata: {
            status: ApplicationStatus.OFFER,
            note: 'note about this application',
            referrer: 'Khoa',
            portalLink: 'abc.com',
            interest: InterestLevel.HIGH,
          },
        });

      assert(updatedApplication);
      expect(updatedApplication.status).to.be.equal(ApplicationStatus.OFFER);
      expect(updatedApplication.referrer).to.be.equal('Khoa');
      expect(updatedApplication.interest).to.be.equal(InterestLevel.HIGH);
      expect(updatedApplication.portalLink).to.be.equal('abc.com');
      expect(updatedApplication.note).to.be.equal(
        'note about this application'
      );
    });

    it('should return updated application with deletedAt reset to null', async () => {
      const mockApplicationId_B = (
        await ApplicationRepository.createApplication(mockApplication_B)
      ).id;
      const softDeletedApp = await ApplicationRepository.deleteApplicationById({
        userId: userId_B,
        applicationId: mockApplicationId_B,
      });
      assert(softDeletedApp);
      assert(softDeletedApp.deletedAt);

      const resetApp = await ApplicationRepository.updateApplicationById({
        userId: userId_B,
        applicationId: mockApplicationId_B,
        updatedMetadata: { deletedAt: null },
        options: { includeDeletedDoc: true },
      });
      assert(resetApp);
      assert(!resetApp.deletedAt);
    });
  });

  describe('deleteApplicationById', () => {
    it('should return null if application does not exist', async () => {
      const deletedApplication =
        await ApplicationRepository.deleteApplicationById({
          userId: userId_A,
          applicationId: getNewMongoId(),
        });

      assert(!deletedApplication);
    });

    it('should return null if trying to delete an already soft-deleted application', async () => {
      const mockApplicationId_B = (
        await ApplicationRepository.createApplication(mockApplication_B)
      ).id;
      await ApplicationRepository.deleteApplicationById({
        userId: userId_B,
        applicationId: mockApplicationId_B,
      });
      const deletedApplication =
        await ApplicationRepository.deleteApplicationById({
          userId: userId_B,
          applicationId: mockApplicationId_B,
        });

      assert(!deletedApplication);
    });

    it('should soft delete application and return deleted application object with deletedAt field set', async () => {
      const mockApplicationId_B = (
        await ApplicationRepository.createApplication(mockApplication_B)
      ).id;
      const deletedApplication =
        await ApplicationRepository.deleteApplicationById({
          userId: userId_B,
          applicationId: mockApplicationId_B,
        });

      assert(deletedApplication);
      assert(deletedApplication.deletedAt);
      const timeDiff = differenceInSeconds(
        new Date(),
        deletedApplication.deletedAt
      );
      expect(timeDiff).to.lessThan(3);

      const foundApplication = await ApplicationRepository.getApplicationById({
        applicationId: mockApplicationId_B,
        userId: userId_B,
      });
      assert(!foundApplication);
    });
  });
});
