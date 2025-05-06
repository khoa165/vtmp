import { LinkModel } from '@/models/link.model';
import mongoose, { ClientSession } from 'mongoose';
import { LinkStatus } from '@vtmp/common/constants';

const { ObjectId } = mongoose.Types;

export const LinkRepository = {
  createLink: async (url: string) => {
    return LinkModel.create({ url });
  },

  getLinkById: async (id: string) => {
    return LinkModel.findById(id);
  },

  updateLinkStatus: async ({
    id,
    status,
    session,
  }: {
    id: string;
    status: LinkStatus;
    session?: ClientSession;
  }) => {
    return LinkModel.findByIdAndUpdate(
      new ObjectId(id),
      { $set: { status } },
      { new: true, session: session ?? null }
    );
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
};
