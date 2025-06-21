import { faker } from '@faker-js/faker';

import {
  CompanyName,
  LinkProcessingFailureStage,
  LinkRegion,
 LinkStatus , JobTitle } from '@vtmp/common/constants';
import { formatEnumName } from '@vtmp/common/utils';

import { ILink, LinkModel } from '@/models/link.model';

export const loadLinks = async (count: number): Promise<ILink[]> => {
  const newLinks = Array.from({ length: count }, () => ({
    originalUrl: faker.internet.url(),
    companyName: formatEnumName(faker.helpers.enumValue(CompanyName)),
    jobTitle: formatEnumName(faker.helpers.enumValue(JobTitle)),
    datePosted: faker.date.recent({ days: 90 }),
    jobDescription: faker.lorem.paragraph(),
    location: faker.helpers.enumValue(LinkRegion),
    status: faker.helpers.enumValue(LinkStatus),
  }));
  const links = await LinkModel.insertMany(
    newLinks.map((link) => {
      const isFailed =
        link.status === LinkStatus.PIPELINE_FAILED ||
        link.status === LinkStatus.PENDING_RETRY ||
        link.status === LinkStatus.PIPELINE_REJECTED;
      return isFailed
        ? {
            failureStage: faker.helpers.enumValue(LinkProcessingFailureStage),
            ...link,
            lastProcessedAt: new Date(new Date().getTime() - 30 * 60 * 1000),
          }
        : link;
    })
  );
  console.log(`Successfully seeded ${links.length} links.`);
  return links;
};
