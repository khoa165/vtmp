import { expect } from 'chai';
import assert from 'assert';
import { differenceInSeconds } from 'date-fns';
import { sortBy, times, zip } from 'remeda';

import { ApplicationRepository } from '@/repositories/application.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import {
  ApplicationStatus,
  InterestLevel,
  JobPostingRegion,
  SystemRole,
} from '@vtmp/common/constants';
import { getNewMongoId, toMongoId } from '@/testutils/mongoID.testutil';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { IJobPosting } from '@/models/job-posting.model';
import { UserRepository } from '@/repositories/user.repository';
describe('ApplicationRepository', () => {
  useMongoDB();

  interface MockApplication {
    jobPostingId: string;
    userId: string;
  }

  let userId_A: string;
  let userId_B: string;

  let jobPosting_0: IJobPosting;

  let mockApplication_A0: MockApplication;
  let mockApplication_A1: MockApplication;
  let mockApplication_B0: MockApplication;

  beforeEach(async () => {
    userId_A = getNewMongoId();
    userId_B = getNewMongoId();

    const mockJobPostingData = [
      {
        linkId: getNewMongoId(),
        url: 'http://meta.com/job-posting',
        jobTitle: 'Software Engineer',
        companyName: 'Meta',
        location: JobPostingRegion.CANADA,
        submittedBy: getNewMongoId(),
      },
      {
        linkId: getNewMongoId(),
        url: 'http://google.com/job-posting',
        jobTitle: 'Software Engineer',
        companyName: 'Google',
        location: JobPostingRegion.US,
        submittedBy: getNewMongoId(),
      },
    ];

    const [mockJobPosting_0, mockJobPosting_1] = await Promise.all(
      mockJobPostingData.map((data) =>
        JobPostingRepository.createJobPosting({
          jobPostingData: data,
        })
      )
    );
    assert(
      mockJobPosting_0 && mockJobPosting_1,
      'Failed to create job postings'
    );

    jobPosting_0 = mockJobPosting_0;

    mockApplication_A0 = {
      jobPostingId: mockJobPosting_0.id,
      userId: userId_A,
    };
    mockApplication_A1 = {
      jobPostingId: mockJobPosting_1.id,
      userId: userId_A,
    };
    mockApplication_B0 = {
      jobPostingId: mockJobPosting_0.id,
      userId: userId_B,
    };
  });

  describe('createApplication', () => {
    it('should create a new application successfully', async () => {
      const newApplication =
        await ApplicationRepository.createApplication(mockApplication_B0);
      const timeDiff = differenceInSeconds(
        new Date(),
        newApplication.appliedOnDate
      );

      assert(newApplication);
      expect(newApplication.jobPostingId.toString()).to.equal(
        mockApplication_B0.jobPostingId
      );
      expect(newApplication.userId.toString()).to.equal(
        mockApplication_B0.userId
      );
      expect(newApplication.hasApplied).to.equal(true);
      expect(newApplication.status).to.equal(ApplicationStatus.SUBMITTED);
      expect(newApplication.location).to.equal(jobPosting_0.location);
      expect(newApplication.location).to.equal(jobPosting_0.location);
      expect(timeDiff).to.lessThan(3);
    });
  });

  describe('getApplicationIfExists', () => {
    it('should return an application if an application with certain jobPostingId and userId already exists', async () => {
      await ApplicationRepository.createApplication(mockApplication_B0);
      const application =
        await ApplicationRepository.getApplicationIfExists(mockApplication_B0);

      assert(application);
      expect(application).to.deep.include({
        jobPostingId: toMongoId(mockApplication_B0.jobPostingId),
        userId: toMongoId(mockApplication_B0.userId),
      });
    });

    it('should return null if an application with certain jobPostingId and userId does not exist', async () => {
      const application =
        await ApplicationRepository.getApplicationIfExists(mockApplication_B0);

      assert(!application);
    });
  });

  describe('getApplications', () => {
    it('should return only applications associated with given userId', async () => {
      await ApplicationRepository.createApplication(mockApplication_A0);
      await ApplicationRepository.createApplication(mockApplication_A1);
      await ApplicationRepository.createApplication(mockApplication_B0);
      const applications = await ApplicationRepository.getApplications({
        userId: userId_A,
      });

      assert(applications);
      expect(applications).to.be.an('array').that.have.lengthOf(2);
      expect(applications[0]).to.deep.include({
        jobPostingId: toMongoId(mockApplication_A0.jobPostingId),
        userId: toMongoId(mockApplication_A0.userId),
      });
      expect(applications[1]).to.deep.include({
        jobPostingId: toMongoId(mockApplication_A1.jobPostingId),
        userId: toMongoId(mockApplication_A1.userId),
      });
    });

    it('should exclude soft-deleted application from list of returned application', async () => {
      await ApplicationRepository.createApplication(mockApplication_A0);
      const mockApplicationId_A1 = (
        await ApplicationRepository.createApplication(mockApplication_A1)
      ).id;
      await ApplicationRepository.deleteApplicationById({
        userId: userId_A,
        applicationId: mockApplicationId_A1,
      });
      const applications = await ApplicationRepository.getApplications({
        userId: userId_A,
      });

      assert(applications);
      expect(applications).to.be.an('array').that.have.lengthOf(1);
      expect(applications[0]).to.deep.include({
        jobPostingId: toMongoId(mockApplication_A0.jobPostingId),
        userId: toMongoId(mockApplication_A0.userId),
      });
    });

    it('should return an empty array if no applications found for userId', async () => {
      await ApplicationRepository.createApplication(mockApplication_B0);
      const applications = await ApplicationRepository.getApplications({
        userId: userId_A,
      });

      assert(applications);
      expect(applications).to.be.an('array').that.have.lengthOf(0);
    });
  });

  describe('getApplicationById', () => {
    it('should return null if the application does not belong to the authorized user', async () => {
      const mockApplicationId_B = (
        await ApplicationRepository.createApplication(mockApplication_B0)
      ).id;
      const application = await ApplicationRepository.getApplicationById({
        applicationId: mockApplicationId_B,
        userId: userId_A,
      });

      assert(!application);
    });

    it('should return null if trying to get soft-deleted application', async () => {
      const mockApplicationId_B = (
        await ApplicationRepository.createApplication(mockApplication_B0)
      ).id;
      await ApplicationRepository.deleteApplicationById({
        userId: userId_B,
        applicationId: mockApplicationId_B,
      });
      const foundApplication = await ApplicationRepository.getApplicationById({
        applicationId: mockApplicationId_B,
        userId: userId_B,
      });

      assert(!foundApplication);
    });

    it('should return an application if there exists an application for authorized user', async () => {
      await ApplicationRepository.createApplication(mockApplication_A0);
      await ApplicationRepository.createApplication(mockApplication_B0);
      const mockApplicationId_A1 = (
        await ApplicationRepository.createApplication(mockApplication_A1)
      ).id;
      const application = await ApplicationRepository.getApplicationById({
        applicationId: mockApplicationId_A1,
        userId: userId_A,
      });

      assert(application);
      expect(application).to.deep.include({
        jobPostingId: toMongoId(mockApplication_A1.jobPostingId),
        userId: toMongoId(mockApplication_A1.userId),
      });
    });
  });

  describe('updateApplicationById', () => {
    let mockApplicationId_B: string;
    beforeEach(async () => {
      mockApplicationId_B = (
        await ApplicationRepository.createApplication(mockApplication_B0)
      ).id;
    });

    it('should return null if application does not exist', async () => {
      const updatedApplication =
        await ApplicationRepository.updateApplicationById({
          userId: userId_A,
          applicationId: getNewMongoId(),
          updatedMetadata: {},
        });

      assert(!updatedApplication);
    });

    it('should return null if trying to update metadata of a soft-deleted application', async () => {
      await ApplicationRepository.deleteApplicationById({
        userId: userId_B,
        applicationId: mockApplicationId_B,
      });
      const updatedApplication =
        await ApplicationRepository.updateApplicationById({
          userId: userId_B,
          applicationId: mockApplicationId_B,
          updatedMetadata: {},
        });

      assert(!updatedApplication);
    });

    it('should return updated application with new metadata if application found (application was not soft-deleted)', async () => {
      const updatedApplication =
        await ApplicationRepository.updateApplicationById({
          userId: userId_B,
          applicationId: mockApplicationId_B,
          updatedMetadata: {
            status: ApplicationStatus.OFFERED,
            note: 'note about this application',
            referrer: 'Khoa',
            portalLink: 'abc.com',
            interest: InterestLevel.HIGH,
          },
        });

      assert(updatedApplication);
      expect(updatedApplication).to.deep.include({
        status: ApplicationStatus.OFFERED,
        referrer: 'Khoa',
        interest: InterestLevel.HIGH,
        portalLink: 'abc.com',
        note: 'note about this application',
      });
    });

    it('should be able to recreate application that was soft-deleted by setting deletedAt back to null if includeDeletedDoc is true,', async () => {
      const softDeletedApp = await ApplicationRepository.deleteApplicationById({
        userId: userId_B,
        applicationId: mockApplicationId_B,
      });
      assert(softDeletedApp);
      assert(softDeletedApp.deletedAt);

      const resetApp = await ApplicationRepository.updateApplicationById({
        userId: userId_B,
        applicationId: mockApplicationId_B,
        updatedMetadata: { deletedAt: null },
        options: { includeDeletedDoc: true },
      });
      assert(resetApp);
      assert(!resetApp.deletedAt);
    });

    it('should return updated application if includeDeletedDoc is true and application was soft-deleted', async () => {
      await ApplicationRepository.deleteApplicationById({
        userId: userId_B,
        applicationId: mockApplicationId_B,
      });
      const updatedApplication =
        await ApplicationRepository.updateApplicationById({
          userId: userId_B,
          applicationId: mockApplicationId_B,
          updatedMetadata: { status: ApplicationStatus.OFFERED },
          options: { includeDeletedDoc: true },
        });

      assert(updatedApplication);
      expect(updatedApplication.status).to.equal(ApplicationStatus.OFFERED);
    });

    it('should return null if includeDeletedDoc is false and application was soft-deleted', async () => {
      await ApplicationRepository.deleteApplicationById({
        userId: userId_B,
        applicationId: mockApplicationId_B,
      });
      const updatedApplication =
        await ApplicationRepository.updateApplicationById({
          userId: userId_B,
          applicationId: mockApplicationId_B,
          updatedMetadata: { status: ApplicationStatus.OA },
          options: { includeDeletedDoc: false },
        });

      assert(!updatedApplication);
    });

    it('should return null if includeDeletedDoc is not passed in and application was soft-deleted', async () => {
      await ApplicationRepository.deleteApplicationById({
        userId: userId_B,
        applicationId: mockApplicationId_B,
      });
      const updatedApplication =
        await ApplicationRepository.updateApplicationById({
          userId: userId_B,
          applicationId: mockApplicationId_B,
          updatedMetadata: { status: ApplicationStatus.REJECTED },
          options: {},
        });

      assert(!updatedApplication);
    });

    it('should return null if options is undefined and application was soft-deleted', async () => {
      await ApplicationRepository.deleteApplicationById({
        userId: userId_B,
        applicationId: mockApplicationId_B,
      });
      const updatedApplication =
        await ApplicationRepository.updateApplicationById({
          userId: userId_B,
          applicationId: mockApplicationId_B,
          updatedMetadata: { status: ApplicationStatus.WITHDRAWN },
        });

      assert(!updatedApplication);
    });
  });

  describe('deleteApplicationById', () => {
    it('should return null if application does not exist', async () => {
      const deletedApplication =
        await ApplicationRepository.deleteApplicationById({
          userId: userId_A,
          applicationId: getNewMongoId(),
        });

      assert(!deletedApplication);
    });

    it('should return null if trying to delete an already soft-deleted application', async () => {
      const mockApplicationId_B = (
        await ApplicationRepository.createApplication(mockApplication_B0)
      ).id;
      await ApplicationRepository.deleteApplicationById({
        userId: userId_B,
        applicationId: mockApplicationId_B,
      });
      const deletedApplication =
        await ApplicationRepository.deleteApplicationById({
          userId: userId_B,
          applicationId: mockApplicationId_B,
        });

      assert(!deletedApplication);
    });

    it('should soft delete application and return deleted application object with deletedAt field set', async () => {
      const mockApplicationId_B = (
        await ApplicationRepository.createApplication(mockApplication_B0)
      ).id;
      const deletedApplication =
        await ApplicationRepository.deleteApplicationById({
          userId: userId_B,
          applicationId: mockApplicationId_B,
        });

      assert(deletedApplication);
      assert(deletedApplication.deletedAt);
      const timeDiff = differenceInSeconds(
        new Date(),
        deletedApplication.deletedAt
      );
      expect(timeDiff).to.lessThan(3);

      const foundApplication = await ApplicationRepository.getApplicationById({
        applicationId: mockApplicationId_B,
        userId: userId_B,
      });
      assert(!foundApplication);
    });
  });

  describe('getApplicationsCountByStatus', () => {
    const updatedStatus = [
      ApplicationStatus.SUBMITTED,
      ApplicationStatus.WITHDRAWN,
      ApplicationStatus.OFFERED,
      ApplicationStatus.OFFERED,
      ApplicationStatus.REJECTED,
    ] as const;

    it('should return an empty object if no applications exist for the user', async () => {
      const result =
        await ApplicationRepository.getApplicationsCountByStatus(userId_A);

      assert(result);
      expect(result).to.deep.equal({});
    });

    it('should return correct counts grouped by status for the user', async () => {
      const applications = await Promise.all(
        times(updatedStatus.length, () =>
          ApplicationRepository.createApplication({
            jobPostingId: getNewMongoId(),
            userId: userId_A,
          })
        )
      );
      await Promise.all(
        zip(applications, updatedStatus).map(([application, status]) =>
          ApplicationRepository.updateApplicationById({
            userId: userId_A,
            applicationId: application.id,
            updatedMetadata: {
              status,
            },
          })
        )
      );

      const result =
        await ApplicationRepository.getApplicationsCountByStatus(userId_A);

      assert(result);
      expect(result).to.deep.equal({
        [ApplicationStatus.SUBMITTED]: 1,
        [ApplicationStatus.WITHDRAWN]: 1,
        [ApplicationStatus.OFFERED]: 2,
        [ApplicationStatus.REJECTED]: 1,
      });
    });

    it('should exclude soft-deleted applications from the count', async () => {
      await ApplicationRepository.createApplication({
        jobPostingId: getNewMongoId(),
        userId: userId_A,
      });
      const applicationToDelete = await ApplicationRepository.createApplication(
        {
          jobPostingId: getNewMongoId(),
          userId: userId_A,
        }
      );

      await ApplicationRepository.deleteApplicationById({
        userId: userId_A,
        applicationId: applicationToDelete.id,
      });

      const result =
        await ApplicationRepository.getApplicationsCountByStatus(userId_A);

      assert(result);
      expect(result).to.deep.equal({
        [ApplicationStatus.SUBMITTED]: 1,
      });
    });

    it('should return counts only for the specified user', async () => {
      await ApplicationRepository.createApplication({
        jobPostingId: getNewMongoId(),
        userId: userId_A,
      });
      await ApplicationRepository.createApplication({
        jobPostingId: getNewMongoId(),
        userId: userId_B,
      });

      const result =
        await ApplicationRepository.getApplicationsCountByStatus(userId_A);

      assert(result);
      expect(result).to.deep.equal({
        [ApplicationStatus.SUBMITTED]: 1,
      });
    });
  });

  describe('getApplicationsCountByUser', () => {
    it('should return empty array since no application is created', async () => {
      const result = await ApplicationRepository.getApplicationsCountByUser();
      expect(result).to.deep.equal([]);
    });

    it('should return count of applications for a single user', async () => {
      const mockOneUser = {
        firstName: 'Test',
        lastName: 'Nguyen',
        email: 'test@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      const user = await UserRepository.createUser(mockOneUser);
      await Promise.all(
        times(2, () =>
          ApplicationRepository.createApplication({
            jobPostingId: getNewMongoId(),
            userId: user._id.toString(),
          })
        )
      );
      const result = await ApplicationRepository.getApplicationsCountByUser();
      assert(result);
      expect(result).to.deep.equal([
        {
          count: 2,
          userId: user._id,
          name: 'Test Nguyen',
        },
      ]);
    });

    it('should return count of applications for multiple users', async () => {
      const mockMultipleUsers = [
        {
          firstName: 'user1',
          lastName: 'viettech',
          email: 'test1@example.com',
          encryptedPassword: 'ecnrypted-password-later',
        },
        {
          firstName: 'user2',
          lastName: 'viettech',
          email: 'test2@example.com',
          encryptedPassword: 'ecnrypted-password-later',
        },
        {
          firstName: 'user3',
          lastName: 'viettech',
          email: 'test3@example.com',
          encryptedPassword: 'ecnrypted-password-later',
        },
      ];
      await Promise.all(
        mockMultipleUsers.map((mockUser) => UserRepository.createUser(mockUser))
      );
      const users = await UserRepository.getAllUsers();
      await Promise.all(
        users.map((user) =>
          times(3, () =>
            ApplicationRepository.createApplication({
              jobPostingId: getNewMongoId(),
              userId: user._id.toString(),
            })
          )
        )
      );
      const additionalUser = {
        firstName: 'Test',
        lastName: 'Nguyen',
        email: 'test@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      const user = await UserRepository.createUser(additionalUser);
      await Promise.all(
        times(8, () =>
          ApplicationRepository.createApplication({
            jobPostingId: getNewMongoId(),
            userId: user._id.toString(),
          })
        )
      );
      const result = await ApplicationRepository.getApplicationsCountByUser();
      assert(result);
      expect(
        result.map(({ count, name }) => ({ count, name }))
      ).to.deep.include.members([
        {
          count: 8,
          name: 'Test Nguyen',
        },
        {
          count: 3,
          name: 'user1 viettech',
        },
        {
          count: 3,
          name: 'user2 viettech',
        },
        {
          count: 3,
          name: 'user3 viettech',
        },
      ]);
    });

    it('should not count applications that are soft-deleted', async () => {
      const mockOneUser = {
        firstName: 'Test',
        lastName: 'Nguyen',
        email: 'test@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      const user = await UserRepository.createUser(mockOneUser);
      await Promise.all(
        times(5, () =>
          ApplicationRepository.createApplication({
            jobPostingId: getNewMongoId(),
            userId: user._id.toString(),
          })
        )
      );
      const applicationToDelete = await ApplicationRepository.createApplication(
        {
          jobPostingId: getNewMongoId(),
          userId: user._id.toString(),
        }
      );
      await ApplicationRepository.deleteApplicationById({
        userId: user._id.toString(),
        applicationId: applicationToDelete.id,
      });

      const result = await ApplicationRepository.getApplicationsCountByUser();
      expect(result).to.deep.equal([
        {
          count: 5,
          userId: user._id,
          name: 'Test Nguyen',
        },
      ]);
    });

    it('should sort the result in the ascending order of counts', async () => {
      const mockMultipleUsers = [
        {
          firstName: 'user1',
          lastName: 'viettech',
          email: 'test1@example.com',
          encryptedPassword: 'ecnrypted-password-later',
        },
        {
          firstName: 'user2',
          lastName: 'viettech',
          email: 'test2@example.com',
          encryptedPassword: 'ecnrypted-password-later',
        },
        {
          firstName: 'user3',
          lastName: 'viettech',
          email: 'test3@example.com',
          encryptedPassword: 'ecnrypted-password-later',
        },
        {
          firstName: 'user4',
          lastName: 'viettech',
          email: 'test4@example.com',
          encryptedPassword: 'ecnrypted-password-later',
        },
      ];
      const mockNumberofApplications = [1, 12, 6, 4];
      await Promise.all(
        mockMultipleUsers.map((mockUser) => UserRepository.createUser(mockUser))
      );
      const users = await UserRepository.getAllUsers();
      const usersSortByFirstName = sortBy(users, (user) => user.firstName);
      await Promise.all(
        zip(usersSortByFirstName, mockNumberofApplications)
          .map(([user, count]) =>
            times(count, () =>
              ApplicationRepository.createApplication({
                jobPostingId: getNewMongoId(),
                userId: user._id.toString(),
              })
            )
          )
          .flatMap((a) => a)
      );
      const result = await ApplicationRepository.getApplicationsCountByUser();
      assert(result);
      expect(result.map(({ count, name }) => ({ count, name }))).to.deep.equal([
        {
          count: 1,
          name: 'user1 viettech',
        },
        {
          count: 4,
          name: 'user4 viettech',
        },
        {
          count: 6,
          name: 'user3 viettech',
        },
        {
          count: 12,
          name: 'user2 viettech',
        },
      ]);
    });

    it('should exclude admins and moderator from the applications count', async () => {
      const mockMultipleUsers = [
        {
          firstName: 'admin',
          lastName: 'viettech',
          email: 'test1@example.com',
          encryptedPassword: 'ecnrypted-password-later',
          role: SystemRole.ADMIN,
        },
        {
          firstName: 'moderator',
          lastName: 'viettech',
          email: 'test2@example.com',
          encryptedPassword: 'ecnrypted-password-later',
          role: SystemRole.MODERATOR,
        },
        {
          firstName: 'user1',
          lastName: 'viettech',
          email: 'test3@example.com',
          encryptedPassword: 'ecnrypted-password-later',
        },
        {
          firstName: 'user2',
          lastName: 'viettech',
          email: 'test4@example.com',
          encryptedPassword: 'ecnrypted-password-later',
        },
      ];
      const mockNumberofApplications = [1, 12, 6, 4];
      await Promise.all(
        mockMultipleUsers.map((mockUser) => UserRepository.createUser(mockUser))
      );
      const users = await UserRepository.getAllUsers();
      const usersSortByFirstName = sortBy(users, (user) => user.firstName);
      await Promise.all(
        zip(usersSortByFirstName, mockNumberofApplications)
          .map(([user, count]) =>
            times(count, () =>
              ApplicationRepository.createApplication({
                jobPostingId: getNewMongoId(),
                userId: user._id.toString(),
              })
            )
          )
          .flatMap((a) => a)
      );
      const result = await ApplicationRepository.getApplicationsCountByUser();
      assert(result);
      expect(result.map(({ count, name }) => ({ count, name }))).to.deep.equal([
        {
          count: 4,
          name: 'user2 viettech',
        },
        {
          count: 6,
          name: 'user1 viettech',
        },
      ]);
    });
  });
});
