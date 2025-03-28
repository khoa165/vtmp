import app from '@/app';
import request from 'supertest';
import { expect } from 'chai';
import { useMongoDB } from '@/config/mongodb.testutils';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import JobPosting from '@/models/jobPosting.model';
import User from '@/models/user.model';
import UserService from '@/services/user.service';

describe('POST /applications', () => {
  useMongoDB();

  let newJobPostingId: string;

  let newUserId: string;

  let encryptedPassword: string;

  let token: string;

  let mockJobPosting: {
    linkId: string;
    url: string;
    jobTitle: string;
    companyName: string;
    submittedBy: string;
  };

  let mockUser: {
    firstName: string;
    lastName: string;
    email: string;
    encryptedPassword: string;
  };

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
  });

  it('should return error message if request body schema is invalid', (done) => {
    request(app)
      .post('/api/applications/create')
      .send({ invalidIdSchema: newJobPostingId })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.equal(401);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Invalid application request schema');
        done();
      });
  });

  it('should return error message if user is not authenticated (req.user is null)', (done) => {
    request(app)
      .post('/api/applications/create')
      .send({ jobPostingId: newJobPostingId })
      .set('Accept', 'application/json')
      // .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.equal(401);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Unauthorized');
        done();
      });
  });

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
