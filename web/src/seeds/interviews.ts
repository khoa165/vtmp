import { IApplication } from '@/models/application.model';
import { IInterview, InterviewModel } from '@/models/interview.model';
import { IUser } from '@/models/user.model';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';
import { faker } from '@faker-js/faker';

export const loadInterviews = async (
  users: IUser[],
  applications: IApplication[]
) => {
  const MAX_DAYS_FROM_REF_DATE = 180;
  const weightedNumInterviews = [
    { weight: 99, value: 0 },
    { weight: 0.6, value: 1 },
    { weight: 0.2, value: 2 },
    { weight: 0.1, value: 3 },
    { weight: 0.09, value: 4 },
    { weight: 0.01, value: 5 },
  ];
  const allInterviews: Partial<IInterview>[] = [];

  const generateInterviewData = (
    user: IUser,
    application: IApplication
  ): Partial<IInterview> => {
    return {
      userId: user._id,
      applicationId: application._id,
      type: faker.helpers.arrayElements(
        Object.values(InterviewType),
        faker.number.int({ min: 1, max: 2 })
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
