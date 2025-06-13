import { LinkModel, ILink } from '@/models/link.model';
import { Types, ClientSession } from 'mongoose';
import { FAILED_REASON, LinkStatus } from '@vtmp/common/constants';
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

  updateLinkStatus: async ({
    id,
    status,
    session,
  }: {
    id: string;
    status: LinkStatus;
    session?: ClientSession;
  }): Promise<ILink | null> => {
    return LinkModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { $set: { status, subStatus: null } },
      { new: true, session: session ?? null, runValidators: true }
    ).lean();
  },

  updateLinkMetaData: async (
    id: string,
    linkMetaData: ExtractionLinkMetaDataType
  ): Promise<ILink | null> => {
    return LinkModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { $set: linkMetaData },
      { new: true, runValidators: true }
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
    } = {},
    retry = false
  ): Promise<ILink[]> => {
    return LinkModel.find(
      retry
        ? {
            $or: [
              { status: LinkStatus.PENDING },
              {
                status: LinkStatus.FAILED,
                subStatus: FAILED_REASON.UNKNOWN_FAILED,
                attemptsCount: { $lt: 4 },
                $expr: {
                  $gt: [
                    {
                      $dateDiff: {
                        startDate: '$lastProcessedAt',
                        endDate: '$$NOW',
                        unit: 'minute',
                      },
                    },
                    30,
                  ],
                },
              },
            ],
          }
        : filters
    ).lean();
  },

  getLinkByUrl: async (url: string): Promise<ILink | null> => {
    return LinkModel.findOne({ url }).lean();
  },
};
