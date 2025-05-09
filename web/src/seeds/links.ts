import { ILink, LinkModel } from '@/models/link.model';
import { faker } from '@faker-js/faker';
import { CompanyName, JobPostingLocation } from '@vtmp/common/constants';
import { LinkStatus } from '../../../packages/common/src/constants/enums';

export const loadLinks = async (count: number): Promise<ILink[]> => {
  const formatCompanyName = (name: string) => {
    return name
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  const newLinks = Array.from({ length: count }, () => ({
    _id: faker.database.mongodbObjectId(),
    url: faker.internet.url(),
    companyName: formatCompanyName(faker.helpers.enumValue(CompanyName)),
    datePosted: faker.date.past(),
    jobDescription: faker.lorem.paragraph(),
    jobTitle: faker.person.jobTitle(),
    location: faker.helpers.enumValue(JobPostingLocation),
    status: faker.helpers.enumValue(LinkStatus),
  }));

  const links = await LinkModel.insertMany(newLinks);
  console.log(`Successfully seeded ${count} links.`);
  return links;
};
