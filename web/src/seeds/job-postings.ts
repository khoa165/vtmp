import { faker } from '@faker-js/faker';

import {
  CompanyName,
  JobPostingRegion,
  JobFunction,
} from '@vtmp/common/constants';
import { formatEnumName } from '@vtmp/common/utils';

import { JobPostingModel } from '@/models/job-posting.model';
import { ILink, IJobPosting } from '@/types/entities';

export const loadJobPostings = async (
  links: ILink[]
): Promise<IJobPosting[]> => {
  const newJobPostings = links.map((link) => {
    const isRecent = Math.random() < 0.1;
    const datePosted = isRecent
      ? faker.date.recent({ days: 1 })
      : faker.date.recent({ days: 90 });
    return {
      linkId: link._id,
      url: link.url,
      jobTitle: formatEnumName(faker.helpers.enumValue(JobFunction)),
      companyName: formatEnumName(faker.helpers.enumValue(CompanyName)),
      datePosted,
      location: faker.helpers.enumValue(JobPostingRegion),
    };
  });

  const jobPostings = await JobPostingModel.insertMany(newJobPostings);
  console.log(`Successfully seeded ${jobPostings.length} job postings.`);
  return jobPostings;
};
