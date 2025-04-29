import { InterviewService } from '@/services/interview.service';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';
import { assert } from 'console';

describe('InterviewService', () => {
  useMongoDB();

  const userId_A = getNewMongoId();

  const googleApplicationId = getNewMongoId();

  const mockInterview_A0 = {
    applicationId: googleApplicationId,
    userId: userId_A,
    type: [InterviewType.CODE_REVIEW],
    status: InterviewStatus.PENDING,
    interviewOnDate: new Date(),
    note: 'This is a note',
  };

  describe('createInterview', () => {
    it('should be able to create a new interview', async () => {
      const newInterview =
        await InterviewService.createInterview(mockInterview_A0);

      assert(newInterview);
    });
  });
});
