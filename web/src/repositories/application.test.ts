import { expect } from 'chai';
import mongoose from 'mongoose';

import ApplicationRepository from './application.repository';
import Application from '@/models/application.model';
import { useMongoDB } from '@/config/mongodb.testutils';

describe('ApplicationRepository', () => {
  useMongoDB();

  let mockApplication: { jobPostingId: string; userId: string };

  beforeEach(() => {
    mockApplication = {
      jobPostingId: new mongoose.Types.ObjectId().toString(),
      userId: new mongoose.Types.ObjectId().toString(),
    };
  });

  describe('createApplication', () => {
    it('should create a new application successfully', async () => {
      const newApplication = await ApplicationRepository.createApplication(
        mockApplication
      );
      const application = await Application.findById(newApplication.id);

      expect(application?.jobPostingId.toString()).to.equal(
        mockApplication.jobPostingId
      );
      expect(application?.userId.toString()).to.equal(mockApplication.userId);
    });
  });

  describe('alreadyExist', () => {
    it('should evaluate to true if an application already exists', async () => {
      await Application.create(mockApplication);
      const result = await ApplicationRepository.alreadyExist(mockApplication);

      expect(result).to.equal(true);
    });

    it('should evaluate to false if an application does not exists', async () => {
      const result = await ApplicationRepository.alreadyExist(mockApplication);
      expect(result).to.equal(false);
    });
  });
});
