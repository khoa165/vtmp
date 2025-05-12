import { JobPostingLocation, LinkStatus } from '@vtmp/common/constants';
import { LinkRepository } from '@/repositories/link.repository';
import { ResourceNotFoundError } from '@/utils/errors';
import mongoose, { ClientSession } from 'mongoose';
import { JobPostingService } from '@/services/job-posting.service';

export const LinkService = {
  submitLink: async (url: string) => {
    return LinkRepository.createLink({ url });
  },

  approveLinkAndCreateJobPosting: async (
    linkId: string,
    jobPostingData: {
      url?: string;
      externalPostingId?: string;
      jobTitle?: string;
      companyName?: string;
      location?: JobPostingLocation;
      datePosted?: Date;
      jobDescription?: string;
      adminNote?: string;
    }
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

      jobPosting = await JobPostingService.createJobPosting({
        jobPostingData: {
          ...jobPostingData,
          linkId: updatedLink._id,
          url: updatedLink.url,
          ...(updatedLink.submittedBy
            ? { submittedBy: updatedLink.submittedBy }
            : {}),
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
};
