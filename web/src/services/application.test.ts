import { expect } from 'chai';
import { differenceInSeconds } from 'date-fns';
import mongoose from 'mongoose';

import ApplicationRepository from '@/repositories/application.repository';
import JobPostingRepository from '@/repositories/jobPosting.repository';
import ApplicationService from '@/services/application.service';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { ResourceNotFoundError, DuplicateResourceError } from '@/utils/errors';
import { ApplicationStatus } from '@/types/enums';

describe('ApplicationService', () => {
  useMongoDB();

  const mockJobPosting = {
    linkId: new mongoose.Types.ObjectId().toString(),
    url: 'vtmp.com',
    jobTitle: 'SWE',
    companyName: 'Apple',
    submittedBy: new mongoose.Types.ObjectId().toString(),
  };

  describe('createApplication', () => {
    it('should throw error if job posting does not exist', async () => {
      const mockApplication = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: new mongoose.Types.ObjectId().toString(),
      };

      try {
        await ApplicationService.createApplication(mockApplication);
      } catch (error) {
        expect(error instanceof ResourceNotFoundError).to.equal(true);
        expect((error as ResourceNotFoundError).statusCode).to.equal(404);
        expect((error as ResourceNotFoundError).message).to.equal(
          'Job posting not found'
        );
      }
    });

    it('should throw error if an application associated with this job posting and user already exist', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting(
        mockJobPosting
      );

      const mockApplication = {
        jobPostingId: newJobPosting.id,
        userId: new mongoose.Types.ObjectId().toString(),
      };

      await ApplicationRepository.createApplication(mockApplication);

      try {
        await ApplicationService.createApplication(mockApplication);
      } catch (error) {
        expect(error instanceof DuplicateResourceError).to.equal(true);
        expect((error as DuplicateResourceError).statusCode).to.equal(409);
        expect((error as DuplicateResourceError).message).to.equal(
          'Application already exists'
        );
      }
    });

    it('should create an application successfully', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting(
        mockJobPosting
      );

      const mockApplication = {
        jobPostingId: newJobPosting.id,
        userId: new mongoose.Types.ObjectId().toString(),
      };

      try {
        const newApplication = await ApplicationService.createApplication(
          mockApplication
        );
        const timeDiff = differenceInSeconds(
          new Date(),
          newApplication.appliedOnDate
        );

        expect(newApplication.jobPostingId.toString()).to.equal(
          mockApplication.jobPostingId
        );
        expect(newApplication.userId.toString()).to.equal(
          mockApplication.userId
        );
        expect(newApplication.hasApplied).to.equal(true);
        expect(newApplication.status).to.equal(ApplicationStatus.SUBMITTED);
        expect(timeDiff).to.lessThan(3);
      } catch (error) {
        expect.fail(`Expect no error: but got: ${(error as Error).message}`);
      }
    });
  });
});
