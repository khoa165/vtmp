import { Types, ClientSession, FilterQuery } from 'mongoose';

import { LinkModel, ILink } from '@/models/link.model';
import {
  LinkMetaDataType,
  ExtractionLinkMetaDataType,
} from '@/types/link.types';

export const LinkRepository = {
  createLink: async (linkMetaData: LinkMetaDataType): Promise<ILink> => {
    return LinkModel.create(linkMetaData);
  },

  getLinkById: async (id: string): Promise<ILink | null> => {
    return LinkModel.findById(id).lean();
  },

  updateLinkMetaData: async (
    id: string,
    linkMetaData: ExtractionLinkMetaDataType,
    session?: ClientSession
  ): Promise<ILink | null> => {
    return LinkModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { $set: linkMetaData },
      { new: true, runValidators: true, session: session ?? null }
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

  getLinks: async (filters: FilterQuery<ILink> = {}): Promise<ILink[]> => {
    return LinkModel.find(filters).lean();
  },

  getLinkByUrl: async (url: string): Promise<ILink | null> => {
    return LinkModel.findOne({ $or: [{ originalUrl: url }, { url }] }).lean();
  },
};
