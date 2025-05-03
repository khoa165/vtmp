import { IApplication } from '@/models/application.model';
import { InterviewModel } from '@/models/interview.model';
import { IUser } from '@/models/user.model';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';

export const loadInterviews = async (
  users: IUser[],
  applications: IApplication[]
) => {
  const seedInterviews = [
    {
      userId: users[0]?.id,
      applicationId: applications[0]?.id,
      type: [InterviewType.CODE_REVIEW],
      status: InterviewStatus.PENDING,
      interviewOnDate: new Date('2025-01-01'),
    },
    {
      userId: users[0]?.id,
      applicationId: applications[0]?.id,
      type: [InterviewType.CRITICAL_THINKING, InterviewType.PRACTICAL_CODING],
      status: InterviewStatus.PASSED,
      interviewOnDate: new Date('2025-01-02'),
    },
    {
      userId: users[0]?.id,
      applicationId: applications[1]?.id,
      type: [InterviewType.DEBUGGING],
      status: InterviewStatus.FAILED,
      interviewOnDate: new Date('2025-01-03'),
    },
    {
      userId: users[1]?.id,
      applicationId: applications[0]?.id,
      type: [InterviewType.SYSTEM_DESIGN],
      status: InterviewStatus.PENDING,
      interviewOnDate: new Date('2025-01-04'),
    },
  ];

  await InterviewModel.insertMany(seedInterviews);
  console.log('Successfully seeded interviews.');
};
