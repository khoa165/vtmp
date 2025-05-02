import { LinkModel } from '@/models/link.model';
import mongoose, { ClientSession } from 'mongoose';
import { LinkStatus } from '@vtmp/common/constants';

const { ObjectId } = mongoose.Types;

export const LinkRepository = {
  createLink: async (linkData: object) => {
    return LinkModel.create(linkData);
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

  getLinksByStatus: async (status: LinkStatus) => {
    return LinkModel.find({ status });
  },
};
