import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import assert from 'assert';
import { differenceInSeconds } from 'date-fns';
import mongoose from 'mongoose';

import ApplicationRepository from '@/repositories/application.repository';
import JobPostingRepository from '@/repositories/jobPosting.repository';
import ApplicationService from '@/services/application.service';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { ResourceNotFoundError, DuplicateResourceError } from '@/utils/errors';
import { ApplicationStatus } from '@/types/enums';

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
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: new mongoose.Types.ObjectId().toString(),
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
        userId: new mongoose.Types.ObjectId().toString(),
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
        userId: new mongoose.Types.ObjectId().toString(),
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

  describe('getAllApplications', () => {
    it('should only return applications associated with a userId', async () => {
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

      const application1 = await ApplicationRepository.createApplication(
        mockApplication1
      );
      const application2 = await ApplicationRepository.createApplication(
        mockApplication2
      );
      const application3 = await ApplicationRepository.createApplication(
        mockApplication3
      );

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
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: userId,
      };
      const mockApplication2 = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: otherUserId,
      };
      const mockApplication3 = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: otherUserId,
      };

      const mockApplicationId1 = (
        await ApplicationRepository.createApplication(mockApplication1)
      ).id;
      await ApplicationRepository.createApplication(mockApplication2);
      await ApplicationRepository.createApplication(mockApplication3);

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

      const otherApp = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: otherUserId,
      };
      const otherAppId = (
        await ApplicationRepository.createApplication(otherApp)
      ).id;

      await expect(
        ApplicationService.getOneApplication({
          applicationId: otherAppId,
          userId,
        })
      ).eventually.rejectedWith(ResourceNotFoundError);
    });
  });
});
