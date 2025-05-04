import { IApplication } from '@/models/application.model';
import { InterviewModel } from '@/models/interview.model';
import { IUser } from '@/models/user.model';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';
import { faker } from '@faker-js/faker';

export const loadInterviews = async (
  users: IUser[],
  applications: IApplication[]
) => {
  const numInterviewsUser0 = 5;
  const numInterviewsUser1 = 5;
  const sixtyDaysBeforeNow = new Date();
  sixtyDaysBeforeNow.setDate(sixtyDaysBeforeNow.getDate() - 60);
  const sixtyDaysAfterNow = new Date();
  sixtyDaysAfterNow.setDate(sixtyDaysAfterNow.getDate() + 60);

  const generateInterviewData = () => {
    return {
      applicationId: faker.helpers.arrayElement(applications)?.id,
      type: faker.helpers.arrayElements(
        Object.values(InterviewType),
        faker.number.int({ min: 1, max: 2 })
      ),
      status: faker.helpers.arrayElement(Object.values(InterviewStatus)),
      interviewOnDate: faker.date.between({
        from: sixtyDaysBeforeNow.toISOString(),
        to: sixtyDaysAfterNow.toISOString(),
      }),
    };
  };

  const randomInterviewsForUser0 = Array.from(
    { length: numInterviewsUser0 },
    () => {
      return {
        userId: users[0]?.id,
        ...generateInterviewData(),
      };
    }
  );

  const randomInterviewsForUser1 = Array.from(
    { length: numInterviewsUser1 },
    () => {
      return {
        userId: users[1]?.id,
        ...generateInterviewData(),
      };
    }
  );

  const allInterviews = [
    ...randomInterviewsForUser0,
    ...randomInterviewsForUser1,
  ];

  await InterviewModel.insertMany(allInterviews);
  console.log(
    `Successfully seeded ${numInterviewsUser0 + numInterviewsUser1} interviews.`
  );
};
