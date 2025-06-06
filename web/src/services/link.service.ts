import { LinkStatus } from '@vtmp/common/constants';
import { LinkRepository } from '@/repositories/link.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { DuplicateResourceError, ResourceNotFoundError } from '@/utils/errors';
import mongoose, { ClientSession } from 'mongoose';
import { LinkProcessorService } from '@/services/link/link-processor.service';

export const LinkService = {
  submitLink: async (url: string) => {
    try {
      const metaData = await LinkProcessorService.processLink(url);
      return await LinkRepository.createLink(metaData);
    } catch {
      throw new DuplicateResourceError('Duplicate url', { url });
    }
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
        jobPostingData: {
          ...jobPostingData,
          linkId,
          url: updatedLink.url,
          submittedBy: updatedLink.submittedBy,
        },
        session,
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

  getLinkCountByStatus: async () => {
    const linksCountByStatus = await LinkRepository.getLinkCountByStatus();
    return Object.fromEntries(
      Object.keys(LinkStatus).map((status) => [
        status,
        linksCountByStatus[status] || 0,
      ])
    );
  },

  getLinks: async (filters: { status?: LinkStatus } = {}) => {
    return LinkRepository.getLinks(filters);
  },
};
