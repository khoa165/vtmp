import { expect } from 'chai';
import mongoose from 'mongoose';

import ApplicationRepository from './application.repository';
import Application from '@/models/application.model';
import { useMongoDB } from '@/config/mongodb.testutils';

describe('ApplicationRepository', () => {
  useMongoDB();

  describe('createApplication', () => {
    it('should create a new application successfully', async () => {
      const mockApplication = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: new mongoose.Types.ObjectId().toString(),
      };
      const newApplication = await ApplicationRepository.createApplication(
        mockApplication
      );
      // Expect the newApplication is the same as mockApplication
      const application = await Application.findById(newApplication.id);
      expect(application?.jobPostingId.toString()).to.equal(
        mockApplication.jobPostingId
      );
      expect(application?.userId.toString()).to.equal(mockApplication.userId);
    });

    it('should throw an error if fail to create an application', async () => {});
  });

  describe('alreadyExist', () => {
    it('should return true if an application already exists', async () => {});
    it('should return false if an application does not exists', async () => {});
  });
});
