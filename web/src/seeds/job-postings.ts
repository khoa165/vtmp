import { IJobPosting, JobPostingModel } from '@/models/job-posting.model';
import { ILink } from '@/models/link.model';
import { faker } from '@faker-js/faker';
import {
  CompanyName,
  JobPostingLocation,
  JobTitle,
} from '@vtmp/common/constants';
import { formatEnumName } from '@vtmp/common/utils';

export const loadJobPostings = async (
  links: ILink[]
): Promise<IJobPosting[]> => {
  const RECENT_DAYS = 90;

  const newJobPostings = links.map((link) => ({
    linkId: link._id,
    url: link.url,
    jobTitle: formatEnumName(faker.helpers.enumValue(JobTitle)),
    companyName: formatEnumName(faker.helpers.enumValue(CompanyName)),
    datePosted: faker.date.recent({ days: RECENT_DAYS }),
    location: faker.helpers.enumValue(JobPostingLocation),
  }));

  const jobPostings = await JobPostingModel.insertMany(newJobPostings);
  console.log(`Successfully seeded ${jobPostings.length} job postings.`);
  return jobPostings;
};
