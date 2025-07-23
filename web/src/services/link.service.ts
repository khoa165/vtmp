import mongoose, { ClientSession } from 'mongoose';

import { LinkStatus } from '@vtmp/common/constants';

import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { LinkRepository } from '@/repositories/link.repository';
import {
  ExtractionLinkMetaDataType,
  LinkMetaDataType,
} from '@/types/link.types';
import { DuplicateResourceError, ResourceNotFoundError } from '@/utils/errors';

export const LinkService = {
  submitLink: async (submittedBy: string, linkMetaData: LinkMetaDataType) => {
    const foundLink = await LinkRepository.getLinkByUrl(
      linkMetaData.originalUrl
    );
    if (foundLink) {
      throw new DuplicateResourceError('Duplicate link found', linkMetaData);
    }
    return await LinkRepository.createLink(submittedBy, linkMetaData);
  },

  approveLinkAndCreateJobPosting: async (
    linkId: string,
    jobPostingData: object
  ) => {
    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();
    let jobPosting;
    try {
      const updatedLink = await LinkRepository.updateLinkMetaData(
        linkId,
        {
          ...jobPostingData,
          status: LinkStatus.ADMIN_APPROVED,
          failureStage: null,
        },
        session
      );
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
    const updatedLink = await LinkRepository.updateLinkMetaData(linkId, {
      status: LinkStatus.ADMIN_REJECTED,
      failureStage: null,
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
