import { expect } from 'chai';
import mongoose from 'mongoose';
import { differenceInSeconds } from 'date-fns';

import ApplicationRepository from './application.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { ApplicationStatus } from '@/types/enums';

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
});
