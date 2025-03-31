import { expect } from 'chai';
import { differenceInSeconds } from 'date-fns';

import ApplicationService from './application.service';
import ApplicationModel, {
  ApplicationStatus,
} from '@/models/application.model';
import JobPosting from '@/models/jobPosting.model';
import { useMongoDB } from '@/config/mongodb.testutils';
import mongoose from 'mongoose';
import { ResourceNotFoundError } from '@/utils/errors';

describe('ApplicationService', () => {
  useMongoDB();

  let mockJobPosting: {
    linkId: string;
    url: string;
    jobTitle: string;
    companyName: string;
    submittedBy: string;
  };

  beforeEach(() => {
    mockJobPosting = {
      linkId: new mongoose.Types.ObjectId().toString(),
      url: 'vtmp.com',
      jobTitle: 'SWE',
      companyName: 'Apple',
      submittedBy: new mongoose.Types.ObjectId().toString(),
    };
  });

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
        expect((error as ResourceNotFoundError).message).to.equal(
          'Job posting not found'
        );
      }
    });

    it('should throw error if an application associated with this job posting and user already exist', async () => {
      const newJobPosting = await JobPosting.create(mockJobPosting);

      const mockApplication = {
        jobPostingId: newJobPosting.id,
        userId: new mongoose.Types.ObjectId().toString(),
      };

      await ApplicationModel.create(mockApplication);

      try {
        await ApplicationService.createApplication(mockApplication);
      } catch (error) {
        expect((error as Error).message).to.equal(
          'Application associated with this job posting and user already exists'
        );
      }
    });

    it('should create an application successfully', async () => {
      const newJobPosting = await JobPosting.create(mockJobPosting);

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
