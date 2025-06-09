import { faker } from '@faker-js/faker';

import { IApplication } from '@/models/application.model';
import { IInterview, InterviewModel } from '@/models/interview.model';
import { IUser } from '@/models/user.model';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';

export const loadInterviews = async (
  users: IUser[],
  applications: IApplication[]
) => {
  const MAX_DAYS_FROM_REF_DATE = 180;
  const weightedNumInterviews = [
    { weight: 96, value: 0 },
    { weight: 1.6, value: 1 },
    { weight: 1.2, value: 2 },
    { weight: 1.1, value: 3 },
    { weight: 0.09, value: 4 },
    { weight: 0.01, value: 5 },
  ];
  const weightedInterviewTypesCount = [
    { weight: 50, value: 1 },
    { weight: 40, value: 2 },
    { weight: 10, value: 3 },
  ];
  const allInterviews: Partial<IInterview>[] = [];

  const generateInterviewData = (
    user: IUser,
    application: IApplication
  ): Partial<IInterview> => {
    return {
      userId: user._id,
      applicationId: application._id,
      types: faker.helpers.arrayElements(
        Object.values(InterviewType),
        faker.helpers.weightedArrayElement(weightedInterviewTypesCount)
      ),
      status: faker.helpers.enumValue(InterviewStatus),
      interviewOnDate: faker.date.soon({
        days: MAX_DAYS_FROM_REF_DATE,
        refDate: application.appliedOnDate,
      }),
    };
  };

  for (const user of users) {
    const applicationsOfUser = applications.filter(
      (app) => app.userId === user._id
    );
    for (const application of applicationsOfUser) {
      const numInterviews = faker.helpers.weightedArrayElement(
        weightedNumInterviews
      );
      allInterviews.push(
        ...Array.from({ length: numInterviews }, () =>
          generateInterviewData(user, application)
        )
      );
    }
  }

  await InterviewModel.insertMany(allInterviews);
  console.log(`Successfully seeded ${allInterviews.length} interviews.`);
};
