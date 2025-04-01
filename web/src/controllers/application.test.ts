import app from '@/app';
import request from 'supertest';
import { expect } from 'chai';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import JobPostingRepository from '@/repositories/jobPosting.repository';
import ApplicationRepository from '@/repositories/application.repository';
import UserModel from '@/models/user.model';
import UserService from '@/services/user.service';

describe('POST /applications', () => {
  useMongoDB();

  let savedUserId: string;
  let encryptedPassword: string;
  let mockToken: string;

  const mockJobPosting = {
    linkId: new mongoose.Types.ObjectId().toString(),
    url: 'vtmp.com',
    jobTitle: 'SWE',
    companyName: 'Apple',
    submittedBy: new mongoose.Types.ObjectId().toString(),
  };

  beforeEach(async () => {
    // Before each test, since we need to send a token, we need to build a mockUser, save to database
    // and then generate the token using UserService.login
    encryptedPassword = await bcrypt.hash('test password', 10);
    const mockUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@gmail.com',
      encryptedPassword,
    };
    savedUserId = (await UserModel.create(mockUser)).id;

    mockToken = await UserService.login({
      email: mockUser.email,
      password: 'test password',
    });
  });

  it('should return error message with 400 status code if request body schema is invalid', async () => {
    const res = await request(app)
      .post('/api/applications/create')
      .send({ invalidIdSchema: new mongoose.Types.ObjectId().toString() })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.statusCode).to.equal(400);
    expect(res.body[0]).to.have.property('message', 'Required');
  });

  it('it should return error message with status code 404 if job posting does not exist', async () => {
    const res = await request(app)
      .post('/api/applications/create')
      .send({ jobPostingId: new mongoose.Types.ObjectId().toString() })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.statusCode).to.equal(404);
    expect(res.body[0]).to.have.property('message', 'Job posting not found');
  });

  it('it should return error message with status code 409 if duplicate application exists', async () => {
    // Save mockJobPosting to database to simulate a duplicate
    const savedJobPostingId = (
      await JobPostingRepository.createJobPosting(mockJobPosting)
    ).id;

    await ApplicationRepository.createApplication({
      jobPostingId: savedJobPostingId,
      userId: savedUserId,
    });

    const res = await request(app)
      .post('/api/applications/create')
      .send({ jobPostingId: savedJobPostingId })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.statusCode).to.equal(409);
    expect(res.body[0]).to.have.property(
      'message',
      'Application already exists'
    );
  });

  it('should return application object if an application is created successfully', async () => {
    const savedJobPostingId = (
      await JobPostingRepository.createJobPosting(mockJobPosting)
    ).id;

    const res = await request(app)
      .post('/api/applications/create')
      .send({ jobPostingId: savedJobPostingId })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property(
      'message',
      'Application created successfully'
    );
    expect(res.body).to.have.property('data');
    expect(res.body.data).to.have.property('jobPostingId', savedJobPostingId);
    expect(res.body.data).to.have.property('userId', savedUserId);
  });
});
