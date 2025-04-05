import { LinkRepository } from '@/repositories/link.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { ResourceNotFoundError } from '@/utils/errors';
import mongoose, { ClientSession } from 'mongoose';
import { LinkStatus } from '@/types/enums';

export const LinkService = {
  submitLink: async (url: string) => {
    return LinkRepository.createLink(url);
  },

  approveLinkAndCreateJobPosting: async (
    linkId: string,
    jobPostingData: object
  ) => {
    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();
    let jobPosting;
    try {
      const updatedLink = await LinkRepository.updateLinkStatus({
        id: linkId,
        status: LinkStatus.APPROVED,
        session,
      });
      if (!updatedLink) {
        throw new ResourceNotFoundError('Link not found', {
          linkId,
        });
      }

      jobPosting = await JobPostingRepository.createJobPosting({
        linkId,
        url: updatedLink.url,
        submittedBy: updatedLink.submittedBy,
        ...jobPostingData,
      });

      await session.commitTransaction();
    } catch (error: unknown) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
    return jobPosting;
  },

  rejectLink: async (linkId: string) => {
    const updatedLink = await LinkRepository.updateLinkStatus({
      id: linkId,
      status: LinkStatus.REJECTED,
    });
    if (!updatedLink) {
      throw new ResourceNotFoundError('Link not found', {
        linkId,
      });
    }
    return updatedLink;
  },

  getPendingLinks: async () => {
    return LinkRepository.getLinksByStatus(LinkStatus.PENDING);
  },
};
