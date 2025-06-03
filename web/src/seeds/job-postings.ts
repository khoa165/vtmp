import { IJobPosting, JobPostingModel } from '@/models/job-posting.model';
import { ILink } from '@/models/link.model';
import { faker } from '@faker-js/faker';
import {
  CompanyName,
  JobPostingRegion,
  JobTitle,
} from '@vtmp/common/constants';
import { formatEnumName } from '@vtmp/common/utils';

export const loadJobPostings = async (
  links: ILink[]
): Promise<IJobPosting[]> => {
  const newJobPostings = links.map((link) => ({
    linkId: link._id,
    url: link.url,
    jobTitle: formatEnumName(faker.helpers.enumValue(JobTitle)),
    companyName: formatEnumName(faker.helpers.enumValue(CompanyName)),
    datePosted: faker.date.recent({ days: 90 }),
    location: faker.helpers.enumValue(JobPostingRegion),
  }));

  const jobPostings = await JobPostingModel.insertMany(newJobPostings);
  console.log(`Successfully seeded ${jobPostings.length} job postings.`);
  return jobPostings;
};
