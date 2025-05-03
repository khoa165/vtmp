import { ApplicationModel, IApplication } from '@/models/application.model';
import { IJobPosting } from '@/models/job-posting.model';
import { IUser } from '@/models/user.model';
import { ApplicationStatus, InterestLevel } from '@vtmp/common/constants';

export const loadApplications = async (
  users: IUser[],
  jobPostings: IJobPosting[]
): Promise<IApplication[]> => {
  const seedApplications = [
    {
      userId: users[0]?.id,
      jobPostingId: jobPostings[0]?.id,
      status: ApplicationStatus.IN_PROGRESS,
      referrer: 'Khoa',
      portalLink: 'abc.com',
      interest: InterestLevel.LOW,
    },
    {
      userId: users[0]?.id,
      jobPostingId: jobPostings[1]?.id,
      status: ApplicationStatus.OA,
      referrer: 'An',
      portalLink: 'def.com',
      interest: InterestLevel.MEDIUM,
    },
    {
      userId: users[0]?.id,
      jobPostingId: jobPostings[2]?.id,
      status: ApplicationStatus.SUBMITTED,
      referrer: 'Jun',
      portalLink: 'xyz.com',
      interest: InterestLevel.HIGH,
    },
    {
      userId: users[1]?.id,
      jobPostingId: jobPostings[0]?.id,
      status: ApplicationStatus.WITHDRAWN,
      referrer: 'Khoa',
      portalLink: 'abc.com',
      interest: InterestLevel.LOW,
    },
    {
      userId: users[1]?.id,
      jobPostingId: jobPostings[1]?.id,
      status: ApplicationStatus.OFFER,
      referrer: 'Khoa',
      portalLink: 'abc.com',
      interest: InterestLevel.LOW,
    },
    {
      userId: users[3]?.id,
      jobPostingId: jobPostings[3]?.id,
      status: ApplicationStatus.SUBMITTED,
      referrer: 'Son',
      portalLink: 'abc.com',
      interest: InterestLevel.HIGH,
    },
  ];

  const applications = await ApplicationModel.insertMany(seedApplications);
  console.log('Successfully seeded applications.');
  return applications;
};
