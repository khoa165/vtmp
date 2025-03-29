import app from '@/app';
import request from 'supertest';
import { expect } from 'chai';
import { useMongoDB } from '@/config/mongodb.testutils';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import JobPosting from '@/models/jobPosting.model';
import User from '@/models/user.model';
import UserService from '@/services/user.service';
import Application from '@/models/application.model';

describe('POST /applications', () => {
  useMongoDB();

  let mockJobPosting: {
    linkId: string;
    url: string;
    jobTitle: string;
    companyName: string;
    submittedBy: string;
  };

  let newJobPostingId: string;

  let newUserId: string;

  let encryptedPassword: string;

  let mockUser: {
    firstName: string;
    lastName: string;
    email: string;
    encryptedPassword: string;
  };

  let token: string;

  beforeEach(async () => {
    // Create job posting and save to database
    mockJobPosting = {
      linkId: new mongoose.Types.ObjectId().toString(),
      url: 'vtmp.com',
      jobTitle: 'SWE',
      companyName: 'Apple',
      submittedBy: new mongoose.Types.ObjectId().toString(),
    };
    newJobPostingId = (await JobPosting.create(mockJobPosting)).id;

    // Create user and save to database
    encryptedPassword = await bcrypt.hash('test password', 10);
    mockUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@gmail.com',
      encryptedPassword,
    };
    newUserId = (await User.create(mockUser)).id;

    // Mock create token
    token = await UserService.login({
      email: mockUser.email,
      password: 'test password',
    });

    // Mock middleware dynamically
    // app.use((req, res, next) => {
    //   req.user = { id: newUserId, email: 'some-email' };
    //   console.log('Mock auth middleware runs with userId', newUserId);
    //   next();
    // });
  });

  it.skip('should return error message if request body schema is invalid', (done) => {});

  it.skip('should return error message if user is not authenticated (req.user is null)', (done) => {});

  it('should return application object if an application is created successfully', (done) => {
    request(app)
      .post('/api/applications/create')
      .send({ jobPostingId: newJobPostingId })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.equal(201);
        expect(res.body).to.have.property(
          'message',
          'Application created successfully'
        );
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('jobPostingId', newJobPostingId);
        expect(res.body.data).to.have.property('userId', newUserId);
        done();
      });
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
    newUserId = (await User.create(mockUser)).id;

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
    newJobPostingId1 = (await JobPosting.create(jobPosting1)).id;

    const jobPosting2 = {
      linkId: new mongoose.Types.ObjectId(),
      url: 'vtmp.com',
      jobTitle: 'SWE',
      companyName: 'Apple',
      submittedBy: newUserId,
    };
    newJobPostingId2 = (await JobPosting.create(jobPosting2)).id;

    // Create two applications
    const application1 = {
      jobPostingId: newJobPostingId1,
      userId: newUserId,
      hasApplied: true,
      status: 'Pending',
      appliedOnDate: new Date('2025-03-03'),
      note: '',
    };
    newApplicationId1 = (await Application.create(application1)).id;

    const application2 = {
      jobPostingId: newJobPostingId2,
      userId: newUserId,
      hasApplied: true,
      status: 'Pending',
      appliedOnDate: new Date('2025-09-03'),
      note: '',
    };
    newApplicationId2 = (await Application.create(application2)).id;
  });

  it('should return error message if user is not authenticated (req.user is null)', (done) => {
    request(app)
      .get('/api/applications/')
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.equal(401);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Unauthorized user');
        done();
      });
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
    newUserId = (await User.create(mockUser)).id;

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
    newJobPostingId = (await JobPosting.create(jobPosting)).id;

    // Create application
    const application = {
      jobPostingId: newJobPostingId,
      userId: newUserId,
      hasApplied: true,
      status: 'Pending',
      appliedOnDate: new Date('2025-03-03'),
      note: '',
    };
    newApplicationId = (await Application.create(application)).id;
  });

  it('should return 401 if user is not authenticated', (done) => {
    request(app)
      .get(`/api/applications/${newApplicationId}`)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.equal(401);
        expect(res.body).to.have.property('message', 'Unauthorized user');
        done();
      });
  });

  it('should return 500 if application is not found or is not belong to authenticated user', (done) => {
    request(app)
      .get(`/api/applications/${newApplicationId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.equal(500);
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
