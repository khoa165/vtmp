import { UserRepository } from '@/repositories/user.repository';
import { expect } from 'chai';
import assert from 'assert';
import { sortBy, times, zip } from 'remeda';
import { ApplicationRepository } from '@/repositories/application.repository';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { VisualizationService } from '@/services/visualization.service';
import { SystemRole } from '@vtmp/common/constants';

describe('VisualizationService', () => {
  useMongoDB();

  describe('getApplicationsByUser', () => {
    it('should return number of applcations in sorted order, exclude admins and moderator', async () => {
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
      const result = await VisualizationService.getVisualizationStats();
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
