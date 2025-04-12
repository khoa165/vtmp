import { expect } from 'chai';
import assert from 'assert';

import { InterviewRepository } from '@/repositories/interview.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId, toMongoId } from '@/testutils/mongoID.testutil';
import { InterviewType, InterviewStatus } from '@/types/enums';

describe('Interview Repository', () => {
  useMongoDB();

  const userId_A = getNewMongoId();
  const metaApplicationId = getNewMongoId();
  const userId_B = getNewMongoId();

  const mockInterview_A0 = {
    applicationId: metaApplicationId,
    userId: userId_A,
    type: [InterviewType.TECHNICAL],
    interviewOnDate: new Date('2025-06-07'),
  };

  const mockInterview_A1 = {
    applicationId: getNewMongoId(),
    userId: userId_A,
    type: [InterviewType.TECHNICAL],
    interviewOnDate: new Date('2025-06-07'),
  };

  const mockInterview_A2 = {
    applicationId: metaApplicationId,
    userId: userId_A,
    type: [InterviewType.TECHNICAL],
    interviewOnDate: new Date('2025-06-07'),
  };

  const mockInterview_B0 = {
    applicationId: getNewMongoId(),
    userId: userId_B,
    type: [InterviewType.TECHNICAL],
    interviewOnDate: new Date('2025-06-07'),
  };

  describe('createInterview', () => {
    it('should create a new interview successfully', async () => {
      const newInterview =
        await InterviewRepository.createInterview(mockInterview_A0);

      assert(newInterview);
      expect(newInterview).to.containSubset({
        applicationId: toMongoId(mockInterview_A0.applicationId),
        userId: toMongoId(mockInterview_A0.userId),
        type: mockInterview_A0.type,
        interviewOnDate: mockInterview_A0.interviewOnDate,
        status: InterviewStatus.PENDING,
      });
    });
  });

  describe('getInterviewById', () => {
    it('shoud return the interview for a valid interviewId', async () => {
      const mockInterviewId_A0 = (
        await InterviewRepository.createInterview(mockInterview_A0)
      ).id;
      const interview = await InterviewRepository.getInterviewById({
        interviewId: mockInterviewId_A0,
        userId: userId_A,
      });

      assert(interview);
      expect(interview).to.containSubset({
        applicationId: toMongoId(mockInterview_A0.applicationId),
        userId: toMongoId(mockInterview_A0.userId),
        type: mockInterview_A0.type,
        interviewOnDate: mockInterview_A0.interviewOnDate,
      });
    });

    it('shoud return null if interview cannot be found', async () => {
      const mockInterviewId_A0 = (
        await InterviewRepository.createInterview(mockInterview_A0)
      ).id;
      await InterviewRepository.createInterview(mockInterview_B0);

      const interview = await InterviewRepository.getInterviewById({
        interviewId: mockInterviewId_A0,
        userId: userId_B,
      });

      assert(!interview);
    });

    it('shoud return null if interview is already soft deleted', async () => {
      const mockInterviewId_A0 = (
        await InterviewRepository.createInterview(mockInterview_A0)
      ).id;
      await InterviewRepository.deleteInterviewById({
        interviewId: mockInterviewId_A0,
        userId: userId_A,
      });
      const foundInterview = await InterviewRepository.getInterviewById({
        interviewId: mockInterviewId_A0,
        userId: userId_A,
      });

      assert(!foundInterview);
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

      await InterviewRepository.deleteInterviewById({
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

  describe('updateInterviewById', () => {
    it('should return the interview with updated field', async () => {
      const interview =
        await InterviewRepository.createInterview(mockInterview_A1);
      const newInterviewDate = new Date('2025-08-10');
      const newInterviewType = [InterviewType.BEHAVIORIAL];

      const updatedInterview = await InterviewRepository.updateInterviewById({
        interviewId: interview.id,
        userId: userId_A,
        updatedMetaData: {
          interviewOnDate: newInterviewDate,
          type: newInterviewType,
        },
      });

      assert(updatedInterview);
      expect(updatedInterview.type[0]).to.equal(InterviewType.BEHAVIORIAL);
      expect(updatedInterview.interviewOnDate.toISOString()).to.equal(
        newInterviewDate.toISOString()
      );
    });

    it('should return null if no interview for the interviewId is found', async () => {
      const nonExistentId = getNewMongoId();

      const updatedInterview = await InterviewRepository.updateInterviewById({
        interviewId: nonExistentId,
        userId: userId_A,
        updatedMetaData: { interviewOnDate: new Date('2025-08-10') },
      });

      expect(updatedInterview).to.equal(null);
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
        updatedMetaData: { interviewOnDate: new Date('2025-08-10') },
      });

      expect(updatedInterview).to.be.equal(null);
    });
  });

  describe('deleteInterviewById', () => {
    it('should return and delete the interview with the interviewId', async () => {
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
      expect(deletedInterview.id).to.equal(interview.id);
      expect(foundInterview).to.be.equal(null);
    });

    it('should return null if interview does not exist', async () => {
      const nonExistentId = getNewMongoId();

      const deletedInterview = await InterviewRepository.deleteInterviewById({
        interviewId: nonExistentId,
        userId: userId_A,
      });

      expect(deletedInterview).to.be.equal(null);
    });
  });
});
