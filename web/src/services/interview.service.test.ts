import assert from 'assert';
import { expect } from 'chai';

import { InterviewRepository } from '@/repositories/interview.repository';
import { InterviewService } from '@/services/interview.service';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId, toMongoId } from '@/testutils/mongoID.testutil';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';
import { ResourceNotFoundError } from '@/utils/errors';
import { differenceInSeconds } from 'date-fns';

describe('InterviewService', () => {
  useMongoDB();

  const userId_A = getNewMongoId();
  const userId_B = getNewMongoId();

  const googleApplicationId = getNewMongoId();

  const mockInterview_A0 = {
    applicationId: googleApplicationId,
    userId: userId_A,
    type: [InterviewType.TECHNICAL_LC_CODING],
    status: InterviewStatus.PASSED,
    interviewOnDate: new Date('2025-06-07'),
    companyName: 'Meta',
    note: 'This is a note of an interview with google',
  };

  const mockInterview_A1 = {
    applicationId: getNewMongoId(),
    userId: userId_A,
    type: [InterviewType.DEBUGGING, InterviewType.CODE_REVIEW],
    status: InterviewStatus.UPCOMING,
    interviewOnDate: new Date('2025-07-07'),
    companyName: 'Google',
    note: 'This is a note of an interview',
  };

  const mockInterview_A2 = {
    applicationId: googleApplicationId,
    userId: userId_A,
    type: [InterviewType.HIRING_MANAGER],
    interviewOnDate: new Date('2025-08-01'),
    companyName: 'Meta',
    note: 'This is a note of another interview with google',
  };

  const mockInterview_B0 = {
    applicationId: getNewMongoId(),
    userId: userId_B,
    type: [InterviewType.CODE_REVIEW],
    status: InterviewStatus.PENDING,
    interviewOnDate: new Date('2025-08-08'),
    companyName: 'Netflix',
    note: 'This is a note of an interview',
  };

  const mockInterview_B1 = {
    applicationId: getNewMongoId(),
    userId: userId_B,
    type: [InterviewType.CODE_REVIEW],
    interviewOnDate: new Date('2025-06-07'),
    status: InterviewStatus.PENDING,
    companyName: 'Meta',
  };

  describe('createInterview', () => {
    it('should be able to create a new interview', async () => {
      const newInterview =
        await InterviewService.createInterview(mockInterview_A2);

      assert(newInterview);
      expect(newInterview).to.deep.include({
        ...mockInterview_A2,
        applicationId: toMongoId(mockInterview_A2.applicationId),
        userId: toMongoId(mockInterview_A2.userId),
        status: InterviewStatus.PENDING,
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
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      await InterviewRepository.createInterview(mockInterview_A1);
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
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      const interview_A1 =
        await InterviewRepository.createInterview(mockInterview_A1);
      await InterviewRepository.createInterview(mockInterview_B0);

      const interviews = await InterviewService.getInterviews({
        filters: { userId: userId_A },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(2);
      expect(interviews.map((interview) => interview.id)).to.have.members([
        interview_A0.id,
        interview_A1.id,
      ]);
    });

    it('should return empty array when filtering by an applicationId with no interviews', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);
      await InterviewRepository.createInterview(mockInterview_A1);

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
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      await InterviewRepository.createInterview(mockInterview_A2);
      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: userId_A,
      });

      const interviews = await InterviewService.getInterviews({
        filters: {
          userId: userId_A,
          applicationId: googleApplicationId,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0]).to.deep.include({
        ...mockInterview_A2,
        applicationId: toMongoId(mockInterview_A2.applicationId),
        userId: toMongoId(mockInterview_A2.userId),
      });
    });

    it('should return only the interviews belonging to the applicationId', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      const interview_A2 =
        await InterviewRepository.createInterview(mockInterview_A2);
      await InterviewRepository.createInterview(mockInterview_B0);

      const interviews = await InterviewService.getInterviews({
        filters: {
          userId: userId_A,
          applicationId: mockInterview_A0.applicationId,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(2);
      expect(interviews.map((interview) => interview.id)).to.have.members([
        interview_A0.id,
        interview_A2.id,
      ]);
    });

    it('should return only interviews with the given status when no applicationId is provided', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);
      await InterviewRepository.createInterview(mockInterview_A1);

      const interviews = await InterviewService.getInterviews({
        filters: {
          userId: userId_A,
          status: InterviewStatus.UPCOMING,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0]).to.deep.include({
        ...mockInterview_A1,
        applicationId: toMongoId(mockInterview_A1.applicationId),
        userId: toMongoId(mockInterview_A1.userId),
        status: InterviewStatus.UPCOMING,
      });
    });

    it('should return an empty array when filtering by a status that no interview has', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);
      await InterviewRepository.createInterview(mockInterview_A1);

      const interviews = await InterviewService.getInterviews({
        filters: {
          userId: userId_A,
          status: InterviewStatus.FAILED,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return an empty array when filtering by a companyName that no interview has', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);
      await InterviewRepository.createInterview(mockInterview_A2);

      const interviews = await InterviewRepository.getInterviews({
        filters: {
          companyName: 'Google',
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return interviews of all users belongs to the provided companyName', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      const interview_A2 =
        await InterviewRepository.createInterview(mockInterview_A2);
      const interview_B1 =
        await InterviewRepository.createInterview(mockInterview_B1);

      const interviews = await InterviewRepository.getInterviews({
        filters: {
          companyName: 'Meta',
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(3);
      expect(interviews.map((interview) => interview.id)).to.have.members([
        interview_A0.id,
        interview_A2.id,
        interview_B1.id,
      ]);
    });

    it('should not include soft-deleted interviews when filter by companyName', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      const interview_A2 =
        await InterviewRepository.createInterview(mockInterview_A2);
      const interview_B1 =
        await InterviewRepository.createInterview(mockInterview_B1);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: userId_A,
      });

      const interviews = await InterviewRepository.getInterviews({
        filters: {
          companyName: 'Meta',
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(2);
      expect(interviews.map((interview) => interview.id)).to.have.members([
        interview_A2.id,
        interview_B1.id,
      ]);
    });

    it('should return only the interviews belonging to the applicationId that have the provided status', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);
      await InterviewRepository.createInterview(mockInterview_A1);
      await InterviewRepository.createInterview(mockInterview_B0);

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
