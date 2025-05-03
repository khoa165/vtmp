import { IJobPosting, JobPostingModel } from '@/models/job-posting.model';
import { ILink } from '@/models/link.model';
import { faker } from '@faker-js/faker';
import { CompanyName, JobPostingLocation } from '@vtmp/common/constants';

export const loadJobPostings = async (
  links: ILink[]
): Promise<IJobPosting[]> => {
  const formatCompanyName = (name: string) => {
    return name
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const newJobPostings = links.map((link) => ({
    linkId: link.id,
    url: link.url,
    jobTitle: faker.person.jobTitle(),
    companyName: formatCompanyName(
      faker.helpers.arrayElement(Object.values(CompanyName))
    ),
    location: faker.helpers.arrayElement(Object.values(JobPostingLocation)),
  }));

  const jobPostings = await JobPostingModel.insertMany(newJobPostings);
  console.log(`Successfully seeded ${links.length} job postings.`);
  return jobPostings;
};
