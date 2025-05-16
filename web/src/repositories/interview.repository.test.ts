import { expect } from 'chai';
import assert from 'assert';
import { differenceInSeconds } from 'date-fns';

import { InterviewRepository } from '@/repositories/interview.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId, toMongoId } from '@/testutils/mongoID.testutil';
import { InterviewType, InterviewStatus } from '@vtmp/common/constants';

describe('Interview Repository', () => {
  useMongoDB();

  const userId_A = getNewMongoId();
  const metaApplicationId = getNewMongoId();
  const userId_B = getNewMongoId();

  const mockInterview_A0 = {
    applicationId: metaApplicationId,
    userId: userId_A,
    type: [InterviewType.CODE_REVIEW],
    interviewOnDate: new Date('2025-06-07'),
    status: InterviewStatus.PASSED,
  };

  const mockInterview_A1 = {
    applicationId: getNewMongoId(),
    userId: userId_A,
    type: [InterviewType.CODE_REVIEW],
    interviewOnDate: new Date('2025-06-07'),
    status: InterviewStatus.FAILED,
  };

  const mockInterview_A2 = {
    applicationId: metaApplicationId,
    userId: userId_A,
    type: [InterviewType.CODE_REVIEW],
    interviewOnDate: new Date('2025-06-07'),
  };

  const mockInterview_B0 = {
    applicationId: getNewMongoId(),
    userId: userId_B,
    type: [InterviewType.CODE_REVIEW],
    interviewOnDate: new Date('2025-06-07'),
    status: InterviewStatus.PENDING,
  };

  describe('createInterview', () => {
    it('should create a new interview successfully', async () => {
      const newInterview =
        await InterviewRepository.createInterview(mockInterview_A2);

      assert(newInterview);
      expect(newInterview).to.deep.include({
        ...mockInterview_A2,
        applicationId: toMongoId(mockInterview_A2.applicationId),
        userId: toMongoId(mockInterview_A2.userId),
        status: InterviewStatus.PENDING,
      });
    });
  });

  describe('getInterviewById', () => {
    it('should return null if the interview does not exist', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);
      await InterviewRepository.createInterview(mockInterview_A1);

      const interview = await InterviewRepository.getInterviewById({
        interviewId: getNewMongoId(),
        userId: userId_A,
      });

      assert(!interview);
    });

    it('should return null if the interview does not belong to the user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      await InterviewRepository.createInterview(mockInterview_B0);

      const interview = await InterviewRepository.getInterviewById({
        interviewId: interview_A0.id,
        userId: userId_B,
      });

      assert(!interview);
    });

    it('should return null if the interview is already soft deleted', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: userId_A,
      });

      const interview = await InterviewRepository.getInterviewById({
        interviewId: interview_A0.id,
        userId: userId_A,
      });

      assert(!interview);
    });

    it('should return the valid interview for authorized user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      const interview = await InterviewRepository.getInterviewById({
        interviewId: interview_A0.id,
        userId: userId_A,
      });

      assert(interview);
      expect(interview.id).to.equal(interview_A0.id);
      expect(interview).to.deep.include({
        ...mockInterview_A0,
        applicationId: toMongoId(mockInterview_A0.applicationId),
        userId: toMongoId(mockInterview_A0.userId),
      });
    });
  });

  describe('getInterviews', () => {
    it('should return an empty array if the authorized user has no interviews', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);

      const interviews = await InterviewRepository.getInterviews({
        userId: userId_B,
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should not include soft-deleted interviews', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      const interview_A1 =
        await InterviewRepository.createInterview(mockInterview_A1);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: userId_A,
      });

      const interviews = await InterviewRepository.getInterviews({
        userId: userId_A,
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0].id).to.equal(interview_A1.id);
    });

    it('should return only interviews belonging to the authorized user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      const interview_A1 =
        await InterviewRepository.createInterview(mockInterview_A1);
      await InterviewRepository.createInterview(mockInterview_B0);

      const interviews = await InterviewRepository.getInterviews({
        userId: userId_A,
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

      const interviews = await InterviewRepository.getInterviews({
        userId: userId_A,
        filters: {
          applicationId: getNewMongoId(),
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should not include soft-deleted interviews when filtering by applicationId', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      const interview_A2 =
        await InterviewRepository.createInterview(mockInterview_A2);
      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: userId_A,
      });

      const interviews = await InterviewRepository.getInterviews({
        userId: userId_A,
        filters: {
          applicationId: metaApplicationId,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0].id).to.equal(interview_A2.id);
    });

    it('should return only the interviews belonging to the applicationId', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      const interview_A2 =
        await InterviewRepository.createInterview(mockInterview_A2);
      await InterviewRepository.createInterview(mockInterview_A1);

      const interviews = await InterviewRepository.getInterviews({
        userId: userId_A,
        filters: {
          applicationId: metaApplicationId,
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
      const interview_A2 =
        await InterviewRepository.createInterview(mockInterview_A2);

      const interviews = await InterviewRepository.getInterviews({
        userId: userId_A,
        filters: { status: InterviewStatus.PENDING },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0].id).to.equal(interview_A2.id);
      expect(interviews[0].status).to.equal(InterviewStatus.PENDING);
    });

    it('should return an empty array when filtering by a status that no interview has', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);

      const interviews = await InterviewRepository.getInterviews({
        userId: userId_A,
        filters: { status: InterviewStatus.PENDING },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return only the interviews belonging to the applicationId that have the provided status', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);
      const interview_A2 =
        await InterviewRepository.createInterview(mockInterview_A2);

      const interviews = await InterviewRepository.getInterviews({
        userId: userId_A,
        filters: {
          applicationId: metaApplicationId,
          status: InterviewStatus.PENDING,
        },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0].id).to.equal(interview_A2.id);
      expect(interviews[0].status).to.equal(InterviewStatus.PENDING);
    });
  });

  describe('updateInterviewById', () => {
    it('should return null if no interview with that interviewId exists', async () => {
      const updatedInterview = await InterviewRepository.updateInterviewById({
        interviewId: getNewMongoId(),
        userId: userId_A,
        updatedMetadata: { interviewOnDate: new Date('2025-08-10') },
      });

      assert(!updatedInterview);
    });

    it('should return null if the interview does not belong to the authorized user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      const updatedInterview = await InterviewRepository.updateInterviewById({
        interviewId: interview_A0.id,
        userId: userId_B,
        updatedMetadata: { interviewOnDate: new Date('2025-08-10') },
      });

      assert(!updatedInterview);
    });

    it('should return null if the interview is soft-deleted', async () => {
      const interview =
        await InterviewRepository.createInterview(mockInterview_B0);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview.id,
        userId: userId_B,
      });

      const updatedInterview = await InterviewRepository.updateInterviewById({
        interviewId: interview.id,
        userId: userId_B,
        updatedMetadata: { interviewOnDate: new Date('2025-08-10') },
      });

      assert(!updatedInterview);
    });

    it('should return the interview with updated fields', async () => {
      const interview =
        await InterviewRepository.createInterview(mockInterview_A1);

      const updatedInterview = await InterviewRepository.updateInterviewById({
        interviewId: interview.id,
        userId: userId_A,
        updatedMetadata: {
          interviewOnDate: new Date('2025-08-10'),
          type: [
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
        userId: toMongoId(userId_A),
        interviewOnDate: new Date('2025-08-10'),
        type: [InterviewType.PROJECT_WALKTHROUGH, InterviewType.HIRING_MANAGER],
        status: InterviewStatus.PENDING,
        note: 'This interview is updated.',
      });
    });
  });

  describe('updateInterviewsWithStatus', () => {
    it('should not update status of soft-deleted interviews', async () => {
      const interview_A1 =
        await InterviewRepository.createInterview(mockInterview_A1);
      const interview_A2 =
        await InterviewRepository.createInterview(mockInterview_A2);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A1.id,
        userId: userId_A,
      });

      const interviewUpdateResult =
        await InterviewRepository.updateInterviewsWithStatus({
          userId: userId_A,
          interviewIds: [interview_A1.id, interview_A2.id],
          updatedStatus: InterviewStatus.FAILED,
        });

      const updatedInterview_A2 = await InterviewRepository.getInterviewById({
        interviewId: interview_A2.id,
        userId: userId_A,
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
          userId: userId_A,
          interviewIds: [interview_B0.id],
          updatedStatus: InterviewStatus.PASSED,
        });

      const unchangedInterview = await InterviewRepository.getInterviewById({
        interviewId: interview_B0.id,
        userId: userId_B,
      });

      assert(interviewUpdateResult);
      assert(unchangedInterview);
      expect(interviewUpdateResult).to.have.property('acknowledged', true);
      expect(interviewUpdateResult).to.have.property('modifiedCount', 0);
      expect(interviewUpdateResult).to.have.property('matchedCount', 0);
      expect(unchangedInterview.status).to.not.equal(InterviewStatus.PASSED);
    });

    it('should only update status of valid interviews of authorized user', async () => {
      const interview_A1 =
        await InterviewRepository.createInterview(mockInterview_A1);
      const interview_A2 =
        await InterviewRepository.createInterview(mockInterview_A2);
      const interview_B0 =
        await InterviewRepository.createInterview(mockInterview_B0);

      const interviewUpdateResult =
        await InterviewRepository.updateInterviewsWithStatus({
          userId: userId_A,
          interviewIds: [interview_A1.id, interview_A2.id, interview_B0.id],
          updatedStatus: InterviewStatus.PASSED,
        });

      const updatedInterview_A1 = await InterviewRepository.getInterviewById({
        interviewId: interview_A1.id,
        userId: userId_A,
      });
      const updatedInterview_A2 = await InterviewRepository.getInterviewById({
        interviewId: interview_A2.id,
        userId: userId_A,
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
        userId: userId_A,
      });

      assert(!deletedInterview);
    });

    it('should return null if the interview does not belong to authorized user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      const deletedInterview = await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: userId_B,
      });

      assert(!deletedInterview);
    });

    it('should return null if trying to delete an already soft-deleted interview', async () => {
      const interview =
        await InterviewRepository.createInterview(mockInterview_A0);

      await InterviewRepository.deleteInterviewById({
        interviewId: interview.id,
        userId: userId_A,
      });

      const deletedInterview = await InterviewRepository.deleteInterviewById({
        interviewId: interview.id,
        userId: userId_A,
      });

      assert(!deletedInterview);
    });

    it('should return and delete the valid interview belonging to the authorized user', async () => {
      const interview =
        await InterviewRepository.createInterview(mockInterview_A1);

      const deletedInterview = await InterviewRepository.deleteInterviewById({
        interviewId: interview.id,
        userId: userId_A,
      });

      const foundInterview = await InterviewRepository.getInterviewById({
        interviewId: interview.id,
        userId: userId_A,
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
