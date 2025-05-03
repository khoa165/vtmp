import { IJobPosting, JobPostingModel } from '@/models/job-posting.model';
import { ILink } from '@/models/link.model';
import { faker } from '@faker-js/faker';
import { JobPostingLocation } from '@vtmp/common/constants';

export const loadJobPostings = async (
  links: ILink[]
): Promise<IJobPosting[]> => {
  const newJobPostings = links.map((link) => ({
    linkId: link.id,
    url: link.url,
    jobTitle: faker.person.jobTitle(),
    companyName: faker.company.name(),
    location: faker.helpers.arrayElement(Object.values(JobPostingLocation)),
  }));

  const jobPostings = await JobPostingModel.insertMany(newJobPostings);
  console.log(`Successfully seeded ${links.length} job postings.`);
  return jobPostings;
};
