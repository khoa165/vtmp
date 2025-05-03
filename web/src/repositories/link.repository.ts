import { LinkModel, ILink } from '@/models/link.model';
import mongoose, { ClientSession } from 'mongoose';
import { LinkStatus } from '@vtmp/common/constants';

const { ObjectId } = mongoose.Types;

export const LinkRepository = {
  createLink: async (linkData: object): Promise<ILink | null> => {
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
      new ObjectId(id),
      { $set: { status } },
      { new: true, session: session ?? null }
    ).lean();
  },

  getLinksByStatus: async (status: LinkStatus): Promise<ILink[]> => {
    return LinkModel.find({ status });
  },
};
