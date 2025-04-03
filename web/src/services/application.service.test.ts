import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import assert from 'assert';
import { differenceInSeconds } from 'date-fns';
import mongoose from 'mongoose';

import { ApplicationRepository } from '@/repositories/application.repository';
import JobPostingRepository from '@/repositories/jobPosting.repository';
import { ApplicationService } from '@/services/application.service';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { ResourceNotFoundError, DuplicateResourceError } from '@/utils/errors';
import { ApplicationStatus } from '@/types/enums';
import { getNewMongoId } from '@/testutils/mongoID.testutil';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('ApplicationService', () => {
  useMongoDB();

  const mockJobPosting = {
    linkId: new mongoose.Types.ObjectId(),
    url: 'vtmp.com',
    jobTitle: 'SWE',
    companyName: 'Apple',
    submittedBy: new mongoose.Types.ObjectId(),
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
      const newJobPosting = await JobPostingRepository.createJobPosting(
        mockJobPosting
      );
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
      const newJobPosting = await JobPostingRepository.createJobPosting(
        mockJobPosting
      );
      const mockApplication = {
        jobPostingId: newJobPosting.id,
        userId: getNewMongoId(),
      };
      await expect(ApplicationService.createApplication(mockApplication))
        .eventually.fulfilled;
    });

    it('should create an application successfully and return valid new application', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting(
        mockJobPosting
      );
      const mockApplication = {
        jobPostingId: newJobPosting.id,
        userId: getNewMongoId(),
      };
      const newApplication = await ApplicationService.createApplication(
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
});
