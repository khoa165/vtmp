import { ILink, LinkModel } from '@/models/link.model';
import { faker } from '@faker-js/faker';
import { CompanyName, FAILED_REASON, LinkRegion } from '@vtmp/common/constants';
import { LinkStatus } from '@vtmp/common/constants';
import { formatEnumName } from '@vtmp/common/utils';
import { JobTitle } from '@vtmp/common/constants';
export const loadLinks = async (count: number): Promise<ILink[]> => {
  const newLinks = Array.from({ length: count }, () => ({
    url: faker.internet.url(),
    companyName: formatEnumName(faker.helpers.enumValue(CompanyName)),
    jobTitle: formatEnumName(faker.helpers.enumValue(JobTitle)),
    datePosted: faker.date.recent({ days: 90 }),
    jobDescription: faker.lorem.paragraph(),
    location: faker.helpers.enumValue(LinkRegion),
    status: faker.helpers.enumValue(LinkStatus),
  }));
  const links = await LinkModel.insertMany(
    newLinks.map((link) =>
      link.status === LinkStatus.FAILED
        ? {
            subStatus: faker.helpers.enumValue(FAILED_REASON),
            ...link,
            lastProcessedAt: new Date(new Date().getTime() - 30 * 60 * 1000),
          }
        : link
    )
  );
  console.log(`Successfully seeded ${links.length} links.`);
  return links;
};
