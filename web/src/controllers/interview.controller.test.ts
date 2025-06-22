import bcrypt from 'bcryptjs';
import { assert, expect } from 'chai';
import { omit } from 'remeda';
import request from 'supertest';

import {
  InterviewStatus,
  InterviewType,
  SystemRole,
} from '@vtmp/common/constants';

import app from '@/app';
import { EnvConfig } from '@/config/env';
import { IApplication } from '@/models/application.model';
import { IInterview } from '@/models/interview.model';
import { IUser } from '@/models/user.model';
import { ApplicationRepository } from '@/repositories/application.repository';
import { InterviewRepository } from '@/repositories/interview.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { UserRepository } from '@/repositories/user.repository';
import { AuthService } from '@/services/auth.service';
import {
  HTTPMethod,
  runDefaultAuthMiddlewareTests,
} from '@/testutils/auth.testutils';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import {
  expectErrorsArray,
  expectSuccessfulResponse,
} from '@/testutils/response-assertion.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';

describe('InterviewController', () => {
  useMongoDB();
  const sandbox = useSandbox();
  let mockToken_A: string;
  let mockToken_B: string;

  interface MockInterview {
    applicationId: string;
    userId: string;
    types: InterviewType[];
    interviewOnDate: Date;
    status?: InterviewStatus;
    note?: string;
  }

  let user_A: IUser;
  let user_B: IUser;

  let metaApplication_A: IApplication;
  let googleApplication_A: IApplication;
  let metaApplication_B: IApplication;
  let googleApplication_B: IApplication;

  let mockInterview_A0: MockInterview;
  let mockInterview_A1: MockInterview;
  let mockInterview_A2: MockInterview;
  let mockInterview_B0: MockInterview;
  let mockInterview_B1: MockInterview;

  beforeEach(async () => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);

    const encryptedPassword = await bcrypt.hash('test password', 10);
    const mockUsers = [
      {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'testA@gmail.com',
        encryptedPassword,
        role: SystemRole.ADMIN,
      },
      {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'testB@gmail.com',
        encryptedPassword,
        role: SystemRole.USER,
      },
    ];

    const createdUsers = await Promise.all(
      mockUsers.map((data) => UserRepository.createUser({ ...data }))
    );
    assert(createdUsers[0] && createdUsers[1], 'Failed to create users');
    [user_A, user_B] = createdUsers;

    ({ token: mockToken_A } = await AuthService.login({
      email: user_A.email,
      password: 'test password',
    }));

    ({ token: mockToken_B } = await AuthService.login({
      email: user_B.email,
      password: 'test password',
    }));

    const mockJobPostingData = [
      {
        linkId: getNewMongoId(),
        url: 'http://meta.com/job-posting',
        jobTitle: 'Software Engineer',
        companyName: 'Meta',
        submittedBy: getNewMongoId(),
      },
      {
        linkId: getNewMongoId(),
        url: 'http://google.com/job-posting',
        jobTitle: 'Software Engineer',
        companyName: 'Google',
        submittedBy: getNewMongoId(),
      },
    ];

    const [metaJobPosting, googleJobPosting] = await Promise.all(
      mockJobPostingData.map(
        (data) =>
          JobPostingRepository.createJobPosting({
            jobPostingData: data,
          }) as Promise<{ id: string }>
      )
    );
    assert(metaJobPosting && googleJobPosting, 'Failed to create job postings');

    const nestedApplications = await Promise.all(
      [user_A.id, user_B.id].map(
        (userId) =>
          Promise.all([
            ApplicationRepository.createApplication({
              jobPostingId: metaJobPosting.id,
              userId,
            }),
            ApplicationRepository.createApplication({
              jobPostingId: googleJobPosting.id,
              userId,
            }),
          ]) as Promise<[IApplication, IApplication]>
      )
    );

    assert(
      nestedApplications[0] && nestedApplications[1],
      'Failed to create applications'
    );
    [metaApplication_A, googleApplication_A] = nestedApplications[0];
    [metaApplication_B, googleApplication_B] = nestedApplications[1];

    mockInterview_A0 = {
      applicationId: metaApplication_A.id,
      userId: user_A.id,
      types: [InterviewType.CODE_REVIEW],
      interviewOnDate: new Date('2025-06-07'),
      status: InterviewStatus.PASSED,
      note: 'Lets crush it',
    };

    mockInterview_A1 = {
      applicationId: googleApplication_A.id,
      userId: user_A.id,
      types: [InterviewType.CODE_REVIEW],
      interviewOnDate: new Date('2025-06-07'),
      status: InterviewStatus.FAILED,
      note: 'Nice try',
    };

    mockInterview_A2 = {
      applicationId: metaApplication_A.id,
      userId: user_A.id,
      types: [InterviewType.CODE_REVIEW],
      interviewOnDate: new Date('2025-07-07'),
      note: 'Good job',
    };

    mockInterview_B0 = {
      applicationId: googleApplication_B.id,
      userId: user_B.id,
      types: [InterviewType.CODE_REVIEW],
      interviewOnDate: new Date('2025-06-07'),
      status: InterviewStatus.PENDING,
    };

    mockInterview_B1 = {
      applicationId: metaApplication_B.id,
      userId: user_B.id,
      types: [InterviewType.PROJECT_WALKTHROUGH],
      interviewOnDate: new Date('2025-06-07'),
      status: InterviewStatus.PASSED,
    };
  });

  describe('POST /api/interviews', () => {
    const url = '/api/interviews';

    runDefaultAuthMiddlewareTests({
      route: url,
      method: HTTPMethod.POST,
      body: {
        applicationId: getNewMongoId(),
        types: [InterviewType.CODE_REVIEW],
        interviewOnDate: new Date().toISOString(),
      },
    });

    it('should return error message with 400 status code if request body schema is invalid', async () => {
      const res = await request(app)
        .post(url)
        .set('Authorization', `Bearer ${mockToken_A}`)
        .set('Accept', 'application/json')
        .send({});
      expectErrorsArray({ res, statusCode: 400, errorsCount: 3 });
      expect(res.body.errors).to.deep.include.members([
        { message: 'Application ID is required' },
        { message: 'Interview types is required' },
        { message: 'Invalid date' },
      ]);
    });

    it('should return error message with 400 status code if interview types is an empty array', async () => {
      const res = await request(app)
        .post(url)
        .set('Authorization', `Bearer ${mockToken_A}`)
        .set('Accept', 'application/json')
        .send({
          applicationId: googleApplication_B.id,
          types: [],
          interviewOnDate: new Date('2025-06-07'),
          status: InterviewStatus.PENDING,
        });
      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors).to.deep.include.members([
        { message: 'Must select at least 1 interview type' },
      ]);
    });

    it('should return error message with 400 status code if applicationId format is invalid', async () => {
      const res = await request(app)
        .post(url)
        .set('Authorization', `Bearer ${mockToken_A}`)
        .set('Accept', 'application/json')
        .send({
          applicationId: 'not-an-valid-id',
          types: [InterviewType.CODE_REVIEW],
          interviewOnDate: new Date().toISOString(),
        });
      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Invalid application ID format'
      );
    });

    it('should return interview object if an interview is created successfully', async () => {
      const res = await request(app)
        .post(url)
        .set('Authorization', `Bearer ${mockToken_A}`)
        .set('Accept', 'application/json')
        .send(omit(mockInterview_A2, ['userId']));

      expectSuccessfulResponse({ res, statusCode: 201 });
      expect(res.body.data).to.deep.include({
        applicationId: mockInterview_A2.applicationId,
        userId: mockInterview_A2.userId,
        status: InterviewStatus.PENDING,
        note: mockInterview_A2.note,
        interviewOnDate: mockInterview_A2.interviewOnDate.toISOString(),
      });
    });
  });

  describe('GET /api/interviews/:interviewId', () => {
    const endpoint = (id: string) => `/api/interviews/${id}`;

    runDefaultAuthMiddlewareTests({
      route: endpoint(getNewMongoId()),
      method: HTTPMethod.GET,
    });
    let interview: IInterview;

    beforeEach(async () => {
      interview = await InterviewRepository.createInterview(mockInterview_A0);
    });

    it('should return error message with 400 status code if interviewId param is invalid', async () => {
      const res = await request(app)
        .get(endpoint('12345'))
        .set('Authorization', `Bearer ${mockToken_A}`);
      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Invalid interview ID format'
      );
    });

    it('should return error message with 404 status code if interview is not found', async () => {
      const fakeId = getNewMongoId();
      const res = await request(app)
        .get(endpoint(fakeId))
        .set('Authorization', `Bearer ${mockToken_A}`);
      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Interview not found');
    });

    it('should return error message with 404 status code if interview does not belongs to the authorized user', async () => {
      const res = await request(app)
        .get(endpoint(interview.id))
        .set('Authorization', `Bearer ${mockToken_B}`);
      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Interview not found');
    });

    it('should return interview with the given interviewId that belongs to the authorized user', async () => {
      const res = await request(app)
        .get(endpoint(interview.id))
        .set('Authorization', `Bearer ${mockToken_A}`);
      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.have.property('_id', interview.id);
      expect(res.body.data).to.have.property('userId', user_A.id);
    });
  });

  describe('GET /api/interviews', () => {
    const url = '/api/interviews';

    runDefaultAuthMiddlewareTests({
      route: url,
      method: HTTPMethod.GET,
    });

    it('should return an empty array when none exist', async () => {
      const res = await request(app)
        .get(url)
        .set('Authorization', `Bearer ${mockToken_A}`);
      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return an error message when accessed by an user without the required role (no filter)', async () => {
      await Promise.all(
        [mockInterview_A0, mockInterview_A1, mockInterview_B0].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      const res = await request(app)
        .get(url)
        .set('Authorization', `Bearer ${mockToken_B}`);
      expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Forbidden');
    });

    it('returns all interviews when no filter is applied', async () => {
      const interviews = await Promise.all(
        [mockInterview_A0, mockInterview_A1, mockInterview_B0].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      const res = await request(app)
        .get(url)
        .set('Authorization', `Bearer ${mockToken_A}`);
      expectSuccessfulResponse({ res, statusCode: 200 });
      const returnedIds = res.body.data.map((i: IInterview) => i._id);
      expect(returnedIds).to.have.members(interviews.map((i) => i.id));
    });

    it('should not return soft-deleted interviews when no filter is applied', async () => {
      const [interview_A0, interview_A1, interview_B0] = await Promise.all(
        [mockInterview_A0, mockInterview_A1, mockInterview_B0].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      assert(
        interview_A0 && interview_A1 && interview_B0,
        'Failed to create interviews'
      );

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
      });

      const res = await request(app)
        .get(url)
        .set('Authorization', `Bearer ${mockToken_A}`);
      expectSuccessfulResponse({ res, statusCode: 200 });
      const returnedIds = res.body.data.map((i: IInterview) => i._id);
      expect(returnedIds).to.have.members([interview_A1.id, interview_B0.id]);
    });
  });

  describe('GET /api/interviews/by-application/:applicationId', () => {
    const endpoint = (appId: string) =>
      `/api/interviews/by-application/${appId}`;

    it('should return 400 when applicationId malformed', async () => {
      const res = await request(app)
        .get(endpoint('not-a-valid-id'))
        .set('Authorization', `Bearer ${mockToken_A}`);
      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Invalid application ID format'
      );
    });

    it('should return an empty array if the given applicationId does not belong to the authorized user', async () => {
      await Promise.all(
        [mockInterview_A0, mockInterview_A2].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      const res = await request(app)
        .get(endpoint(metaApplication_A.id))
        .set('Authorization', `Bearer ${mockToken_B}`);
      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return interviews that have the provided applicationId', async () => {
      const [interview_A0, interview_A2] = await Promise.all(
        [mockInterview_A0, mockInterview_A2, mockInterview_A1].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );
      const res = await request(app)
        .get(endpoint(metaApplication_A.id))
        .set('Authorization', `Bearer ${mockToken_A}`);
      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').with.lengthOf(2);
      assert(interview_A0 && interview_A2, 'Failed to create interviews');
      expect(
        res.body.data.map((interview: IInterview) => interview._id)
      ).to.have.members([interview_A0.id, interview_A2.id]);
    });
  });

  describe('GET /api/interviews/share', () => {
    const endpoint = `/api/interviews/share`;

    it('should return error message with status code 400 if query.companyName missing', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);

      const res = await request(app)
        .get('/api/interviews/by-company/')
        .set('Authorization', `Bearer ${mockToken_A}`);
      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Company Name is required');
    });

    it('should return an empty array if no interviews found', async () => {
      const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${mockToken_A}`);
      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return interviews with the given companyName', async () => {
      const [interview_A0, interview_A2, interview_B1] = await Promise.all(
        [
          mockInterview_A0,
          mockInterview_A2,
          mockInterview_B1,
          mockInterview_A1,
          mockInterview_B0,
        ].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      assert(
        interview_A0 && interview_A2 && interview_B1,
        'Failed to create interviews'
      );

      const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${mockToken_B}`);
      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(3);
      expect(
        res.body.data.map((interview: IInterview) => interview._id)
      ).to.have.members([interview_A0.id, interview_A2.id, interview_B1.id]);
    });
  });

  describe('PUT /api/interviews/:interviewId', () => {
    const endpoint = (id: string) => `/api/interviews/${id}`;

    runDefaultAuthMiddlewareTests({
      route: endpoint(getNewMongoId()),
      method: HTTPMethod.PUT,
    });

    it('should return an error message with status code 400 if the interviewId is not valid', async () => {
      const res = await request(app)
        .put(endpoint('not-a-valid-id'))
        .set('Authorization', `Bearer ${mockToken_A}`)
        .send({ note: 'hi' });
      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
    });

    it('should return an error message with status code 404 if the interview is not found', async () => {
      const fakeInterview = getNewMongoId();
      const res = await request(app)
        .put(endpoint(fakeInterview))
        .set('Authorization', `Bearer ${mockToken_A}`)
        .send({ note: 'update' });
      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Interview not found');
    });

    it('should return an error message with status code 404 if the interview does not belong to the authorized user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      const res = await request(app)
        .put(endpoint(interview_A0.id))
        .set('Authorization', `Bearer ${mockToken_B}`)
        .send({ note: 'update' });
      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Interview not found');
    });

    it('should return the successfully updated interview object', async () => {
      const interview =
        await InterviewRepository.createInterview(mockInterview_A0);

      const res = await request(app)
        .put(endpoint(interview.id))
        .set('Authorization', `Bearer ${mockToken_A}`)
        .send({
          status: InterviewStatus.PASSED,
          note: 'All good',
        });

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.include({
        _id: interview.id,
        status: InterviewStatus.PASSED,
        note: 'All good',
      });
    });
  });

  describe('PUT /api/interviews/share/:interviewId', () => {
    const endpoint = (id: string) => `/api/interviews/share/${id}`;

    runDefaultAuthMiddlewareTests({
      route: endpoint(getNewMongoId()),
      method: HTTPMethod.PUT,
    });

    it('should return an error message with status code 400 if the interviewId is not valid', async () => {
      const res = await request(app)
        .put(endpoint('not-a-valid-id'))
        .set('Authorization', `Bearer ${mockToken_A}`)
        .send({ isDisclosed: false });
      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Invalid interview ID format'
      );
    });

    it('should return an error message with status code 404 if the interview is not found', async () => {
      const fakeInterview = getNewMongoId();
      const res = await request(app)
        .put(endpoint(fakeInterview))
        .set('Authorization', `Bearer ${mockToken_A}`)
        .send({ isDisclosed: false });
      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Interview not found');
    });

    it('should return an error message with status code 404 if the interview does not belong to the authorized user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      const res = await request(app)
        .put(endpoint(interview_A0.id))
        .set('Authorization', `Bearer ${mockToken_B}`)
        .send({ isDisclosed: false });
      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Interview not found');
    });

    it('should return the successfully updated interview object with isDisclosed set to false', async () => {
      const interview =
        await InterviewRepository.createInterview(mockInterview_A0);

      const res = await request(app)
        .put(endpoint(interview.id))
        .set('Authorization', `Bearer ${mockToken_A}`)
        .send({ isDisclosed: false });

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.include({
        _id: interview.id,
        isDisclosed: false,
      });
    });
  });

  describe('PUT /api/interviews/unshare/:interviewId', () => {
    const endpoint = (id: string) => `/api/interviews/unshare/${id}`;

    runDefaultAuthMiddlewareTests({
      route: endpoint(getNewMongoId()),
      method: HTTPMethod.PUT,
    });

    it('should return an error message with status code 400 if the interviewId is not valid', async () => {
      const res = await request(app)
        .put(endpoint('not-a-valid-id'))
        .set('Authorization', `Bearer ${mockToken_A}`);
      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Invalid interview ID format'
      );
    });

    it('should return an error message with status code 404 if the interview is not found', async () => {
      const fakeInterview = getNewMongoId();
      const res = await request(app)
        .put(endpoint(fakeInterview))
        .set('Authorization', `Bearer ${mockToken_A}`);
      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Interview not found');
    });

    it('should return an error message with status code 404 if the interview does not belong to the authorized user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      const res = await request(app)
        .put(endpoint(interview_A0.id))
        .set('Authorization', `Bearer ${mockToken_B}`);
      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Interview not found');
    });

    it('should return the successfully unshare interview object with isDisclosed set to true', async () => {
      const interview =
        await InterviewRepository.createInterview(mockInterview_A0);

      await request(app)
        .post(`/api/interviews/unshare/${interview.id}`)
        .set('Authorization', `Bearer ${mockToken_A}`);

      const res = await request(app)
        .put(endpoint(interview.id))
        .set('Authorization', `Bearer ${mockToken_A}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.include({
        _id: interview.id,
        isDisclosed: true,
        sharedAt: null,
      });
    });
  });

  describe('DELETE /api/interviews/:interviewId', () => {
    const endpoint = (id: string) => `/api/interviews/${id}`;

    runDefaultAuthMiddlewareTests({
      route: endpoint(getNewMongoId()),
      method: HTTPMethod.DELETE,
    });

    it('should return an error message with status code 400 if the interviewId is not valid', async () => {
      const res = await request(app)
        .delete(endpoint('nope'))
        .set('Authorization', `Bearer ${mockToken_A}`);
      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
    });

    it('should return an error message with status code 404 if the interview is not found', async () => {
      const fakeInterview = getNewMongoId();
      const res = await request(app)
        .delete(endpoint(fakeInterview))
        .set('Authorization', `Bearer ${mockToken_A}`);
      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
    });

    it('should return an error message with status code 404 if the interview does not belong to the authorized user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      const res = await request(app)
        .put(endpoint(interview_A0.id))
        .set('Authorization', `Bearer ${mockToken_B}`)
        .send({ note: 'update' });
      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
    });

    it('should return the successfully deleted interview', async () => {
      const created = await InterviewRepository.createInterview({
        applicationId: getNewMongoId(),
        userId: user_A.id,
        types: [InterviewType.DEBUGGING],
        interviewOnDate: new Date(),
      });
      const res = await request(app)
        .delete(endpoint(created.id))
        .set('Authorization', `Bearer ${mockToken_A}`);
      expectSuccessfulResponse({ res, statusCode: 200 });
      await request(app)
        .get(`/api/interviews/${created.id}`)
        .set('Authorization', `Bearer ${mockToken_A}`)
        .expect(404);
    });
  });
});
