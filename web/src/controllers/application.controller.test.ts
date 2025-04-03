import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import app from '@/app';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { EnvConfig } from '@/config/env';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { UserRepository } from '@/repositories/user.repository';
import JobPostingRepository from '@/repositories/jobPosting.repository';
import { ApplicationRepository } from '@/repositories/application.repository';
import { AuthService } from '@/services/auth.service';
import {
  expectErrorsArray,
  expectSuccessfulResponse,
} from '@/testutils/response-assertion.testutil';
import { getNewMongoId } from '@/testutils/mongoID.testutil';

describe('POST /applications', () => {
  useMongoDB();

  const sandbox = useSandbox();
  let savedUserId: string;
  let mockToken: string;

  const mockJobPosting = {
    linkId: new mongoose.Types.ObjectId(),
    url: 'vtmp.com',
    jobTitle: 'SWE',
    companyName: 'Apple',
    submittedBy: new mongoose.Types.ObjectId(),
  };

  beforeEach(async () => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);

    const encryptedPassword = await bcrypt.hash('test password', 10);
    const mockUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@gmail.com',
      encryptedPassword,
    };

    savedUserId = (await UserRepository.createUser(mockUser)).id;
    mockToken = await AuthService.login({
      email: mockUser.email,
      password: 'test password',
    });
  });

  it('should return error message with 400 status code if request body schema is invalid', async () => {
    const res = await request(app)
      .post('/api/applications')
      .send({ invalidIdSchema: getNewMongoId() })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${mockToken}`);

    expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
    const errors = res.body.errors;
    expect(errors[0].message).to.equal('Job posting ID is required');
  });

  it('should return error message with 400 status code if jobPostingId format is invalid', async () => {
    const res = await request(app)
      .post('/api/applications')
      .send({ jobPostingId: '123456789' })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${mockToken}`);

    expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
    const errors = res.body.errors;
    expect(errors[0].message).to.equal('Invalid job posting ID format');
  });

  it('it should return error message with status code 404 if job posting does not exist', async () => {
    const res = await request(app)
      .post('/api/applications')
      .send({ jobPostingId: getNewMongoId() })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${mockToken}`);

    expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
    const errors = res.body.errors;
    expect(errors[0].message).to.equal('Job posting not found');
  });

  it('it should return error message with status code 409 if duplicate application exists', async () => {
    const savedJobPostingId = (
      await JobPostingRepository.createJobPosting(mockJobPosting)
    ).id;

    await ApplicationRepository.createApplication({
      jobPostingId: savedJobPostingId,
      userId: savedUserId,
    });

    const res = await request(app)
      .post('/api/applications')
      .send({ jobPostingId: savedJobPostingId })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${mockToken}`);

    expectErrorsArray({ res, statusCode: 409, errorsCount: 1 });
    const errors = res.body.errors;
    expect(errors[0].message).to.equal('Application already exists');
  });

  it('should return application object if an application is created successfully', async () => {
    const savedJobPostingId = (
      await JobPostingRepository.createJobPosting(mockJobPosting)
    ).id;

    const res = await request(app)
      .post('/api/applications')
      .send({ jobPostingId: savedJobPostingId })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${mockToken}`);

    expectSuccessfulResponse({ res, statusCode: 201 });
    expect(res.body.data).to.have.property('jobPostingId', savedJobPostingId);
    expect(res.body.data).to.have.property('userId', savedUserId);
  });
});
