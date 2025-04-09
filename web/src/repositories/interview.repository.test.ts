import { expect } from 'chai';
import assert from 'assert';

import { InterviewRepository } from '@/repositories/interview.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { InterviewStatus, InterviewType } from '@/types/enums';

describe('Interview Repository', () => {
  useMongoDB();

  const userId_A = getNewMongoId();
  const userId_B = getNewMongoId();

  const mockInterview_A0 = {
    applicationId: getNewMongoId(),
    userId: userId_A,
    InterviewType: 'Hiring Manager',
  };

  const mockInterview_A1 = {
    applicationId: getNewMongoId(),
    userId: userId_A,
    InterviewType: 'TECHNICAL',
    interviewOnDate: new Date('2025-06-07'),
  };

  const mockInterview_B0 = {
    applicationId: getNewMongoId(),
    userId: userId_B,
    type: 'TECHNICAL',
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
    it('shoud return the interview with interviewId', async () => {
      // TODO
    });
  });
  describe('getInterviewsByApplicatonId', () => {
    it('should return only the interviews belong to the applicationId', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);
      await InterviewRepository.createInterview(mockInterview_A1);
      await InterviewRepository.createInterview(mockInterview_B0);
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
