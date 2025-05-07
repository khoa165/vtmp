import { LinkModel, ILink } from '@/models/link.model';
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

  getLinksByStatus: async (status: LinkStatus): Promise<ILink[]> => {
    return LinkModel.find({ status }).lean();
  },
};
