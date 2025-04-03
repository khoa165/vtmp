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
import ApplicationRepository from '@/repositories/application.repository';
<<<<<<< HEAD:web/src/controllers/application.test.ts
import UserService from '@/services/user.service';
import UserRepository from '@/repositories/user.repository';
=======
import { AuthService } from '@/services/auth.service';
import {
  expectErrorsArray,
  expectSuccessfulResponse,
} from '@/testutils/response-assertion.testutil';
>>>>>>> dson/feature/18-api-endpoint-post-applications:web/src/controllers/application.controller.test.ts

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
      .post('/api/applications/create')
      .send({ invalidIdSchema: new mongoose.Types.ObjectId().toString() })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${mockToken}`);

    expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
    const errors = res.body.errors;
    expect(errors[0].message).to.equal('Job posting ID is required');
  });

  it('should return error message with 400 status code if jobPostingId format is invalid', async () => {
    const res = await request(app)
      .post('/api/applications/create')
      .send({ jobPostingId: '123456789' })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${mockToken}`);

    expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
    const errors = res.body.errors;
    expect(errors[0].message).to.equal('Invalid job posting ID format');
  });

  it('it should return error message with status code 404 if job posting does not exist', async () => {
    const res = await request(app)
      .post('/api/applications/create')
      .send({ jobPostingId: new mongoose.Types.ObjectId().toString() })
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
      .post('/api/applications/create')
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
      .post('/api/applications/create')
      .send({ jobPostingId: savedJobPostingId })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${mockToken}`);

    expectSuccessfulResponse({ res, statusCode: 201 });
    expect(res.body.data).to.have.property('jobPostingId', savedJobPostingId);
    expect(res.body.data).to.have.property('userId', savedUserId);
  });
});

describe('GET /applications', () => {
  useMongoDB();

  let newUserId: string;
  let encryptedPassword: string;
  let token: string;
  let mockUser: {
    firstName: string;
    lastName: string;
    email: string;
    encryptedPassword: string;
  };

  let newJobPostingId1: string;
  let newJobPostingId2: string;
  let newApplicationId1: string;
  let newApplicationId2: string;

  beforeEach(async () => {
    // Create user and save to database
    encryptedPassword = await bcrypt.hash('test password', 10);
    mockUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@gmail.com',
      encryptedPassword,
    };
    newUserId = (await UserRepository.create(mockUser)).id;

    // Create auth token
    token = await UserService.login({
      email: mockUser.email,
      password: 'test password',
    });

    // Create a mock job posting
    const jobPosting1 = {
      linkId: new mongoose.Types.ObjectId(),
      url: 'vtmp.com',
      jobTitle: 'SWE',
      companyName: 'Apple',
      submittedBy: newUserId,
    };
    newJobPostingId1 = (
      await JobPostingRepository.createJobPosting(jobPosting1)
    ).id;

    const jobPosting2 = {
      linkId: new mongoose.Types.ObjectId(),
      url: 'vtmp.com',
      jobTitle: 'SWE',
      companyName: 'Apple',
      submittedBy: newUserId,
    };
    newJobPostingId2 = (
      await JobPostingRepository.createJobPosting(jobPosting2)
    ).id;

    // Create two applications
    const application1 = {
      jobPostingId: newJobPostingId1,
      userId: newUserId,
      hasApplied: true,
      status: 'Pending',
      appliedOnDate: new Date('2025-03-03'),
      note: '',
    };
    newApplicationId1 = (
      await ApplicationRepository.createApplication(application1)
    ).id;

    const application2 = {
      jobPostingId: newJobPostingId2,
      userId: newUserId,
      hasApplied: true,
      status: 'Pending',
      appliedOnDate: new Date('2025-09-03'),
      note: '',
    };
    newApplicationId2 = (
      await ApplicationRepository.createApplication(application2)
    ).id;
  });

  it('should return all application objects that belong to the authenticated user', (done) => {
    request(app)
      .get('/api/applications/')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property(
          'message',
          'Get Applications Successfully'
        );
        expect(res.body).to.have.property('data').that.is.an('array');
        expect(res.body.data).to.have.lengthOf(2);

        res.body.data.forEach((application: any) => {
          expect(application).to.have.property('userId', newUserId);
          expect(application).to.have.property('status', 'Pending');
          expect(application).to.have.property('hasApplied', true);
        });

        expect(res.body.data.map((app: any) => app._id)).to.include.members([
          newApplicationId1,
          newApplicationId2,
        ]);
        expect(
          res.body.data.map((app: any) => app.jobPostingId)
        ).to.include.members([newJobPostingId1, newJobPostingId2]);

        done();
      });
  });
});

describe('GET /applications/:id', () => {
  useMongoDB();

  let newUserId: string;
  let encryptedPassword: string;
  let token: string;
  let mockUser: {
    firstName: string;
    lastName: string;
    email: string;
    encryptedPassword: string;
  };

  let newJobPostingId: string;
  let newApplicationId: string;

  beforeEach(async () => {
    // Create user and save to database
    encryptedPassword = await bcrypt.hash('test password', 10);
    mockUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@gmail.com',
      encryptedPassword,
    };
    newUserId = (await UserModel.create(mockUser)).id;

    // Create auth token
    token = await UserService.login({
      email: mockUser.email,
      password: 'test password',
    });

    // Create a mock job posting
    const jobPosting = {
      linkId: new mongoose.Types.ObjectId(),
      url: 'vtmp.com',
      jobTitle: 'SWE',
      companyName: 'Apple',
      submittedBy: newUserId,
    };
    newJobPostingId = (await JobPostingRepository.createJobPosting(jobPosting))
      .id;

    // Create application
    const application = {
      jobPostingId: newJobPostingId,
      userId: newUserId,
      hasApplied: true,
      status: 'Pending',
      appliedOnDate: new Date('2025-03-03'),
      note: '',
    };
    newApplicationId = (
      await ApplicationRepository.createApplication(application)
    ).id;
  });

  it('should return 404 if application is not found or is not belong to authenticated user', (done) => {
    request(app)
      .get(`/api/applications/${newApplicationId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.equal(404);
        expect(res.body).to.have.property('message', 'Application not found');
        done();
      });
  });

  it('should return the application if found and belongs to authenticated user', (done) => {
    request(app)
      .get(`/api/applications/${newApplicationId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property(
          'message',
          'Get Application Successfully'
        );
        expect(res.body).to.have.property('data');

        const data = res.body.data;
        expect(data).to.have.property('_id', newApplicationId);
        expect(data).to.have.property('userId', newUserId);
        expect(data).to.have.property('hasApplied', true);
        expect(data).to.have.property('status', 'Pending');

        done();
      });
  });
});
