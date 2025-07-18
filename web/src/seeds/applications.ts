import { faker } from '@faker-js/faker';
import { IUser } from '@vtmp/mongo/models';

import { ApplicationStatus, InterestLevel } from '@vtmp/common/constants';

import { ApplicationModel, IApplication } from '@/models/application.model';
import { IJobPosting } from '@/models/job-posting.model';

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
    status: faker.helpers.weightedArrayElement([
      { value: ApplicationStatus.SUBMITTED, weight: 70 },
      { value: ApplicationStatus.OA, weight: 10 },
      { value: ApplicationStatus.INTERVIEWING, weight: 3 },
      { value: ApplicationStatus.OFFERED, weight: 2 },
      { value: ApplicationStatus.REJECTED, weight: 5 },
      { value: ApplicationStatus.WITHDRAWN, weight: 10 },
    ]),
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
