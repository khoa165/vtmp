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

  describe('getAllApplications', () => {
    it('should only return applications associated with a userId', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const otherUserId = new mongoose.Types.ObjectId().toString();

      const mockApplication1 = {
        jobPostingId: new mongoose.Types.ObjectId(),
        userId: userId,
      };
      const mockApplication2 = {
        jobPostingId: new mongoose.Types.ObjectId(),
        userId: userId,
      };
      const mockApplication3 = {
        jobPostingId: new mongoose.Types.ObjectId(),
        userId: otherUserId,
      };

      const application1 = await ApplicationModel.create(mockApplication1);
      const application2 = await ApplicationModel.create(mockApplication2);
      const application3 = await ApplicationModel.create(mockApplication3);

      const applications = await ApplicationService.getAllApplications(userId);

      const applicationsId = applications.map((x) => x.id.toString());

      expect(applicationsId).to.include.members([
        application1.id.toString(),
        application2.id.toString(),
      ]);
      expect(applicationsId).to.not.include.members([
        application3.id.toString(),
      ]);
      expect(applications).to.have.lengthOf(2);
    });

    it('should return no application if authenticated user has no application', async () => {
      const userId = new mongoose.Types.ObjectId().toString();

      const applications = await ApplicationService.getAllApplications(userId);

      expect(applications).to.be.an('array').that.is.empty;
    });
  });

  describe('getOneApplication', () => {
    useMongoDB();

    it('should only return application associated with an applicationId and a userId', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const otherUserId = new mongoose.Types.ObjectId().toString();

      const mockApplication1 = {
        jobPostingId: new mongoose.Types.ObjectId(),
        userId: userId,
      };
      const mockApplication2 = {
        jobPostingId: new mongoose.Types.ObjectId(),
        userId: otherUserId,
      };
      const mockApplication3 = {
        jobPostingId: new mongoose.Types.ObjectId(),
        userId: otherUserId,
      };

      const mockApplicationId1 = (
        await ApplicationModel.create(mockApplication1)
      ).id;
      await ApplicationModel.create(mockApplication2);
      await ApplicationModel.create(mockApplication3);

      const application = await ApplicationService.getOneApplication({
        applicationId: mockApplicationId1,
        userId,
      });

      expect(application).to.not.be.null;
      expect(application?.userId.toString()).to.equal(userId);
      expect(application?.id.toString()).to.equal(mockApplicationId1);
    });

    it('should throw an error if no application is associated with the authenticated user', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const otherUserId = new mongoose.Types.ObjectId().toString();

      // Create an application for another user
      const otherApp = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: otherUserId,
      };
      const otherAppId = (await ApplicationModel.create(otherApp)).id;

      try {
        await ApplicationService.getOneApplication({
          applicationId: otherAppId,
          userId,
        });
        throw new Error('Expected error was not thrown');
      } catch (err: any) {
        expect(err).to.exist;
        expect(err.message).to.match(
          /Application not found or access denied./i
        );
      }
    });
  });
});
