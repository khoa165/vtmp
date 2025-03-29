import LinkModel, { LinkStatus } from '@/models/link.model';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

const LinkRepository = {
  createLink: async (url: string) => {
    return LinkModel.create({ url });
  },

  getLinkById: async (id: string) => {
    return LinkModel.findById(id);
  },

  updateStatus: async (id: string, status: LinkStatus) => {
    return LinkModel.findByIdAndUpdate(
      new ObjectId(id),
      { $set: { status } },
      { new: true }
    );
  },

  getLinksByStatus: async (status: LinkStatus) => {
    return LinkModel.find({ status })
  },
};

export default LinkRepository;
