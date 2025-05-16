import { ILink, LinkModel } from '@/models/link.model';
import { faker } from '@faker-js/faker';

export const loadLinks = async (count: number): Promise<ILink[]> => {
  const newLinks = Array.from({ length: count }, () => ({
    url: faker.internet.url(),
  }));

  const links = await LinkModel.insertMany(newLinks);
  console.log(`Successfully seeded ${count} links.`);
  return links;
};
