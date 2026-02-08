import { VISUALIZATION_STAT } from '@vtmp/server-common/constants';
import { expect } from 'chai';
import { sortBy, times, zip } from 'remeda';

import assert from 'assert';

import { SystemRole } from '@vtmp/common/constants';

import { ApplicationRepository } from '@/repositories/application.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { UserRepository } from '@/repositories/user.repository';
import { VisualizationService } from '@/services/visualization.service';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewObjectId, getNewMongoId } from '@/testutils/mongoID.testutil';

describe('VisualizationService', () => {
  useMongoDB();

  describe('getVisualizationStats', () => {
    it('should return number of applcations in sorted order', async () => {
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

      const { [VISUALIZATION_STAT.APPLICATIONS_COUNT]: result } =
        await VisualizationService.getVisualizationStats();

      assert(result);
      expect(result.map(({ count, name }) => ({ count, name }))).to.deep.equal([
        {
          count: 1,
          name: 'admin viettech',
        },
        {
          count: 4,
          name: 'user2 viettech',
        },
        {
          count: 6,
          name: 'user1 viettech',
        },
        {
          count: 12,
          name: 'moderator viettech',
        },
      ]);
    });

    it('should return multiple weeks with correct counts for postings in different weeks', async () => {
      const mockJobPostings = [
        {
          linkId: getNewObjectId(),
          url: 'http://example.com/job-posting',
          jobTitle: 'Software Engineer',
          companyName: 'Example Company',
          submittedBy: getNewObjectId(),
          datePosted: new Date('2025-07-07T12:00:00Z'),
        },
        {
          linkId: getNewObjectId(),
          url: 'http://example.com/job-posting',
          jobTitle: 'Software Engineer',
          companyName: 'Example Company',
          submittedBy: getNewObjectId(),
          datePosted: new Date('2025-07-14T12:00:00Z'),
        },
        {
          linkId: getNewObjectId(),
          url: 'http://example.com/job-posting',
          jobTitle: 'Software Engineer',
          companyName: 'Example Company',
          submittedBy: getNewObjectId(),
          datePosted: new Date('2025-07-17T12:00:00Z'),
        },
      ];
      await Promise.all(
        mockJobPostings.map((mockJobPosting) =>
          JobPostingRepository.createJobPosting({
            jobPostingData: mockJobPosting,
          })
        )
      );
      const { [VISUALIZATION_STAT.JOB_POSTINGS_TREND]: result } =
        await VisualizationService.getVisualizationStats();
      expect(result).to.deep.equal([
        {
          count: 1,
          year: 2025,
          startDate: new Date('2025-07-07T00:00:00.000Z'),
          endDate: new Date('2025-07-13T00:00:00.000Z'),
        },
        {
          count: 2,
          year: 2025,
          startDate: new Date('2025-07-14T00:00:00.000Z'),
          endDate: new Date('2025-07-20T00:00:00.000Z'),
        },
      ]);
    });

    it('should return number of applcations in sorted order and return multiple weeks with correct counts for postings in different weeks', async () => {
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
      const mockNumberofApplications = [1, 12, 6, 4, 3, 10, 9];
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

      const mockJobPostings = [
        {
          linkId: getNewObjectId(),
          url: 'http://example.com/job-posting',
          jobTitle: 'Software Engineer',
          companyName: 'Example Company',
          submittedBy: getNewObjectId(),
          datePosted: new Date('2025-07-07T12:00:00Z'),
        },
        {
          linkId: getNewObjectId(),
          url: 'http://example.com/job-posting',
          jobTitle: 'Software Engineer',
          companyName: 'Example Company',
          submittedBy: getNewObjectId(),
          datePosted: new Date('2025-07-14T12:00:00Z'),
        },
        {
          linkId: getNewObjectId(),
          url: 'http://example.com/job-posting',
          jobTitle: 'Software Engineer',
          companyName: 'Example Company',
          submittedBy: getNewObjectId(),
          datePosted: new Date('2025-07-17T12:00:00Z'),
        },
      ];
      await Promise.all(
        mockJobPostings.map((mockJobPosting) =>
          JobPostingRepository.createJobPosting({
            jobPostingData: mockJobPosting,
          })
        )
      );

      const result = await VisualizationService.getVisualizationStats();

      expect(
        result[VISUALIZATION_STAT.APPLICATIONS_COUNT].map(
          ({ count, name }) => ({
            count,
            name,
          })
        )
      ).to.deep.equal([
        {
          count: 1,
          name: 'admin viettech',
        },
        {
          count: 4,
          name: 'user2 viettech',
        },
        {
          count: 6,
          name: 'user1 viettech',
        },
        {
          count: 12,
          name: 'moderator viettech',
        },
      ]);

      expect(
        result[VISUALIZATION_STAT.JOB_POSTINGS_TREND].map(
          ({ count, year, startDate, endDate }) => ({
            count,
            year,
            startDate,
            endDate,
          })
        )
      ).to.deep.equal([
        {
          count: 1,
          year: 2025,
          startDate: new Date('2025-07-07T00:00:00.000Z'),
          endDate: new Date('2025-07-13T00:00:00.000Z'),
        },
        {
          count: 2,
          year: 2025,
          startDate: new Date('2025-07-14T00:00:00.000Z'),
          endDate: new Date('2025-07-20T00:00:00.000Z'),
        },
      ]);
    });
  });
});
