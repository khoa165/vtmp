import { LinkModel, ILink } from '@/models/link.model';
import { Types, ClientSession } from 'mongoose';
import {
  JobFunction,
  JobType,
  LinkProcessStage,
  LinkRegion,
  LinkStatus,
} from '@vtmp/common/constants';
import { LinkType } from '@/controllers/link.controller';

export const LinkRepository = {
  createLink: async (linkData: LinkType): Promise<ILink> => {
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

  updateLinkMetaData: async (
    id: string,
    linkMetaData: {
      processStage?: LinkProcessStage;
      jobTitle?: string;
      companyName?: string;
      location?: LinkRegion;
      datePosted?: Date;
      jobDescription?: string;
      jobFunction?: JobFunction;
      jobType?: JobType;
    } = {}
  ): Promise<ILink | null> => {
    return LinkModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { $set: linkMetaData },
      { new: true }
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

  getLinks: async (
    filters: {
      status?: LinkStatus;
      processStage?: LinkProcessStage;
    } = {}
  ): Promise<ILink[]> => {
    return LinkModel.find(filters).lean();
  },

  getLinkByUrl: async (url: string): Promise<ILink | null> => {
    return LinkModel.findOne({ url }).lean();
  },
};
