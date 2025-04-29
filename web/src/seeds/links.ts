import { ILink, LinkModel } from '@/models/link.model';

export const loadLinks = async (count: number): Promise<ILink[]> => {
  const newLinks = Array.from({ length: count }, (_, i) => ({
    url: `https://example.com/link${i}`,
  }));

  const links = await LinkModel.insertMany(newLinks);
  console.log(`Successfully seeded ${count} links.`);
  return links;
};
