import { expect } from 'chai';
import assert from 'assert';

import { InterviewRepository } from '@/repositories/interview.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { InterviewStatus, InterviewType } from '@/types/enums';

describe('Interview Repository', () => {
  useMongoDB();

  const userId_A = getNewMongoId();
  const metaApplicationId = getNewMongoId();
  const userId_B = getNewMongoId();

  const mockInterview_A0 = {
    applicationId: metaApplicationId,
    userId: userId_A,
    type: InterviewType.BEHAVIORIAL,
  };

  const mockInterview_A1 = {
    applicationId: getNewMongoId(),
    userId: userId_A,
    type: InterviewType.TECHNICAL,
    interviewOnDate: new Date('2025-06-07'),
  };

  const mockInterview_A2 = {
    applicationId: metaApplicationId,
    userId: userId_A,
    type: InterviewType.TECHNICAL,
    interviewOnDate: new Date('2025-06-07'),
  };

  const mockInterview_B0 = {
    applicationId: getNewMongoId(),
    userId: userId_B,
    type: InterviewType.TECHNICAL,
    interviewOnDate: new Date('2025-07-06'),
  };

  describe('createInterview', () => {
    it('should create a new interview successfully', async () => {
      const newInterview =
        await InterviewRepository.createInterview(mockInterview_A0);

      assert(newInterview);
      expect(newInterview.applicationId.toString()).to.equal(
        mockInterview_A0.applicationId
      );
      expect(newInterview.userId.toString()).to.equal(mockInterview_A0.userId);
      expect(newInterview.type).to.equal(InterviewType.TECHNICAL);
      expect(newInterview.status).to.equal(InterviewStatus.PENDING);
    });
  });

  describe('getInterview', () => {
    it('shoud return the interview for a valid interviewId', async () => {
      const interview_B0 =
        await InterviewRepository.createInterview(mockInterview_B0);

      const interview = await InterviewRepository.getInterview({
        interviewId: interview_B0.id,
        userId: userId_B,
      });

      assert(interview);
      expect(interview.id).to.equal(interview_B0);
      expect(interview.userId).to.equal(userId_B);
    });

    it('shoud return null if interview cannot be found', async () => {
      const mockInterviewId_A0 = (
        await InterviewRepository.createInterview(mockInterview_A0)
      ).id;
      await InterviewRepository.createInterview(mockInterview_A1);
      await InterviewRepository.createInterview(mockInterview_B0);

      const interview = await InterviewRepository.getInterview({
        interviewId: mockInterviewId_A0,
        userId: userId_B,
      });

      assert(!interview);
    });

    it('shoud return null if interview is already soft deleted', async () => {
      const mockInterviewId_A0 = (
        await InterviewRepository.createInterview(mockInterview_A0)
      ).id;
      await InterviewRepository.deleteInterview({
        interviewId: mockInterviewId_A0,
        userId: userId_A,
      });

      const interview = await InterviewRepository.getInterview({
        interviewId: mockInterviewId_A0,
        userId: userId_A,
      });

      assert(!interview);
    });
  });

  describe('getInterviewsByApplicatonId', () => {
    it('should return only the interviews belong to the applicationId', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      const interview_A2 =
        await InterviewRepository.createInterview(mockInterview_A2);
      await InterviewRepository.createInterview(mockInterview_A1);

      const interviews = await InterviewRepository.getInterviewsByApplicatonId({
        applicationId: metaApplicationId,
        userId: userId_A,
      });

      expect(interviews).to.be.an('array').that.have.lengthOf(2);
      expect(interviews.map((interview) => interview.id)).to.have.members([
        interview_A0.id,
        interview_A2.id,
      ]);
    });

    it('should return empty array if application has no interview', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);
      await InterviewRepository.createInterview(mockInterview_A1);
      await InterviewRepository.createInterview(mockInterview_A2);

      const interviews = await InterviewRepository.getInterviewsByApplicatonId({
        applicationId: getNewMongoId(),
        userId: userId_A,
      });

      expect(interviews).to.be.an('array').that.have.lengthOf(0);
    });

    it('should not include soft-deleted interview', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      const interview_A2 =
        await InterviewRepository.createInterview(mockInterview_A2);

      await InterviewRepository.deleteInterview({
        interviewId: interview_A0.id,
        userId: userId_A,
      });

      const interviews = await InterviewRepository.getInterviewsByApplicatonId({
        applicationId: metaApplicationId,
        userId: userId_A,
      });

      expect(interviews[0]?.id).to.equal(interview_A2.id);
    });
  });
  describe('updateInterview', () => {
    it('should return the interview with updated field', async () => {
      // TODO
    });
    it('should return null if no interview for the interviewId is found', async () => {
      // TODO
    });
    it('should not update fields that are not allowed', async () => {
      // TODO
    });
  });
  describe('deleteInterview', () => {
    it('should return and delete the interview with the interviewId', async () => {
      // TODO
    });
    it('should return null if interview does not exist', async () => {
      // TODO
    });
  });
});
