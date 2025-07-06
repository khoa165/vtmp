import mongoose, { ClientSession } from 'mongoose';

import { LinkStatus } from '@vtmp/common/constants';

import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { LinkRepository } from '@/repositories/link.repository';
import {
  ExtractionLinkMetaDataType,
  LinkMetaDataType,
} from '@/types/link.types';
import {
  DuplicateResourceError,
  LinkProcessingBadRequest,
  ResourceNotFoundError,
} from '@/utils/errors';

export const LinkService = {
  submitLink: async (linkMetaData: LinkMetaDataType) => {
    try {
      return await LinkRepository.createLink(linkMetaData);
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        throw new DuplicateResourceError(
          'Link is already submitted',
          linkMetaData
        );
      }
      throw error;
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
        status: LinkStatus.ADMIN_APPROVED,
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

  updateLinkMetaData: async (
    linkId: string,
    linkMetaData: ExtractionLinkMetaDataType
  ) => {
    const { status } = linkMetaData;
    if (
      status === LinkStatus.ADMIN_APPROVED ||
      status === LinkStatus.ADMIN_REJECTED
    ) {
      throw new LinkProcessingBadRequest(
        'Link status cannot be ADMIN_APPROVED or ADMIN_REJECTED when updating metadata',
        { linkMetaData, linkId }
      );
    }

    const updatedLink = await LinkRepository.updateLinkMetaData(
      linkId,
      linkMetaData
    );
    if (!updatedLink) {
      throw new ResourceNotFoundError('Link not found', linkMetaData);
    }

    return updatedLink;
  },

  rejectLink: async (linkId: string) => {
    const updatedLink = await LinkRepository.updateLinkStatus({
      id: linkId,
      status: LinkStatus.ADMIN_REJECTED,
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
