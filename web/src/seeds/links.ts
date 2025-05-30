import { ILink, LinkModel } from '@/models/link.model';
import { faker } from '@faker-js/faker';
import { CompanyName, JobPostingRegion } from '@vtmp/common/constants';
import { LinkStatus } from '@vtmp/common/constants';
import { formatEnumName } from '@vtmp/common/utils';
export const loadLinks = async (count: number): Promise<ILink[]> => {
  const newLinks = Array.from({ length: count }, () => ({
    url: faker.internet.url(),
    companyName: formatEnumName(faker.helpers.enumValue(CompanyName)),
    datePosted: faker.date.past(),
    jobDescription: faker.lorem.paragraph(),
    jobTitle: faker.person.jobTitle(),
    location: faker.helpers.enumValue(JobPostingRegion),
    status: faker.helpers.enumValue(LinkStatus),
  }));

  const links = await LinkModel.insertMany(newLinks);
  console.log(`Successfully seeded ${links.length} links.`);
  return links;
};
