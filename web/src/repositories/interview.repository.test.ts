import { expect } from 'chai';
import assert from 'assert';
import { differenceInSeconds } from 'date-fns';

import { InterviewRepository } from '@/repositories/interview.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId, toMongoId } from '@/testutils/mongoID.testutil';
import { InterviewType, InterviewStatus } from '@common/enums';

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
      expect(newInterview).to.containSubset({
        applicationId: toMongoId(mockInterview_A2.applicationId),
        userId: toMongoId(mockInterview_A2.userId),
        type: mockInterview_A2.type,
        interviewOnDate: mockInterview_A2.interviewOnDate,
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

    it('should return the valid interview for authroized user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      const interview = await InterviewRepository.getInterviewById({
        interviewId: interview_A0.id,
        userId: userId_A,
      });

      assert(interview);
      expect(interview.id).to.equal(interview_A0.id);
      expect(interview).to.containSubset({
        userId: toMongoId(mockInterview_A0.userId),
        applicationId: toMongoId(mockInterview_A0.applicationId),
        interviewOnDate: mockInterview_A0.interviewOnDate,
        type: mockInterview_A0.type,
        status: mockInterview_A0.status,
      });
    });
  });

  describe('getInterviews', () => {
    it('should return an empty array if the authorized user has no interview', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);

      const interviews = await InterviewRepository.getInterviews(userId_B);

      assert(interviews);
      expect(interviews).to.be.an('array').that.has.lengthOf(0);
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

      const interviews = await InterviewRepository.getInterviews(userId_A);

      assert(interviews);
      expect(interviews).to.be.an('array').that.has.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0].id).to.equal(interview_A1.id);
    });

    it('should return only interviews belong to the authorized user', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      const interview_A1 =
        await InterviewRepository.createInterview(mockInterview_A1);
      await InterviewRepository.createInterview(mockInterview_B0);

      const interviews = await InterviewRepository.getInterviews(userId_A);

      assert(interviews);
      expect(interviews).to.be.an('array').that.has.lengthOf(2);
      expect(interviews[0]).to.containSubset({
        userId: toMongoId(mockInterview_A0.userId),
        _id: toMongoId(interview_A0.id),
      });
      expect(interviews[1]).to.containSubset({
        userId: toMongoId(mockInterview_A1.userId),
        _id: toMongoId(interview_A1.id),
      });
    });
  });

  describe('getInterviewsByApplicationId', () => {
    it('should return empty array if application has no interview', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);

      const interviews = await InterviewRepository.getInterviewsByApplicationId(
        {
          applicationId: getNewMongoId(),
          userId: userId_A,
        }
      );

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return empty array if application does not belong to the authorized user', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);
      await InterviewRepository.createInterview(mockInterview_A1);

      const interviews = await InterviewRepository.getInterviewsByApplicationId(
        {
          applicationId: metaApplicationId,
          userId: userId_B,
        }
      );

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should not include soft-deleted interviews', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      const interview_A2 =
        await InterviewRepository.createInterview(mockInterview_A2);
      await InterviewRepository.deleteInterviewById({
        interviewId: interview_A0.id,
        userId: userId_A,
      });

      const interviews = await InterviewRepository.getInterviewsByApplicationId(
        {
          applicationId: metaApplicationId,
          userId: userId_A,
        }
      );

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0].id).to.equal(interview_A2.id);
    });

    it('should return only the interviews belong to the applicationId', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      const interview_A2 =
        await InterviewRepository.createInterview(mockInterview_A2);
      await InterviewRepository.createInterview(mockInterview_A1);

      const interviews = await InterviewRepository.getInterviewsByApplicationId(
        {
          applicationId: metaApplicationId,
          userId: userId_A,
        }
      );

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(2);
      expect(interviews.map((interview) => interview.id)).to.have.members([
        interview_A0.id,
        interview_A2.id,
      ]);
    });

    it('should return only the interviews that belong to the applicationId that have the provided status', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);
      const interview_A2 =
        await InterviewRepository.createInterview(mockInterview_A2);

      const interviews = await InterviewRepository.getInterviewsByApplicationId(
        {
          applicationId: metaApplicationId,
          userId: userId_A,
          filters: { status: InterviewStatus.PENDING },
        }
      );

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      assert(interviews[0]);
      expect(interviews[0].id).to.equal(interview_A2.id);
      expect(interviews[0].status).to.equal(InterviewStatus.PENDING);
    });
  });

  describe('updateInterviewById', () => {
    it('should return null if no interview for the interviewId is found', async () => {
      const nonExistentId = getNewMongoId();

      const updatedInterview = await InterviewRepository.updateInterviewById({
        interviewId: nonExistentId,
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

    it('should return the interview with updated field', async () => {
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
      expect(updatedInterview).to.containSubset({
        _id: toMongoId(interview.id),
        userId: toMongoId(userId_A),
        interviewOnDate: new Date('2025-08-10'),
        type: [InterviewType.PROJECT_WALKTHROUGH, InterviewType.HIRING_MANAGER],
        status: InterviewStatus.PENDING,
        note: 'This interview is updated.',
      });
    });
  });

  describe('updateInterviewsWithStatus', () => {
    it('should not update status of interviews belongs to other users', async () => {
      const interview_A2 =
        await InterviewRepository.createInterview(mockInterview_A2);
      const interview_B0 =
        await InterviewRepository.createInterview(mockInterview_B0);

      const updateInterviewResult =
        await InterviewRepository.updateInterviewsWithStatus({
          userId: userId_A,
          interviewIds: [interview_A2.id, interview_B0.id],
          updatedStatus: InterviewStatus.FAILED,
        });

      const updatedInterview_A2 = await InterviewRepository.getInterviewById({
        interviewId: interview_A2.id,
        userId: userId_A,
      });

      const notUpdatedInterview_B0 = await InterviewRepository.getInterviewById(
        {
          interviewId: interview_B0.id,
          userId: userId_B,
        }
      );

      assert(updateInterviewResult);
      assert(updatedInterview_A2);
      assert(notUpdatedInterview_B0);
      expect(updateInterviewResult).to.have.property('acknowledged', true);
      expect(updateInterviewResult).to.have.property('modifiedCount', 1);
      expect(updateInterviewResult).to.have.property('matchedCount', 1);
      expect(updatedInterview_A2.status).to.equal(InterviewStatus.FAILED);
      expect(notUpdatedInterview_B0.status).to.equal(InterviewStatus.PENDING);
    });

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

    it('should return and delete the valid interview belong to the authorized user', async () => {
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
