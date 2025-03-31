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

      // Create mock applications
      const mockApplication1 = {
        jobPostingId: new mongoose.Types.ObjectId(),
        userId: userId,
        hasApplied: true,
        status: 'Pending',
        appliedOnDate: new Date(),
        note: '',
      };
      const mockApplication2 = {
        jobPostingId: new mongoose.Types.ObjectId(),
        userId: userId,
        hasApplied: true,
        status: 'Pending',
        appliedOnDate: new Date(),
        note: '',
      };
      const mockApplication3 = {
        jobPostingId: new mongoose.Types.ObjectId(),
        userId: otherUserId,
        hasApplied: true,
        status: 'Rejected',
        appliedOnDate: new Date(),
        note: '',
      };

      const applicationId1 = (await Application.create(mockApplication1)).id;
      const applicationId2 = (await Application.create(mockApplication2)).id;
      const applicationId3 = (await Application.create(mockApplication3)).id;

      const applications = await ApplicationService.getAllApplications(userId);

      expect(applications).to.include.members([applicationId1, applicationId2]);
      expect(applications).to.not.include.members([applicationId3]);
      expect(applications).to.have.lengthOf(2);
      applications.forEach((app: any) => {
        expect(app.userId.toString()).to.equal(userId);
      });
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

      // Create mock applications
      const mockApplication1 = await Application.create({
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: userId,
        hasApplied: true,
        status: 'Pending',
        appliedOnDate: new Date(),
        note: '',
      });

      await Application.create({
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: userId,
        hasApplied: true,
        status: 'Pending',
        appliedOnDate: new Date(),
        note: '',
      });

      await Application.create({
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: otherUserId,
        hasApplied: true,
        status: 'Rejected',
        appliedOnDate: new Date(),
        note: '',
      });

      const application = await ApplicationService.getOneApplication({
        applicationId: mockApplication1.id.toString(),
        userId,
      });

      expect(application).to.not.be.null;
      expect(application?.userId.toString()).to.equal(userId);
      expect(application?.id.toString()).to.equal(
        mockApplication1.id.toString()
      );
    });

    it('should throw an error if no application is associated with the authenticated user', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const otherUserId = new mongoose.Types.ObjectId().toString();

      // Create an application for another user
      const otherApp = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: otherUserId,
        hasApplied: true,
        status: 'Rejected',
        appliedOnDate: new Date(),
        note: '',
      };
      const otherAppId = (await Application.create(otherApp)).id;

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
