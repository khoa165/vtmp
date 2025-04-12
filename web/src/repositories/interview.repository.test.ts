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
    status: InterviewStatus.PASSED,
  };

  const mockInterview_A1 = {
    applicationId: getNewMongoId(),
    userId: userId_A,
    type: [InterviewType.TECHNICAL],
    interviewOnDate: new Date('2025-06-07'),
    status: InterviewStatus.FAILED,
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
    it('shoud return null if interview cannot be found', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);
      await InterviewRepository.createInterview(mockInterview_B0);

      const interview = await InterviewRepository.getInterviewById({
        interviewId: interview_A0.id,
        userId: userId_B,
      });

      assert(!interview);
    });

    it('shoud return null if interview is already soft deleted', async () => {
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

    it('shoud return the interview for a valid interviewId', async () => {
      const interview_A0 =
        await InterviewRepository.createInterview(mockInterview_A0);

      const interview = await InterviewRepository.getInterviewById({
        interviewId: interview_A0.id,
        userId: userId_A,
      });

      assert(interview);
    });
  });

  describe('getInterviews', () => {
    it('should return an empty array if the userId has no interview', async () => {
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
      expect(interviews[0]?.id.toString()).to.equal(interview_A1.id.toString());
    });

    it('should return all interviews belong to the userId', async () => {
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

  describe('getInterviewsByApplicatonId', () => {
    it('should return empty array if application has no interview', async () => {
      await InterviewRepository.createInterview(mockInterview_A0);

      const interviews = await InterviewRepository.getInterviewsByApplicatonId({
        applicationId: getNewMongoId(),
        userId: userId_A,
      });

      assert(interviews);
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

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      expect(interviews[0]?.id.toString()).to.equal(interview_A2.id.toString());
    });

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

      const interviews = await InterviewRepository.getInterviewsByApplicatonId({
        applicationId: metaApplicationId,
        userId: userId_A,
        filters: { status: InterviewStatus.PENDING },
      });

      assert(interviews);
      expect(interviews).to.be.an('array').that.have.lengthOf(1);
      expect(interviews[0]?.id.toString()).to.equal(interview_A2.id.toString());
      expect(interviews[0]?.status).to.equal(InterviewStatus.PENDING);
    });
  });

  describe('updateInterviewById', () => {
    it('should return null if no interview for the interviewId is found', async () => {
      const nonExistentId = getNewMongoId();

      const updatedInterview = await InterviewRepository.updateInterviewById({
        interviewId: nonExistentId,
        userId: userId_A,
        updatedMetaData: { interviewOnDate: new Date('2025-08-10') },
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
        updatedMetaData: { interviewOnDate: new Date('2025-08-10') },
      });

      assert(!updatedInterview);
    });

    it('should return the interview with updated field', async () => {
      const interview =
        await InterviewRepository.createInterview(mockInterview_A1);

      const updatedInterview = await InterviewRepository.updateInterviewById({
        interviewId: interview.id,
        userId: userId_A,
        updatedMetaData: {
          interviewOnDate: new Date('2025-08-10'),
          type: [InterviewType.BEHAVIORIAL, InterviewType.HIRING_MANAGER],
          status: InterviewStatus.PENDING,
          note: 'This interview is updated.',
        },
      });

      assert(updatedInterview);
      expect(updatedInterview).to.containSubset({
        _id: toMongoId(interview.id),
        userId: toMongoId(userId_A),
        interviewOnDate: new Date('2025-08-10'),
        type: [InterviewType.BEHAVIORIAL, InterviewType.HIRING_MANAGER],
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

      const updatedInterviews =
        await InterviewRepository.updateInterviewsWithStatus({
          userId: userId_A,
          interviewIds: [interview_A1.id, interview_A2.id],
          updatedStatus: InterviewStatus.FAILED,
        });

      const updatedInterview_A2 = await InterviewRepository.getInterviewById({
        interviewId: interview_A2.id,
        userId: userId_A,
      });

      assert(updatedInterviews);
      expect(updatedInterviews).to.have.property('acknowledged', true);
      expect(updatedInterviews).to.have.property('modifiedCount', 1);
      expect(updatedInterviews).to.have.property('matchedCount', 1);
      expect(updatedInterview_A2?.status).to.equal(InterviewStatus.FAILED);
    });

    it('should only update status of valid interviews of authorized user', async () => {
      const interview_A1 =
        await InterviewRepository.createInterview(mockInterview_A1);
      const interview_A2 =
        await InterviewRepository.createInterview(mockInterview_A2);
      const interview_B0 =
        await InterviewRepository.createInterview(mockInterview_B0);

      const updatedInterviews =
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

      assert(updatedInterviews);
      expect(updatedInterviews).to.have.property('acknowledged', true);
      expect(updatedInterviews).to.have.property('modifiedCount', 2);
      expect(updatedInterviews).to.have.property('matchedCount', 2);
      expect(updatedInterview_A1?.status).to.equal(InterviewStatus.PASSED);
      expect(updatedInterview_A2?.status).to.equal(InterviewStatus.PASSED);
    });
  });

  describe('deleteInterviewById', () => {
    it('should return null if interview does not exist', async () => {
      const nonExistentId = getNewMongoId();

      const deletedInterview = await InterviewRepository.deleteInterviewById({
        interviewId: nonExistentId,
        userId: userId_A,
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
      expect(deletedInterview.id.toString()).to.equal(interview.id.toString());
      expect(foundInterview).to.be.equal(null);
    });
  });
});
