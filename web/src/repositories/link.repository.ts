import { Types, ClientSession } from 'mongoose';

import { LinkModel, ILink } from '@/models/link.model';
import { LinkStatus } from '@vtmp/common/constants';

export const LinkRepository = {
  createLink: async (linkData: { url: string }): Promise<ILink> => {
    return LinkModel.create(linkData);
  },

  getLinkById: async (id: string): Promise<ILink | null> => {
    return LinkModel.findById(id).lean();
  },

  updateLinkStatus: async ({
    id,
    status,
    session,
  }: {
    id: string;
    status: LinkStatus;
    session?: ClientSession;
  }): Promise<ILink | null> => {
    return LinkModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { $set: { status } },
      { new: true, session: session ?? null }
    ).lean();
  },

  getLinkCountByStatus: async () => {
    const result = await LinkModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const groupCountByStatus = result.reduce((accumulator, item) => {
      accumulator[item._id] = item.count;
      return accumulator;
    }, {});

    return groupCountByStatus;
  },

  getLinks: async (filters: { status?: LinkStatus } = {}): Promise<ILink[]> => {
    return LinkModel.find(filters).lean();
  },

  getLinkByUrl: async (url: string): Promise<ILink | null> => {
    return LinkModel.findOne({ url }).lean();
  },
};
