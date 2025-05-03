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

  const randomInterviewsForUser0 = Array.from(
    { length: numInterviewsUser0 },
    () => {
      return {
        userId: users[0]?.id,
        applicationId: faker.helpers.arrayElement(applications)?.id,
        type: faker.helpers.arrayElements(
          Object.values(InterviewType),
          faker.number.int({ min: 1, max: 2 })
        ),
        status: faker.helpers.arrayElement(Object.values(InterviewStatus)),
        interviewOnDate: faker.date.future({ years: 1 }),
      };
    }
  );

  const randomInterviewsForUser1 = Array.from(
    { length: numInterviewsUser1 },
    () => {
      return {
        userId: users[1]?.id,
        applicationId: faker.helpers.arrayElement(applications)?.id,
        type: faker.helpers.arrayElements(
          Object.values(InterviewType),
          faker.number.int({ min: 1, max: 2 })
        ),
        status: faker.helpers.arrayElement(Object.values(InterviewStatus)),
        interviewOnDate: faker.date.future({ years: 1 }),
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
