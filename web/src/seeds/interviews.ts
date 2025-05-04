import { IApplication } from '@/models/application.model';
import { IInterview, InterviewModel } from '@/models/interview.model';
import { IUser } from '@/models/user.model';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';
import { faker } from '@faker-js/faker';
import { sub, add } from 'date-fns';

export const loadInterviews = async (
  users: IUser[],
  applications: IApplication[]
) => {
  const MIN_INTERVIEWS = 0;
  const MAX_INTERVIEWS = 3;
  const allInterviews: Partial<IInterview>[] = [];
  const twoMonthsAgo = sub(new Date(), { months: 2 });
  const twoMonthsLater = add(new Date(), { months: 2 });

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
      interviewOnDate: faker.date.between({
        from: twoMonthsAgo.toISOString(),
        to: twoMonthsLater.toISOString(),
      }),
    };
  };

  for (const user of users) {
    const applicationsOfUser = applications.filter(
      (app) => app.userId === user._id
    );
    for (const application of applicationsOfUser) {
      const randomNumInterviews = faker.helpers.rangeToNumber({
        min: MIN_INTERVIEWS,
        max: MAX_INTERVIEWS,
      });
      allInterviews.push(
        ...Array.from({ length: randomNumInterviews }, () =>
          generateInterviewData(user, application)
        )
      );
    }
  }

  await InterviewModel.insertMany(allInterviews);
  console.log(`Successfully seeded ${allInterviews.length} interviews.`);
};
