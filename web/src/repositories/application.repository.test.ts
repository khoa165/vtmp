import { expect } from 'chai';
import assert from 'assert';
import { differenceInSeconds } from 'date-fns';

import { ApplicationRepository } from './application.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { ApplicationStatus } from '@/types/enums';
import { getNewMongoId, toMongoId } from '@/testutils/mongoID.testutil';

describe.only('ApplicationRepository', () => {
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

  describe('doesApplicationExist', () => {
    it('should evaluate to true if an application already exists', async () => {
      await ApplicationRepository.createApplication(mockApplication_B);
      const result =
        await ApplicationRepository.doesApplicationExist(mockApplication_B);

      expect(result).to.equal(true);
    });

    it('should evaluate to false if an application does not exist', async () => {
      const result =
        await ApplicationRepository.doesApplicationExist(mockApplication_B);

      expect(result).to.equal(false);
    });
  });

  describe('findApplicationsByUserId', () => {
    it('should return only applications associated with given userId', async () => {
      await ApplicationRepository.createApplication(mockApplication_A0);
      await ApplicationRepository.createApplication(mockApplication_A1);
      await ApplicationRepository.createApplication(mockApplication_B);
      const applications =
        await ApplicationRepository.findApplicationsByUserId(userId_A);

      assert(applications);
      expect(applications).to.be.an('array');
      expect(applications).to.have.lengthOf(2);
      expect(applications[0]).to.containSubset({
        jobPostingId: toMongoId(mockApplication_A0.jobPostingId),
        userId: toMongoId(mockApplication_A0.userId),
      });
      expect(applications[1]).to.containSubset({
        jobPostingId: toMongoId(mockApplication_A1.jobPostingId),
        userId: toMongoId(mockApplication_A1.userId),
      });
    });

    it('should return an empty array if no applications found for userId', async () => {
      await ApplicationRepository.createApplication(mockApplication_B);
      const applications =
        await ApplicationRepository.findApplicationsByUserId(userId_A);

      assert(applications);
      expect(applications).to.be.an('array');
      expect(applications).to.have.lengthOf(0);
    });
  });

  describe('findApplicationByIdAndUserId', () => {
    it('should return no application if the application is not belong to the authenticated user', async () => {
      const mockApplicationId_B = (
        await ApplicationRepository.createApplication(mockApplication_B)
      ).id;
      const application =
        await ApplicationRepository.findApplicationByIdAndUserId({
          applicationId: mockApplicationId_B,
          userId: userId_A,
        });

      assert(!application);
    });

    it('should return an application if there exists an application for authenticated user', async () => {
      await ApplicationRepository.createApplication(mockApplication_A0);
      const mockApplicationId_A1 = (
        await ApplicationRepository.createApplication(mockApplication_A1)
      ).id;
      const application =
        await ApplicationRepository.findApplicationByIdAndUserId({
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
