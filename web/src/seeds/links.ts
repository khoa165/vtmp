import { ILink, LinkModel } from '@/models/link.model';
import { faker } from '@faker-js/faker';
import { CompanyName, JobPostingLocation } from '@vtmp/common/constants';

export const loadLinks = async (count: number): Promise<ILink[]> => {
  const formatCompanyName = (name: string) => {
    return name
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const newLinks = Array.from({ length: count }, () => ({
    id: faker.database.mongodbObjectId(),
    url: faker.internet.url(),
    companyName: formatCompanyName(faker.helpers.enumValue(CompanyName)),
    datePosted: faker.date.past(),
    jobDescription: faker.lorem.paragraph(),
    location: faker.helpers.enumValue(JobPostingLocation),
  }));
  const links = await LinkModel.insertMany(newLinks);
  console.log(`Successfully seeded ${count} links.`);
  return links;
};
