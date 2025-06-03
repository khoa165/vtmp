import { ILink, LinkModel } from '@/models/link.model';
import { faker } from '@faker-js/faker';
import { CompanyName, JobPostingRegion } from '@vtmp/common/constants';
import { LinkStatus } from '@vtmp/common/constants';
import { formatEnumName } from '@vtmp/common/utils';
import { JobTitle } from '@vtmp/common/constants';
export const loadLinks = async (count: number): Promise<ILink[]> => {
  const newLinks = Array.from({ length: count }, () => ({
    _id: faker.database.mongodbObjectId(),
    url: faker.internet.url(),
    companyName: formatEnumName(faker.helpers.enumValue(CompanyName)),
    jobTitle: formatEnumName(faker.helpers.enumValue(JobTitle)),
    datePosted: faker.date.recent({ days: 90 }),
    jobDescription: faker.lorem.paragraph(),
    location: faker.helpers.enumValue(JobPostingRegion),
    status: faker.helpers.enumValue(LinkStatus),
  }));

  const links = await LinkModel.insertMany(newLinks);
  console.log(`Successfully seeded ${links.length} links.`);
  return links;
};
