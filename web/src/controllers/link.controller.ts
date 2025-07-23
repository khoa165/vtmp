import { Request, Response } from 'express';

import { getUserFromRequest } from '@/middlewares/utils';
import { LinkService } from '@/services/link.service';
import {
  LinkFilterSchema,
  LinkIdSchema,
  LinkMetaDataSchema,
  JobPostingDataSchema,
  ExtractionLinkMetaDataSchema,
} from '@/types/link.types';

export const LinkController = {
  submitLink: async (req: Request, res: Response) => {
    const userId = getUserFromRequest(req).user.id;
    const parsedLink = LinkMetaDataSchema.parse(req.body);
    const submitLink = await LinkService.submitLink(userId, parsedLink);
    res.status(201).json({
      message: 'Link has been submitted successfully.',
      data: submitLink,
    });
  },

  getLinks: async (req: Request, res: Response) => {
    const filters = LinkFilterSchema.parse(req.query);
    const links = await LinkService.getLinks(filters);
    res.status(200).json({
      message: 'Links have been retrieved successfully.',
      data: links,
    });
  },

  getLinkCountByStatus: async (_req: Request, res: Response) => {
    const linkCounts = await LinkService.getLinkCountByStatus();
    res.status(200).json({
      message: 'Link count has been retrieved successfully.',
      data: linkCounts,
    });
  },

  approveLink: async (req: Request, res: Response) => {
    const parsedLink = LinkIdSchema.parse(req.params);
    const parsedAdminAddOn = JobPostingDataSchema.parse(req.body);

    const approvedLink = await LinkService.approveLinkAndCreateJobPosting(
      parsedLink.linkId,
      parsedAdminAddOn
    );
    res.status(200).json({
      message: 'Link has been approved!',
      data: approvedLink,
    });
  },

  updateLinkMetaData: async (req: Request, res: Response) => {
    const parsedLinkId = LinkIdSchema.parse(req.params);
    const parsedResponseFromExtraction = ExtractionLinkMetaDataSchema.parse(
      req.body
    );
    const updatedLink = await LinkService.updateLinkMetaData(
      parsedLinkId.linkId,
      parsedResponseFromExtraction
    );
    res.status(200).json({
      message: 'Link metadata has been updated!',
      data: updatedLink,
    });
  },

  rejectLink: async (req: Request, res: Response) => {
    const parsedLink = LinkIdSchema.parse(req.params);

    const rejectedLink = await LinkService.rejectLink(parsedLink.linkId);
    res.status(200).json({
      message: 'Link has been rejected by admin',
      data: rejectedLink,
    });
  },
};
