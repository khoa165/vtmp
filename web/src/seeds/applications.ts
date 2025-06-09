import { faker } from '@faker-js/faker';

import { ApplicationModel, IApplication } from '@/models/application.model';
import { IJobPosting } from '@/models/job-posting.model';
import { IUser } from '@/models/user.model';
import { ApplicationStatus, InterestLevel } from '@vtmp/common/constants';

export const loadApplications = async ({
  users,
  jobPostings,
  minApplicationsCountPerUser,
  maxApplicationsCountPerUser,
}: {
  users: IUser[];
  jobPostings: IJobPosting[];
  minApplicationsCountPerUser: number;
  maxApplicationsCountPerUser: number;
}): Promise<IApplication[]> => {
  const MAX_DAYS_FROM_REF_DATE = 30;
  const allApplications: Partial<IApplication>[] = [];

  const formatPortalLink = (companyName: string): string => {
    const formattedName = companyName.toLowerCase().replace(/\s+/g, '');
    return `https://careers.${formattedName}.com`;
  };

  const generateApplicationData = (
    user: IUser,
    jobPosting: IJobPosting
  ): Partial<IApplication> => ({
    userId: user._id,
    jobPostingId: jobPosting._id,
    status: faker.helpers.enumValue(ApplicationStatus),
    referrer: faker.person.firstName(),
    portalLink: formatPortalLink(jobPosting.companyName),
    interest: faker.helpers.enumValue(InterestLevel),
    appliedOnDate: faker.date.soon({
      days: MAX_DAYS_FROM_REF_DATE,
      refDate: jobPosting.datePosted ?? new Date(),
    }),
  });

  for (const user of users) {
    const randomShuffledJobPostings = faker.helpers.arrayElements(jobPostings, {
      min: Math.min(minApplicationsCountPerUser, jobPostings.length),
      max: Math.min(maxApplicationsCountPerUser, jobPostings.length),
    });
    for (const jobPosting of randomShuffledJobPostings) {
      allApplications.push(generateApplicationData(user, jobPosting));
    }
  }

  const applications = await Promise.all(
    allApplications.map((app) => ApplicationModel.create(app))
  );
  console.log(`Successfully seeded ${applications.length} applications.`);
  return applications;
};
