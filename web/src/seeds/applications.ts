import { ApplicationModel, IApplication } from '@/models/application.model';
import { IJobPosting } from '@/models/job-posting.model';
import { IUser } from '@/models/user.model';
import { ApplicationStatus, InterestLevel } from '@vtmp/common/constants';
import { faker } from '@faker-js/faker';

export const loadApplications = async (
  users: IUser[],
  jobPostings: IJobPosting[]
): Promise<IApplication[]> => {
  const RECENT_DAYS = 90;
  const MIN_JOB_POSTINGS_RATIO = 0.5;
  const MAX_JOB_POSTINGS_RATIO = 1.0;
  const allApplications: Partial<IApplication>[] = [];
  const numJobPostings: number = jobPostings.length;

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
    appliedOnDate: faker.date.recent({
      days: RECENT_DAYS,
    }),
  });

  for (const user of users) {
    const randomShuffledJobPostings = faker.helpers.arrayElements(jobPostings, {
      min: Math.floor(numJobPostings * MIN_JOB_POSTINGS_RATIO),
      max: Math.floor(numJobPostings * MAX_JOB_POSTINGS_RATIO),
    });
    for (const jobPosting of randomShuffledJobPostings) {
      allApplications.push(generateApplicationData(user, jobPosting));
    }
  }

  const applications = await Promise.all(
    allApplications.map((app) => ApplicationModel.create(app))
  );
  console.log(`Successfully seeded ${allApplications.length} applications.`);
  return applications;
};
