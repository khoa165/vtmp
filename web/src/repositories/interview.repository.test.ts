import { IUser } from '@vtmp/mongo/models';
import { expect } from 'chai';
import { differenceInSeconds } from 'date-fns';

import assert from 'assert';

import {
  InterviewType,
  InterviewStatus,
  JobPostingRegion,
  InterviewShareStatus,
} from '@vtmp/common/constants';

import { IApplication } from '@/models/application.model';
import { ApplicationRepository } from '@/repositories/application.repository';
import { InterviewRepository } from '@/repositories/interview.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { UserRepository } from '@/repositories/user.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId, toMongoId } from '@/testutils/mongoID.testutil';

describe('Interview Repository', () => {
  useMongoDB();

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
    const mockUsers = [
      {
        firstName: 'userA',
        lastName: 'viettech',
        email: 'test1@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      },
      {
        firstName: 'userB',
        lastName: 'viettech',
        email: 'test2@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      },
    ];
    const createdUsers = await Promise.all(
      mockUsers.map((data) => UserRepository.createUser({ ...data }))
    );
    assert(createdUsers[0] && createdUsers[1], 'Failed to create users');
    [user_A, user_B] = createdUsers;

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
      mockJobPostingData.map((data) =>
        JobPostingRepository.createJobPosting({
          jobPostingData: data,
        })
      )
    );
    assert(metaJobPosting && googleJobPosting, 'Failed to create job postings');

    const nestedApplications = await Promise.all(
      [user_A.id, user_B.id].map((userId) =>
        Promise.all([
          ApplicationRepository.createApplication({
            jobPostingId: metaJobPosting.id,
            userId,
          }),
          ApplicationRepository.createApplication({
            jobPostingId: googleJobPosting.id,
            userId,
          }),
        ])
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
    };

    mockInterview_A1 = {
      applicationId: googleApplication_A.id,
      userId: user_A.id,
      types: [InterviewType.CODE_REVIEW],
      interviewOnDate: new Date('2025-06-07'),
      status: InterviewStatus.FAILED,
    };

    mockInterview_A2 = {
      applicationId: metaApplication_A.id,
      userId: user_A.id,
      types: [InterviewType.CODE_REVIEW, InterviewType.HIRING_MANAGER],
      interviewOnDate: new Date('2025-06-07'),
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
      types: [InterviewType.CODE_REVIEW],
      interviewOnDate: new Date('2025-06-07'),
      status: InterviewStatus.PENDING,
    };
  });

  describe('createInterview', () => {
    it('should create a new interview successfully', async () => {
      const newInterview =
        await InterviewRepository.createInterview(mockInterview_A2);

      assert(newInterview);
      expect(newInterview).to.deep.include({
        ...mockInterview_A2,
        applicationId: toMongoId(metaApplication_A.id),
        userId: toMongoId(user_A.id),
        companyName: 'Meta',
        jobTitle: 'Software Engineer',
        location: JobPostingRegion.US,
        status: InterviewStatus.PENDING,
      });
    });
  });

  describe('getInterviewById', () => {
    it('should return null if the interview does not exist', async () => {
      await Promise.all(
        [mockInterview_A0, mockInterview_A1].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      const interview = await InterviewRepository.getInterviewById({
        interviewId: getNewMongoId(),
        userId: user_A.id,
      });

      assert(!interview);
    });

    it('should return null if the interview does not belong to the user', async () => {
      const [interview_A0] = await Promise.all(
        [mockInterview_A0, mockInterview_B0].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      assert(interview_A0);

      const interview = await InterviewRepository.getInterviewById({
        interviewId: interview_A0.id,
        userId: user_B.id,
      });

      assert(!interview);
    });

    it('should return null if the interview is already soft deleted', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
      });

      const interview = await InterviewRepository.getInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
      });

      assert(!interview);
    });

    it('should return the valid interview for authorized user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      const interview = await InterviewRepository.getInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
      });

      assert(interview);
      expect(interview.id).to.equal(interview_A0.id);
      expect(interview).to.deep.include({
        ...mockInterview_A0,
        applicationId: toMongoId(mockInterview_A0.applicationId),
        userId: toMongoId(user_A.id),
      });
    });
  });

  describe('getInterviews', () => {
    it('should return an empty array if no interviews belongs to the provided userId', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);

      const interviews = await InterviewRepository.getInterviews({
        filters: {
          userId: user_B.id,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should not include soft-deleted interviews belong to the provided userId', async () => {
      const [interview_A0, interview_A1] = await Promise.all(
        [mockInterview_A0, mockInterview_A1].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      assert(interview_A0);
      assert(interview_A1);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
      });

      const interviews = await InterviewRepository.getInterviews({
        filters: {
          userId: user_A.id,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0].id).to.equal(interview_A1.id);
    });

    it('should return only interviews belonging to the provided userId', async () => {
      const [interview_A0, interview_A1] = await Promise.all(
        [mockInterview_A0, mockInterview_A1, mockInterview_B0].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      const interviews = await InterviewRepository.getInterviews({
        filters: {
          userId: user_A.id,
        },
      });

      assert(interviews);
      assert(interview_A0);
      assert(interview_A1);
      expect(interviews).to.be.an('array').that.have.lengthOf(2);
      expect(interviews.map((interview) => interview.id)).to.have.members([
        interview_A0.id,
        interview_A1.id,
      ]);
    });

    it('should return empty array when filtering by an applicationId with no interviews', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);

      const interviews = await InterviewRepository.getInterviews({
        filters: {
          userId: user_A.id,
          applicationId: getNewMongoId(),
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should not include soft-deleted interviews when filtering by applicationId', async () => {
      const [interview_A0, interview_A2] = await Promise.all(
        [mockInterview_A0, mockInterview_A2].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      assert(interview_A0);
      assert(interview_A2);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
      });

      const interviews = await InterviewRepository.getInterviews({
        filters: {
          userId: user_A.id,
          applicationId: metaApplication_A.id,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0].id).to.equal(interview_A2.id);
    });

    it('should return only the interviews belonging to the applicationId', async () => {
      const [interview_A0, interview_A2] = await Promise.all(
        [mockInterview_A0, mockInterview_A2, mockInterview_A1].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      const interviews = await InterviewRepository.getInterviews({
        filters: {
          userId: user_A.id,
          applicationId: metaApplication_A.id,
        },
      });

      assert(interview_A0);
      assert(interview_A2);
      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(2);
      expect(interviews.map((interview) => interview.id)).to.have.members([
        interview_A0.id,
        interview_A2.id,
      ]);
    });

    it('should return an empty array when there is no interview that match the filters', async () => {
      await Promise.all(
        [mockInterview_A0, mockInterview_A1, mockInterview_B0].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      const interviews = await InterviewRepository.getInterviews({
        filters: {
          companyName: 'Google',
          status: InterviewStatus.PASSED,
          types: [InterviewType.CODE_REVIEW],
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return interviews of all users that match the filters', async () => {
      const [interview_A0, interview_A2, interview_B1] = await Promise.all(
        [mockInterview_A0, mockInterview_A2, mockInterview_B1].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      const interviews = await InterviewRepository.getInterviews({
        filters: {
          companyName: 'Meta',
          status: InterviewStatus.PENDING,
          types: [InterviewType.CODE_REVIEW, InterviewType.HIRING_MANAGER],
        },
      });

      assert(interview_A0);
      assert(interview_A2);
      assert(interview_B1);
      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      expect(interviews[0]).to.deep.include({
        ...mockInterview_A2,
        applicationId: toMongoId(metaApplication_A.id),
        userId: toMongoId(user_A.id),
        status: InterviewStatus.PENDING,
      });
    });

    it('should not include soft-deleted interviews that match the filters', async () => {
      const [interview_A0, interview_A2, interview_B1] = await Promise.all(
        [mockInterview_A0, mockInterview_A2, mockInterview_B1].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      assert(interview_A0);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
      });

      const interviews = await InterviewRepository.getInterviews({
        filters: {
          companyName: 'Meta',
        },
      });

      assert(interviews);
      assert(interview_A2);
      assert(interview_B1);
      expect(interviews).to.be.an('array').that.have.lengthOf(2);
      expect(interviews.map((interview) => interview.id)).to.have.members([
        interview_A2.id,
        interview_B1.id,
      ]);
    });

    it('should return only the interviews belonging to the userId and applicationId that have the provided status', async () => {
      const [interview_A0, interview_A2] = await Promise.all(
        [mockInterview_A0, mockInterview_A2].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      const interviews = await InterviewRepository.getInterviews({
        filters: {
          userId: user_A.id,
          applicationId: metaApplication_A.id,
          status: InterviewStatus.PENDING,
        },
      });

      assert(interviews);
      assert(interview_A0);
      assert(interview_A2);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0].id).to.equal(interview_A2.id);
      expect(interviews[0].status).to.equal(InterviewStatus.PENDING);
    });

    it('should return an empty array when there is no shared interview that match the filters', async () => {
      await Promise.all(
        [mockInterview_A0, mockInterview_A1, mockInterview_B0].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      const interviews = await InterviewRepository.getInterviews({
        filters: {
          companyName: 'Google',
          status: InterviewStatus.PASSED,
          types: [InterviewType.CODE_REVIEW],
        },
        isShared: true,
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return not return shared interview that has been soft-deleted', async () => {
      const [interview_A0] = await Promise.all(
        [mockInterview_A0, mockInterview_A2].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      assert(interview_A0);

      await InterviewRepository.updateInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
        newUpdate: {
          isDisclosed: true,
          sharedAt: new Date(),
        },
      });

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
      });

      const interviews = await InterviewRepository.getInterviews({
        filters: {},
        isShared: true,
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return shared interviews when isShared is true', async () => {
      const [interview_A0] = await Promise.all(
        [mockInterview_A0, mockInterview_A2].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      assert(interview_A0);

      await InterviewRepository.updateInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
        newUpdate: {
          isDisclosed: true,
          sharedAt: new Date(),
        },
      });

      const interviews = await InterviewRepository.getInterviews({
        filters: {},
        isShared: true,
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0]).to.deep.include({
        ...mockInterview_A0,
        applicationId: toMongoId(metaApplication_A.id),
        userId: toMongoId(user_A.id),
      });
    });

    it('should return the shared interviews with user firstName and lastName when isDisclosed is false', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      await InterviewRepository.updateInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
        newUpdate: {
          isDisclosed: false,
          sharedAt: new Date(),
        },
      });

      const sharedInterviews = await InterviewRepository.getInterviews({
        filters: {
          companyName: 'Meta',
          types: [InterviewType.CODE_REVIEW],
          status: InterviewStatus.PASSED,
        },
        isShared: true,
      });

      assert(sharedInterviews);
      expect(sharedInterviews).to.be.an('array').that.have.lengthOf(1);
      expect(sharedInterviews[0]).to.deep.include({
        ...mockInterview_A0,
        applicationId: toMongoId(metaApplication_A.id),
        userId: toMongoId(user_A.id),
        isDisclosed: false,
        user: {
          firstName: user_A.firstName,
          lastName: user_A.lastName,
        },
      });
    });

    it('should return the shared interviews with user firstName and lastName as Anonymouse User when isDisclosed is true', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      await InterviewRepository.updateInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
        newUpdate: {
          isDisclosed: true,
          sharedAt: new Date(),
        },
      });

      const sharedInterviews = await InterviewRepository.getInterviews({
        filters: {
          companyName: 'Meta',
          types: [InterviewType.CODE_REVIEW],
          status: InterviewStatus.PASSED,
        },
        isShared: true,
      });

      assert(sharedInterviews);
      expect(sharedInterviews).to.be.an('array').that.have.lengthOf(1);
      expect(sharedInterviews[0]).to.deep.include({
        ...mockInterview_A0,
        applicationId: toMongoId(metaApplication_A.id),
        userId: toMongoId(user_A.id),
        isDisclosed: true,
        user: {
          firstName: 'Anonymous',
          lastName: 'User',
        },
      });
    });

    it('should return shared interviews that match the filters', async () => {
      const [interview_A0, interview_A2, interview_B1] = await Promise.all(
        [mockInterview_A0, mockInterview_A2, mockInterview_B1].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      assert(interview_A0 && interview_A2 && interview_B1);

      const sharedInterview = await InterviewRepository.updateInterviewById({
        interviewId: interview_A2.id,
        userId: user_A.id,
        newUpdate: {
          isDisclosed: true,
          sharedAt: new Date(),
        },
      });
      await InterviewRepository.updateInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
        newUpdate: {
          isDisclosed: true,
          sharedAt: new Date(),
        },
      });
      await InterviewRepository.updateInterviewById({
        interviewId: interview_B1.id,
        userId: user_B.id,
        newUpdate: {
          isDisclosed: true,
          sharedAt: new Date(),
        },
      });

      assert(sharedInterview);
      expect(sharedInterview.id).to.equal(interview_A2.id);

      const interviews = await InterviewRepository.getInterviews({
        filters: {
          companyName: 'Meta',
          types: [InterviewType.CODE_REVIEW, InterviewType.HIRING_MANAGER],
          status: InterviewStatus.PENDING,
        },
        isShared: true,
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      expect(interviews[0]).to.deep.include({
        ...mockInterview_A2,
        applicationId: toMongoId(metaApplication_A.id),
        userId: toMongoId(user_A.id),
        isDisclosed: true,
        sharedAt: sharedInterview.sharedAt,
      });
    });
  });

  describe('updateInterviewById', () => {
    it('should return null if no interview with that interviewId exists', async () => {
      const updatedInterview = await InterviewRepository.updateInterviewById({
        interviewId: getNewMongoId(),
        userId: user_A.id,
        newUpdate: { interviewOnDate: new Date('2025-08-10') },
      });

      assert(!updatedInterview);
    });

    it('should return null if the interview does not belong to the authorized user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      const updatedInterview = await InterviewRepository.updateInterviewById({
        interviewId: interview_A0.id,
        userId: user_B.id,
        newUpdate: { interviewOnDate: new Date('2025-08-10') },
      });

      assert(!updatedInterview);
    });

    it('should return null if the interview is soft-deleted', async () => {
      const interview =
        await InterviewRepository.createInterview(mockInterview_B0);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview.id,
        userId: user_B.id,
      });

      const updatedInterview = await InterviewRepository.updateInterviewById({
        interviewId: interview.id,
        userId: user_B.id,
        newUpdate: { interviewOnDate: new Date('2025-08-10') },
      });

      assert(!updatedInterview);
    });

    it('should return the interview with updated metadata fields', async () => {
      const interview =
        await InterviewRepository.createInterview(mockInterview_A1);

      const updatedInterview = await InterviewRepository.updateInterviewById({
        interviewId: interview.id,
        userId: user_A.id,
        newUpdate: {
          interviewOnDate: new Date('2025-08-10'),
          types: [
            InterviewType.PROJECT_WALKTHROUGH,
            InterviewType.HIRING_MANAGER,
          ],
          status: InterviewStatus.PENDING,
          note: 'This interview is updated.',
        },
      });

      assert(updatedInterview);
      expect(updatedInterview.id).to.equal(interview.id);
      expect(updatedInterview).to.deep.include({
        userId: toMongoId(user_A.id),
        interviewOnDate: new Date('2025-08-10'),
        types: [
          InterviewType.PROJECT_WALKTHROUGH,
          InterviewType.HIRING_MANAGER,
        ],
        status: InterviewStatus.PENDING,
        companyName: 'Google',
        note: 'This interview is updated.',
      });
    });

    it('should return the interview with updated shareStatus', async () => {
      const interview_A1 =
        await InterviewRepository.createInterview(mockInterview_A1);

      const sharedInterview = await InterviewRepository.updateInterviewById({
        interviewId: interview_A1.id,
        userId: user_A.id,
        newUpdate: {
          shareStatus: InterviewShareStatus.SHARED_ANONYMOUS,
        },
      });

      assert(sharedInterview);
      expect(sharedInterview.id).to.equal(interview_A1.id);
      expect(sharedInterview.shareStatus).to.equal(
        InterviewShareStatus.SHARED_ANONYMOUS
      );
    });
  });

  describe('updateInterviewsWithStatus', () => {
    it('should not update status of soft-deleted interviews', async () => {
      const [interview_A1, interview_A2] = await Promise.all(
        [mockInterview_A1, mockInterview_A2].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      assert(interview_A1);
      assert(interview_A2);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A1.id,
        userId: user_A.id,
      });

      const interviewUpdateResult =
        await InterviewRepository.updateInterviewsWithStatus({
          userId: user_A.id,
          interviewIds: [interview_A1.id, interview_A2.id],
          updatedStatus: InterviewStatus.FAILED,
        });

      const updatedInterview_A2 = await InterviewRepository.getInterviewById({
        interviewId: interview_A2.id,
        userId: user_A.id,
      });

      assert(interviewUpdateResult);
      assert(updatedInterview_A2);
      expect(interviewUpdateResult).to.have.property('acknowledged', true);
      expect(interviewUpdateResult).to.have.property('modifiedCount', 1);
      expect(interviewUpdateResult).to.have.property('matchedCount', 1);
      expect(updatedInterview_A2.status).to.equal(InterviewStatus.FAILED);
    });

    it('should not update any interviews if not belonging to the user', async () => {
      const interview_B0 =
        await InterviewRepository.createInterview(mockInterview_B0);

      const interviewUpdateResult =
        await InterviewRepository.updateInterviewsWithStatus({
          userId: user_A.id,
          interviewIds: [interview_B0.id],
          updatedStatus: InterviewStatus.PASSED,
        });

      const unchangedInterview = await InterviewRepository.getInterviewById({
        interviewId: interview_B0.id,
        userId: user_B.id,
      });

      assert(interviewUpdateResult);
      assert(unchangedInterview);
      expect(interviewUpdateResult).to.have.property('acknowledged', true);
      expect(interviewUpdateResult).to.have.property('modifiedCount', 0);
      expect(interviewUpdateResult).to.have.property('matchedCount', 0);
      expect(unchangedInterview.status).to.not.equal(InterviewStatus.PASSED);
    });

    it('should only update status of valid interviews of authorized user', async () => {
      const [interview_A1, interview_A2, interview_B0] = await Promise.all(
        [mockInterview_A1, mockInterview_A2, mockInterview_B0].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      assert(interview_A1);
      assert(interview_A2);
      assert(interview_B0);

      const interviewUpdateResult =
        await InterviewRepository.updateInterviewsWithStatus({
          userId: user_A.id,
          interviewIds: [interview_A1.id, interview_A2.id, interview_B0.id],
          updatedStatus: InterviewStatus.PASSED,
        });

      const updatedInterview_A1 = await InterviewRepository.getInterviewById({
        interviewId: interview_A1.id,
        userId: user_A.id,
      });
      const updatedInterview_A2 = await InterviewRepository.getInterviewById({
        interviewId: interview_A2.id,
        userId: user_A.id,
      });

      assert(interviewUpdateResult);
      assert(updatedInterview_A1);
      assert(updatedInterview_A2);
      expect(interviewUpdateResult).to.have.property('acknowledged', true);
      expect(interviewUpdateResult).to.have.property('modifiedCount', 2);
      expect(interviewUpdateResult).to.have.property('matchedCount', 2);
      expect(updatedInterview_A1.status).to.equal(InterviewStatus.PASSED);
      expect(updatedInterview_A2.status).to.equal(InterviewStatus.PASSED);
    });
  });

  describe('deleteInterviewById', () => {
    it('should return null if the interview does not exist', async () => {
      const deletedInterview = await InterviewRepository.deleteInterviewById({
        interviewId: getNewMongoId(),
        userId: user_A.id,
      });

      assert(!deletedInterview);
    });

    it('should return null if the interview does not belong to authorized user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      const deletedInterview = await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: user_B.id,
      });

      assert(!deletedInterview);
    });

    it('should return null if trying to delete an already soft-deleted interview', async () => {
      const interview =
        await InterviewRepository.createInterview(mockInterview_A0);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview.id,
        userId: user_A.id,
      });

      const deletedInterview = await InterviewRepository.deleteInterviewById({
        interviewId: interview.id,
        userId: user_A.id,
      });

      assert(!deletedInterview);
    });

    it('should return and delete the valid interview belonging to the authorized user', async () => {
      const interview =
        await InterviewRepository.createInterview(mockInterview_A1);

      const deletedInterview = await InterviewRepository.deleteInterviewById({
        interviewId: interview.id,
        userId: user_A.id,
      });

      const foundInterview = await InterviewRepository.getInterviewById({
        interviewId: interview.id,
        userId: user_A.id,
      });

      assert(deletedInterview);
      assert(!foundInterview);
      expect(deletedInterview.id).to.equal(interview.id);
      assert(deletedInterview.deletedAt);
      const timeDiff = differenceInSeconds(
        new Date(),
        deletedInterview.deletedAt
      );
      expect(timeDiff).to.lessThan(3);
    });
  });
});
