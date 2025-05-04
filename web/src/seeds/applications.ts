import { ApplicationModel, IApplication } from '@/models/application.model';
import { IJobPosting } from '@/models/job-posting.model';
import { IUser } from '@/models/user.model';
import { ApplicationStatus, InterestLevel } from '@vtmp/common/constants';
import { faker } from '@faker-js/faker';

export const loadApplications = async (
  users: IUser[],
  jobPostings: IJobPosting[]
): Promise<IApplication[]> => {
  const numAppUser0 = 15;
  const numAppUser1 = 5;
  const sixtyDaysBeforeNow = new Date();
  sixtyDaysBeforeNow.setDate(sixtyDaysBeforeNow.getDate() - 60);
  const shuffledJobPostings = faker.helpers.shuffle(jobPostings);

  const formatPortalLink = (companyName: string): string => {
    const formattedName = companyName.toLowerCase().replace(/\s+/g, '');
    return `https://careers.${formattedName}.com`;
  };

  const randomApplicationsForUser0 = shuffledJobPostings
    .slice(0, numAppUser0)
    .map((jobPosting) => {
      return {
        userId: users[0]?.id,
        jobPostingId: jobPosting.id,
        status: faker.helpers.arrayElement(Object.values(ApplicationStatus)),
        referrer: faker.person.firstName(),
        portalLink: formatPortalLink(jobPosting.companyName),
        interest: faker.helpers.arrayElement(Object.values(InterestLevel)),
        appliedOnDate: faker.date.recent({
          days: 60,
          refDate: sixtyDaysBeforeNow.toISOString(),
        }),
      };
    });

  const randomApplicationsForUser1 = shuffledJobPostings
    .slice(0, numAppUser1)
    .map((jobPosting) => {
      return {
        userId: users[1]?.id,
        jobPostingId: jobPosting.id,
        status: faker.helpers.arrayElement(Object.values(ApplicationStatus)),
        referrer: faker.person.firstName(),
        portalLink: faker.internet.url(),
        interest: faker.helpers.arrayElement(Object.values(InterestLevel)),
        appliedOnDate: faker.date.recent({ days: 90 }),
      };
    });

  const allApplications = [
    ...randomApplicationsForUser0,
    ...randomApplicationsForUser1,
  ];

  const applications = await Promise.all(
    allApplications.map((app) => ApplicationModel.create(app))
  );
  console.log(`Successfully seeded ${numAppUser0 + numAppUser1} applications.`);
  return applications;
};
