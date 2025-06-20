import assert from 'assert';
import { expect } from 'chai';

import { InterviewRepository } from '@/repositories/interview.repository';
import { InterviewService } from '@/services/interview.service';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId, toMongoId } from '@/testutils/mongoID.testutil';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';
import { ResourceNotFoundError } from '@/utils/errors';
import { differenceInSeconds } from 'date-fns';
import { ApplicationRepository } from '@/repositories/application.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { IApplication } from '@/models/application.model';

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

  let userId_A: string;
  let userId_B: string;

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
    userId_A = getNewMongoId();
    userId_B = getNewMongoId();

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
      [userId_A, userId_B].map((userId) =>
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
      userId: userId_A,
      types: [InterviewType.CODE_REVIEW],
      interviewOnDate: new Date('2025-06-07'),
      status: InterviewStatus.PASSED,
    };

    mockInterview_A1 = {
      applicationId: googleApplication_A.id,
      userId: userId_A,
      types: [InterviewType.CODE_REVIEW],
      interviewOnDate: new Date('2025-06-07'),
      status: InterviewStatus.FAILED,
    };

    mockInterview_A2 = {
      applicationId: metaApplication_A.id,
      userId: userId_A,
      types: [InterviewType.CODE_REVIEW],
      interviewOnDate: new Date('2025-06-07'),
    };

    mockInterview_B0 = {
      applicationId: googleApplication_B.id,
      userId: userId_B,
      types: [InterviewType.CODE_REVIEW],
      interviewOnDate: new Date('2025-06-07'),
      status: InterviewStatus.PENDING,
    };

    mockInterview_B1 = {
      applicationId: metaApplication_B.id,
      userId: userId_B,
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
        userId: toMongoId(userId_A),
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
          userId: userId_A,
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
          userId: userId_B,
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
        userId: userId_A,
      });

      expect(
        InterviewService.getInterviewById({
          interviewId: interview_A1.id,
          userId: userId_A,
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
          userId: userId_A,
        })
      ).eventually.to.be.fulfilled;
    });

    it('should only return the valid interview that belongs to the authorized user', async () => {
      const interview_B0 =
        await InterviewRepository.createInterview(mockInterview_B0);

      const interview = await InterviewService.getInterviewById({
        interviewId: interview_B0.id,
        userId: userId_B,
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
          userId: userId_B,
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
        userId: userId_A,
      });

      const interviews = await InterviewService.getInterviews({
        filters: { userId: userId_A },
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
        filters: { userId: userId_A },
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
          userId: userId_A,
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
        userId: userId_A,
      });

      const interviews = await InterviewService.getInterviews({
        filters: {
          userId: userId_A,
          applicationId: metaApplication_A.id,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0]).to.deep.include({
        ...mockInterview_A2,
        applicationId: toMongoId(metaApplication_A.id),
        userId: toMongoId(userId_A),
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
          userId: userId_A,
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

    it('should return only interviews with the given status when no applicationId is provided', async () => {
      await Promise.all(
        [mockInterview_A0, mockInterview_A1].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      const interviews = await InterviewService.getInterviews({
        filters: {
          userId: userId_A,
          status: InterviewStatus.FAILED,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0]).to.deep.include({
        ...mockInterview_A1,
        applicationId: toMongoId(mockInterview_A1.applicationId),
        userId: toMongoId(userId_A),
        status: InterviewStatus.FAILED,
      });
    });

    it('should return an empty array when filtering by a status that no interview has', async () => {
      await Promise.all(
        [mockInterview_A0, mockInterview_A1].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      const interviews = await InterviewService.getInterviews({
        filters: {
          userId: userId_A,
          status: InterviewStatus.UPCOMING,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return an empty array when filtering by a companyName that no interview has', async () => {
      await Promise.all(
        [mockInterview_A0, mockInterview_A2].map((mockInterview) =>
          InterviewRepository.createInterview(mockInterview)
        )
      );

      const interviews = await InterviewService.getInterviews({
        filters: {
          companyName: 'Google',
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return interviews of all users belongs to the provided companyName', async () => {
      const [interview_A0, interview_A2, interview_B1] = await Promise.all(
        [mockInterview_A0, mockInterview_A2, mockInterview_B1].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      const interviews = await InterviewService.getInterviews({
        filters: {
          companyName: 'Meta',
        },
      });

      assert(interviews);
      assert(interview_A0);
      assert(interview_A2);
      assert(interview_B1);
      expect(interviews).to.be.an('array').that.have.lengthOf(3);
      expect(interviews.map((interview) => interview.id)).to.have.members([
        interview_A0.id,
        interview_A2.id,
        interview_B1.id,
      ]);
    });

    it('should not include soft-deleted interviews when filter by companyName', async () => {
      const [interview_A0, interview_A2, interview_B1] = await Promise.all(
        [mockInterview_A0, mockInterview_A2, mockInterview_B1].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      assert(interview_A0);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: userId_A,
      });

      const interviews = await InterviewService.getInterviews({
        filters: {
          companyName: 'Meta',
        },
      });

      assert(interview_A2);
      assert(interview_B1);
      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(2);
      expect(interviews.map((interview) => interview.id)).to.have.members([
        interview_A2.id,
        interview_B1.id,
      ]);
    });

    it('should return only the interviews belonging to the applicationId that have the provided status', async () => {
      await Promise.all(
        [mockInterview_A0, mockInterview_A1, mockInterview_B0].map(
          (mockInterview) => InterviewRepository.createInterview(mockInterview)
        )
      );

      const interviews = await InterviewService.getInterviews({
        filters: {
          userId: userId_A,
          applicationId: mockInterview_A0.applicationId,
          status: InterviewStatus.PASSED,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0]).to.deep.include({
        ...mockInterview_A0,
        applicationId: toMongoId(mockInterview_A0.applicationId),
        userId: toMongoId(mockInterview_A0.userId),
        status: InterviewStatus.PASSED,
      });
    });
  });

  describe('updateInterviewSharingStatus', () => {
    it('should throw error if the interview does not exist', async () => {
      await expect(
        InterviewService.updateInterviewSharingStatus({
          interviewId: getNewMongoId(),
          userId: userId_A,
          isDisclosed: true,
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
        InterviewService.updateInterviewSharingStatus({
          interviewId: interview_A0.id,
          userId: userId_B,
          isDisclosed: true,
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
        userId: userId_A,
      });

      await expect(
        InterviewService.updateInterviewSharingStatus({
          interviewId: interview_A1.id,
          userId: userId_A,
          isDisclosed: true,
        })
      ).eventually.to.be.rejectedWith(
        ResourceNotFoundError,
        'Interview not found'
      );
    });

    it('should not update the shareAt date if the interview has been shared before', async () => {
      const sharedDate = new Date('2025-06-07');

      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      await InterviewRepository.updateInterviewById({
        interviewId: interview_A0.id,
        userId: userId_A,
        newUpdate: {
          isDisclosed: true,
          sharedAt: sharedDate,
        },
      });

      const updatedInterview =
        await InterviewService.updateInterviewSharingStatus({
          interviewId: interview_A0.id,
          userId: userId_A,
          isDisclosed: false,
        });

      assert(updatedInterview);
      expect(updatedInterview.isDisclosed).to.equal(false);
      assert(updatedInterview.sharedAt);
      expect(updatedInterview.id).to.equal(interview_A0.id);
      expect(updatedInterview.sharedAt).to.deep.equal(sharedDate);
    });

    it('should update the interview disClose to true when unsharing an interview', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      const updatedInterview =
        await InterviewService.updateInterviewSharingStatus({
          interviewId: interview_A0.id,
          userId: userId_A,
          isShare: true,
        });

      assert(updatedInterview);
      expect(updatedInterview.isDisclosed).to.equal(true);
      assert(updatedInterview.sharedAt);
      expect(updatedInterview.id).to.equal(interview_A0.id);
    });

    it('should update the interview sharing status successfully', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      const updatedInterview =
        await InterviewService.updateInterviewSharingStatus({
          interviewId: interview_A0.id,
          userId: userId_A,
          isDisclosed: false,
        });

      assert(updatedInterview);
      expect(updatedInterview.isDisclosed).to.equal(false);
      assert(updatedInterview.sharedAt);
      expect(updatedInterview.id).to.equal(interview_A0.id);
    });
  });

  describe('deleteInterviewById', () => {
    it('should throw error of the interview does not exists', async () => {
      await expect(
        InterviewService.deleteInterviewById({
          interviewId: getNewMongoId(),
          userId: userId_A,
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
          userId: userId_B,
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
        userId: userId_A,
      });

      await expect(
        InterviewService.deleteInterviewById({
          interviewId: interview_A1.id,
          userId: userId_A,
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
        userId: userId_A,
      });

      const foundInterview = await InterviewRepository.getInterviewById({
        interviewId: interview_A0.id,
        userId: userId_A,
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
