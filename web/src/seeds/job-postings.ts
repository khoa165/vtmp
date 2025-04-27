import { IJobPosting, JobPostingModel } from '@/models/job-posting.model';
import { ILink } from '@/models/link.model';

export const loadJobPostings = async (
  links: ILink[]
): Promise<IJobPosting[]> => {
  const newJobPostings = links.map((link, i) => ({
    linkId: link.id,
    url: link.url,
    jobTitle: `Job title ${i}`,
    companyName: `Company ${i}`,
  }));

  const jobPostings = await JobPostingModel.insertMany(newJobPostings);
  console.log(`Successfully seeded ${links.length} job postings.`);
  return jobPostings;
};
