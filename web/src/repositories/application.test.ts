import * as chai from 'chai';
import assert from 'assert';
import mongoose from 'mongoose';
import { differenceInSeconds } from 'date-fns';

import ApplicationRepository from './application.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { ApplicationStatus } from '@/types/enums';

const { expect } = chai;

describe('ApplicationRepository', () => {
  useMongoDB();

  const mockApplication = {
    jobPostingId: new mongoose.Types.ObjectId().toString(),
    userId: new mongoose.Types.ObjectId().toString(),
  };

  describe('createApplication', () => {
    it('should create a new application successfully', async () => {
      const newApplication = await ApplicationRepository.createApplication(
        mockApplication
      );
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

  describe('doesApplicationExist', () => {
    it('should evaluate to true if an application already exists', async () => {
      await ApplicationRepository.createApplication(mockApplication);
      const result = await ApplicationRepository.doesApplicationExist(
        mockApplication
      );

      expect(result).to.equal(true);
    });

    it('should evaluate to false if an application does not exist', async () => {
      const result = await ApplicationRepository.doesApplicationExist(
        mockApplication
      );

      expect(result).to.equal(false);
    });
  });

  describe('findApplicationsByUserId', () => {
    it('should return only applications associated with given userId', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const otherUserId = new mongoose.Types.ObjectId().toString();

      const mockApplication1 = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: userId,
      };
      const mockApplication2 = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: userId,
      };
      const mockApplication3 = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: otherUserId,
      };
      await ApplicationRepository.createApplication(mockApplication1);
      await ApplicationRepository.createApplication(mockApplication2);
      await ApplicationRepository.createApplication(mockApplication3);

      const applications = await ApplicationRepository.findApplicationsByUserId(
        userId
      );

      expect(applications).to.have.lengthOf(2);
      expect(applications[0]?.userId.toString()).to.equal(userId);
      expect(applications[1]?.userId.toString()).to.equal(userId);
    });

    it('should return an empty array if no applications found for userId', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const otherUserId = new mongoose.Types.ObjectId().toString();

      const mockApplication1 = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: otherUserId,
      };
      const mockApplication2 = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: otherUserId,
      };
      const mockApplication3 = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: otherUserId,
      };
      await ApplicationRepository.createApplication(mockApplication1);
      await ApplicationRepository.createApplication(mockApplication2);
      await ApplicationRepository.createApplication(mockApplication3);

      const applications = await ApplicationRepository.findApplicationsByUserId(
        userId
      );
      expect(applications).to.be.an('array').that.is.empty;
    });
  });

  describe('findApplicationsByIdAndUserId', () => {
    it('should return no application if the application is not belong to the authenticated user', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const otherUserId = new mongoose.Types.ObjectId().toString();

      const mockApplication1 = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: otherUserId,
      };
      const mockApplicationId1 = (
        await ApplicationRepository.createApplication(mockApplication1)
      ).id;

      const application =
        await ApplicationRepository.findApplicationByIdAndUserId({
          applicationId: mockApplicationId1,
          userId: userId,
        });

      expect(application).to.be.null;
    });

    it('should return an application if there exists an application for authenticated user', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const otherUserId = new mongoose.Types.ObjectId().toString();

      const mockApplication1 = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: otherUserId,
      };
      const mockApplication2 = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: userId,
      };

      const mockApplicationId1 = (
        await ApplicationRepository.createApplication(mockApplication1)
      ).id;
      const mockApplicationId2 = (
        await ApplicationRepository.createApplication(mockApplication2)
      ).id;

      const application =
        await ApplicationRepository.findApplicationByIdAndUserId({
          applicationId: mockApplicationId2,
          userId: userId,
        });

      expect(application).to.not.be.null;
      expect(application?.userId.toString()).to.equal(userId);
      expect(application?.id.toString()).to.equal(mockApplicationId2);
      expect(application?.id.toString()).not.to.equal(mockApplicationId1);
    });
  });
});
