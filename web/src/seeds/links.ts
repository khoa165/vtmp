import { faker } from '@faker-js/faker';

import {
  CompanyName,
  LinkProcessingFailureStage,
  LinkRegion,
  LinkStatus,
  JobFunction,
} from '@vtmp/common/constants';
import { formatEnumName } from '@vtmp/common/utils';

import { ILink, LinkModel } from '@/models/link.model';

import realLinksJson from './real-links.json';

export const loadLinks = async (
  count: number,
  options: { seedRealLinks?: boolean } = {}
): Promise<ILink[]> => {
  const { seedRealLinks = false } = options;
  let allLinks = [];
  const TWO_HOURS_AGO = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const TWENTY_MINUTES_AGO = new Date(Date.now() - 20 * 60 * 1000);

  const _generateFakeLink = () => ({
    originalUrl: faker.internet.url(),
    companyName: formatEnumName(faker.helpers.enumValue(CompanyName)),
    jobTitle: formatEnumName(faker.helpers.enumValue(JobFunction)),
    datePosted: faker.date.recent({ days: 90 }),
    jobDescription: faker.lorem.paragraph(),
    location: faker.helpers.enumValue(LinkRegion),
    status: faker.helpers.enumValue(LinkStatus),
  });

  const _generateRealLink = (url: string) => ({
    originalUrl: url,
    status: faker.helpers.arrayElement([
      LinkStatus.PENDING_PROCESSING,
      LinkStatus.PENDING_RETRY,
    ]),
  });

  const _postProcessLink = (
    link: ReturnType<typeof _generateFakeLink | typeof _generateRealLink>
  ) => {
    const isFailed =
      link.status === LinkStatus.PENDING_RETRY ||
      link.status === LinkStatus.PIPELINE_FAILED ||
      link.status === LinkStatus.PIPELINE_REJECTED;

    if (isFailed) {
      return {
        ...link,
        failureStage: faker.helpers.enumValue(LinkProcessingFailureStage),
        attemptsCount: faker.helpers.weightedArrayElement([
          { value: 1, weight: 50 },
          { value: 2, weight: 35 },
          { value: 3, weight: 10 },
          { value: 4, weight: 5 },
        ]),
        lastProcessedAt: faker.date.between({
          from: TWO_HOURS_AGO,
          to: TWENTY_MINUTES_AGO,
        }),
      };
    }
    return link;
  };

  if (seedRealLinks) {
    const parsedLinks: string[] = realLinksJson;

    if (count >= parsedLinks.length) {
      const realLinks = parsedLinks.map(_generateRealLink);
      const fakeLinks = Array.from(
        { length: count - parsedLinks.length },
        _generateFakeLink
      );
      allLinks = [...realLinks, ...fakeLinks];
    } else {
      const selectedParsedLinks = faker.helpers.arrayElements(parsedLinks, {
        min: count,
        max: count,
      });
      allLinks = selectedParsedLinks.map(_generateRealLink);
    }
  } else {
    allLinks = Array.from({ length: count }, _generateFakeLink);
  }

  const links = await LinkModel.insertMany(allLinks.map(_postProcessLink));
  console.log(`Successfully seeded ${links.length} links.`);
  return links;
};
