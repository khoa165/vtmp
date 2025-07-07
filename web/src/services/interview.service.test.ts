import { IUser } from '@vtmp/mongo/models';
import { expect } from 'chai';
import { differenceInSeconds } from 'date-fns';

import assert from 'assert';

import {
  InterviewShareStatus,
  InterviewStatus,
  InterviewType,
} from '@vtmp/common/constants';

import { IApplication } from '@/models/application.model';
import { ApplicationRepository } from '@/repositories/application.repository';
import { InterviewRepository } from '@/repositories/interview.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { UserRepository } from '@/repositories/user.repository';
import { InterviewService } from '@/services/interview.service';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId, toMongoId } from '@/testutils/mongoID.testutil';
import { BadRequest, ResourceNotFoundError } from '@/utils/errors';

describe('InterviewService', () => {
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
    it('should be able to create a new interview', async () => {
      const newInterview =
        await InterviewRepository.createInterview(mockInterview_A2);

      assert(newInterview);
      expect(newInterview).to.deep.include({
        ...mockInterview_A2,
        applicationId: toMongoId(mockInterview_A2.applicationId),
        userId: toMongoId(user_A.id),
        status: InterviewStatus.PENDING,
        companyName: 'Meta',
      });
    });
  });

  describe('getInterviewsById', () => {
    it('should throw an error if the interview does not exist', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);

      await expect(
        InterviewService.getInterviewById({
          interviewId: getNewMongoId(),
          userId: user_A.id,
        })
      ).eventually.to.be.rejectedWith(
        ResourceNotFoundError,
        'Interview not found'
      );
    });

    it('should throw an error if the interview does not belong to the authorized user', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);

      await expect(
        InterviewService.getInterviewById({
          interviewId: mockInterview_A0.applicationId,
          userId: user_B.id,
        })
      ).eventually.to.be.rejectedWith(
        ResourceNotFoundError,
        'Interview not found'
      );
    });

    it('should throw an error if the interview is already soft deleted', async () => {
      const interview_A1 =
        await InterviewRepository.createInterview(mockInterview_A1);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A1.id,
        userId: user_A.id,
      });

      expect(
        InterviewService.getInterviewById({
          interviewId: interview_A1.id,
          userId: user_A.id,
        })
      ).eventually.to.be.rejectedWith(
        ResourceNotFoundError,
        'Interview not found'
      );
    });

    it('should not throw an error if the interview exists and belongs to the user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      await expect(
        InterviewService.getInterviewById({
          interviewId: interview_A0.id,
          userId: user_A.id,
        })
      ).eventually.to.be.fulfilled;
    });

    it('should only return the valid interview that belongs to the authorized user', async () => {
      const interview_B0 =
        await InterviewRepository.createInterview(mockInterview_B0);

      const interview = await InterviewService.getInterviewById({
        interviewId: interview_B0.id,
        userId: user_B.id,
      });

      assert(interview);
      expect(interview).to.deep.include({
        ...mockInterview_B0,
        applicationId: toMongoId(mockInterview_B0.applicationId),
        userId: toMongoId(mockInterview_B0.userId),
      });
    });
  });

  describe('getInterviews', () => {
    it('should return an empty array if no interviews belongs to the provided userId', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);

      const interviews = await InterviewService.getInterviews({
        filters: {
          userId: user_B.id,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should not include soft-deleted interviews belong to the provided userId', async () => {
      const [interview_A0] = await Promise.all(
        [mockInterview_A0, mockInterview_A1, mockInterview_B0].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      assert(interview_A0);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
      });

      const interviews = await InterviewService.getInterviews({
        filters: { userId: user_A.id },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0]).to.deep.include({
        ...mockInterview_A1,
        applicationId: toMongoId(mockInterview_A1.applicationId),
        userId: toMongoId(mockInterview_A1.userId),
      });
    });

    it('should return only interviews belonging to the provided userId', async () => {
      const [interview_A0, interview_A1] = await Promise.all(
        [mockInterview_A0, mockInterview_A1, mockInterview_B0].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      const interviews = await InterviewService.getInterviews({
        filters: { userId: user_A.id },
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
      await Promise.all(
        [mockInterview_A0, mockInterview_A1].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      const interviews = await InterviewService.getInterviews({
        filters: {
          userId: user_A.id,
          applicationId: getNewMongoId(),
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should not include soft-deleted interviews when filtering by applicationId', async () => {
      const [interview_A0] = await Promise.all(
        [mockInterview_A0, mockInterview_A2].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      assert(interview_A0);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
      });

      const interviews = await InterviewService.getInterviews({
        filters: {
          userId: user_A.id,
          applicationId: metaApplication_A.id,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0]).to.deep.include({
        ...mockInterview_A2,
        applicationId: toMongoId(metaApplication_A.id),
        userId: toMongoId(user_A.id),
      });
    });

    it('should return only the interviews belonging to the applicationId', async () => {
      const [interview_A0, interview_A2] = await Promise.all(
        [mockInterview_A0, mockInterview_A2, mockInterview_B1].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      const interviews = await InterviewService.getInterviews({
        filters: {
          userId: user_A.id,
          applicationId: mockInterview_A0.applicationId,
        },
      });

      assert(interviews);
      assert(interview_A0);
      assert(interview_A2);
      expect(interviews).to.be.an('array').that.have.lengthOf(2);
      expect(interviews.map((interview) => interview.id)).to.have.members([
        interview_A0.id,
        interview_A2.id,
      ]);
    });

    it('should return an empty array when there is no interview that match the filters', async () => {
      await Promise.all(
        [mockInterview_A0, mockInterview_A1].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      const interviews = await InterviewService.getInterviews({
        filters: {
          userId: user_A.id,
          status: InterviewStatus.UPCOMING,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should not include soft-deleted interviews that match the filters', async () => {
      const [interview_A0, interview_A2, interview_B1] = await Promise.all(
        [mockInterview_A0, mockInterview_A2, mockInterview_B1].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      assert(interview_A0 && interview_A2 && interview_B1);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A2.id,
        userId: user_A.id,
      });

      const interviews = await InterviewService.getInterviews({
        filters: {
          companyName: interview_A2.companyName || 'Meta',
          status: interview_A2.status,
          types: interview_A2.types,
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

      assert(interview_A0 && interview_A2 && interview_B1);

      const interviews = await InterviewService.getInterviews({
        filters: {
          companyName: 'Meta',
          types: [InterviewType.CODE_REVIEW, InterviewType.HIRING_MANAGER],
          status: InterviewStatus.PENDING,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      expect(interviews[0]).to.deep.include({
        ...mockInterview_A2,
        applicationId: toMongoId(metaApplication_A.id),
        userId: toMongoId(user_A.id),
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

      const interviews = await InterviewService.getInterviews({
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
    const newUpdate = {
      status: InterviewStatus.PASSED,
      interviewOnDate: new Date('2025-06-07'),
      note: 'Updated note',
    };

    it('should throw error if the interview does not exist', async () => {
      await expect(
        InterviewService.updateInterviewById({
          interviewId: getNewMongoId(),
          userId: user_A.id,
          newUpdate,
        })
      ).eventually.to.be.rejectedWith(
        ResourceNotFoundError,
        'Interview not found'
      );
    });

    it('should throw error if the interview does not belong to the authorized user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      await expect(
        InterviewService.updateInterviewById({
          interviewId: interview_A0.id,
          userId: user_B.id,
          newUpdate,
        })
      ).eventually.to.be.rejectedWith(
        ResourceNotFoundError,
        'Interview not found'
      );
    });

    it('should throw error if the interview is already soft deleted', async () => {
      const interview_A1 =
        await InterviewRepository.createInterview(mockInterview_A1);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A1.id,
        userId: user_A.id,
      });

      await expect(
        InterviewService.updateInterviewById({
          interviewId: interview_A1.id,
          userId: user_A.id,
          newUpdate: newUpdate,
        })
      ).eventually.to.be.rejectedWith(
        ResourceNotFoundError,
        'Interview not found'
      );
    });

    it('should update the interview with the provided newUpdate', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      const updatedInterview = await InterviewService.updateInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
        newUpdate: newUpdate,
      });

      assert(updatedInterview);
      expect(updatedInterview.id).to.equal(interview_A0.id);
      expect(updatedInterview.status).to.equal(newUpdate.status);
      expect(updatedInterview.interviewOnDate).to.deep.equal(
        newUpdate.interviewOnDate
      );
      expect(updatedInterview.note).to.equal(newUpdate.note);
    });
  });

  describe('updateInterviewShareStatus', () => {
    it('should throw error if the interview does not exist', async () => {
      await expect(
        InterviewService.updateInterviewShareStatus({
          interviewId: getNewMongoId(),
          userId: userId_A,
          shareStatus: InterviewShareStatus.SHARED_ANONYMOUS,
        })
      ).eventually.to.be.rejectedWith(
        ResourceNotFoundError,
        'Interview not found'
      );
    });

    it('should throw error when unsharing an interview that has been shared before', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      await InterviewRepository.updateInterviewById({
        interviewId: interview_A0.id,
        userId: userId_A,
        newUpdate: {
          shareStatus: InterviewShareStatus.SHARED_PUBLIC,
        },
      });

      await expect(
        InterviewService.updateInterviewShareStatus({
          interviewId: interview_A0.id,
          userId: userId_A,
          shareStatus: InterviewShareStatus.UNSHARED,
        })
      ).eventually.to.be.rejectedWith(
        BadRequest,
        'Cannot unshare an interview that is already shared'
      );
    });

    it('should update the shareStatus of an unshared interview', async () => {
      const [interview_A0, interview_B1] = await Promise.all(
        [mockInterview_A0, mockInterview_B1].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      assert(interview_A0 && interview_B1);

      const updatedInterview_A0 =
        await InterviewService.updateInterviewShareStatus({
          interviewId: interview_A0.id,
          userId: userId_A,
          shareStatus: InterviewShareStatus.SHARED_PUBLIC,
        });

      const updatedInterview_B1 =
        await InterviewService.updateInterviewShareStatus({
          interviewId: interview_B1.id,
          userId: userId_B,
          shareStatus: InterviewShareStatus.SHARED_ANONYMOUS,
        });

      assert(updatedInterview_A0 && updatedInterview_B1);
      expect(updatedInterview_A0.id).to.equal(interview_A0.id);
      expect(updatedInterview_A0.shareStatus).to.equal(
        InterviewShareStatus.SHARED_PUBLIC
      );
      expect(updatedInterview_B1.id).to.equal(interview_B1.id);
      expect(updatedInterview_B1.shareStatus).to.equal(
        InterviewShareStatus.SHARED_ANONYMOUS
      );
    });
  });

  describe('deleteInterviewById', () => {
    it('should throw error of the interview does not exists', async () => {
      await expect(
        InterviewService.deleteInterviewById({
          interviewId: getNewMongoId(),
          userId: user_A.id,
        })
      ).eventually.to.be.rejectedWith(
        ResourceNotFoundError,
        'Interview not found'
      );
    });

    it('should throw error of the interview does not belong to the authorized user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      await expect(
        InterviewService.deleteInterviewById({
          interviewId: interview_A0.id,
          userId: user_B.id,
        })
      ).eventually.to.be.rejectedWith(
        ResourceNotFoundError,
        'Interview not found'
      );
    });

    it('should throw error of the interview is already soft deleted', async () => {
      const interview_A1 =
        await InterviewRepository.createInterview(mockInterview_A1);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A1.id,
        userId: user_A.id,
      });

      await expect(
        InterviewService.deleteInterviewById({
          interviewId: interview_A1.id,
          userId: user_A.id,
        })
      ).eventually.to.be.rejectedWith(
        ResourceNotFoundError,
        'Interview not found'
      );
    });

    it('should soft delete the interview', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      const deletedInterview = await InterviewService.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
      });

      const foundInterview = await InterviewRepository.getInterviewById({
        interviewId: interview_A0.id,
        userId: user_A.id,
      });

      assert(deletedInterview);
      assert(!foundInterview);
      expect(deletedInterview.id).to.equal(interview_A0.id);
      assert(deletedInterview.deletedAt);
      const timeDiff = differenceInSeconds(
        new Date(),
        deletedInterview.deletedAt
      );
      expect(timeDiff).to.lessThan(3);
    });
  });
});
