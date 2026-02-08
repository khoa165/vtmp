import { expect } from 'chai';
import { sortBy, times, zip } from 'remeda';
import request from 'supertest';

import { SystemRole } from '@vtmp/common/constants';

import app from '@/app';
import { EnvConfig } from '@/config/env';
import { ApplicationRepository } from '@/repositories/application.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { UserRepository } from '@/repositories/user.repository';
import {
  HTTPMethod,
  runDefaultAuthMiddlewareTests,
  runUserLogin,
} from '@/testutils/auth.testutils';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';
import {
  expectErrorsArray,
  expectSuccessfulResponse,
} from '@/testutils/response-assertion.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';

describe('VisualizationController', () => {
  useMongoDB();
  const sandbox = useSandbox();
  let mockUserToken: string, mockAdminToken: string, mockModeratorToken: string;

  beforeEach(async () => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);

    ({ mockUserToken, mockAdminToken, mockModeratorToken } =
      await runUserLogin());
  });

  describe('GET /visualization', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/visualization`,
      method: HTTPMethod.GET,
    });

    it('should throw ForbiddenError for retrieving invitations without corresponding permission', async () => {
      [mockUserToken, mockModeratorToken].map(async (token) => {
        const res = await request(app)
          .get('/api/visualization')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`);
        expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
        expect(res.body.errors[0].message).to.equal('Forbidden');
      });
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

      const res = await request(app)
        .get('/api/visualization')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
    });
  });
});
