import { LinkStatus } from '@/models/link.model';
import LinkRepository from '@/repositories/link.repository';
import { ResourceNotFoundError } from '@/utils/errors';
import mongoose, { ClientSession } from 'mongoose';

const LinkService = {
  submitLink: async (url: string) => {
    return LinkRepository.createLink(url);
  },

  approveLinkAndCreateJobPosting: async (linkId: string) => {
    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();
    try {
      const updatedLink = await LinkRepository.updateStatus({
        id: linkId,
        status: LinkStatus.APPROVED,
        session,
      });
      if (!updatedLink) {
        throw new ResourceNotFoundError('Link not found', {
          linkId,
        });
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },

  rejectLink: async (linkId: string) => {
    const updatedLink = await LinkRepository.updateStatus({
      id: linkId,
      status: LinkStatus.REJECTED,
    });
    if (!updatedLink) {
      throw new ResourceNotFoundError('Link not found', {
        linkId,
      });
    }
  },

  getPendingLinks: async () => {
    return LinkRepository.getLinksByStatus(LinkStatus.PENDING);
  },
};

export default LinkService;
