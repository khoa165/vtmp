import app from '@/app';
import { EnvConfig } from '@/config/env';
import { UserRepository } from '@/repositories/user.repository';
import { AuthService } from '@/services/auth.service';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import {
  expectErrorsArray,
  expectSuccessfulResponse,
} from '@/testutils/response-assertion.testutil';
import { expect } from 'chai';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import assert from 'assert';
import { getNewObjectId } from '@/testutils/mongoID.testutil';
import { UserRole } from '@vtmp/common/constants';

describe('hasPermission', () => {
  useMongoDB();
  const sandbox = useSandbox();
  let encryptedPassword: string;
  const mockJobPosting = {
    linkId: getNewObjectId(),
    url: 'vtmp.com',
    jobTitle: 'SWE',
    companyName: 'Apple',
    submittedBy: getNewObjectId(),
  };

  const mockUser = {
    firstName: 'mentee',
    lastName: 'viettech',
    email: 'test@gmail.com',
  };

  beforeEach(async () => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
    encryptedPassword = await bcrypt.hash('test password', 10);
  });

  it('should throw ForbiddenError for creating a new application without corresponding permission', async () => {
    await UserRepository.createUser({
      ...mockUser,
      encryptedPassword,
      role: UserRole.MODERATOR,
    });

    const { token } = await AuthService.login({
      email: mockUser.email,
      password: 'test password',
    });

    const jobPosting = await JobPostingRepository.createJobPosting({
      jobPostingData: mockJobPosting,
    });
    assert(jobPosting);

    const res = await request(app)
      .post('/api/applications')
      .send({ jobPostingId: jobPosting.id })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
    expect(res.body.errors[0].message).to.eq('Forbidden');
  });

  it('should allow user to create a new application with corresponding permission', async () => {
    await UserRepository.createUser({
      ...mockUser,
      encryptedPassword,
    });

    const { token, user } = await AuthService.login({
      email: mockUser.email,
      password: 'test password',
    });

    const jobPosting = await JobPostingRepository.createJobPosting({
      jobPostingData: mockJobPosting,
    });
    assert(jobPosting);

    const res = await request(app)
      .post('/api/applications')
      .send({ jobPostingId: jobPosting.id })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expectSuccessfulResponse({ res, statusCode: 201 });
    expect(res.body.data).to.have.property('jobPostingId', jobPosting.id);
    expect(res.body.data).to.have.property('userId', user._id.toString());
  });
});
