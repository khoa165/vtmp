import { Request, Response } from 'express';
import { LinkService } from '@/services/link.service';
import { z } from 'zod';
import { handleError } from '../utils/errors';
import { LinkStatus } from '@/models/link.model';

const LinkSchema = z.object({
  url: z.string().url(),
  status: z.enum([
    LinkStatus.APPROVED,
    LinkStatus.PENDING,
    LinkStatus.REJECTED,
  ]),
  submittedOn: z.coerce.date(),
  companyName: z.string().optional(),
  userNote: z.string().optional(),
});

const LinkIdSchema = z.object({
  linkId: z.string(),
});

export const LinkController = {
  submitLink: async (req: Request, res: Response) => {
    try {
      const parsedLink = LinkSchema.safeParse(req.body);

      if (!parsedLink.success) {
        throw parsedLink.error;
      }

      const submitLink = await LinkService.submitLink(parsedLink.data.url);
      res.status(200).json({
        data: submitLink,
      });
      return;
    } catch (error: unknown) {
      const { statusCode, errors } = handleError(error);
      res.status(statusCode).json({ errors });
      return;
    }
  },

  getPendingLinks: async (res: Response) => {
    try {
      res.status(200).json({
        data: LinkService.getPendingLinks(),
      });
      return;
    } catch (error: unknown) {
      const { statusCode, errors } = handleError(error);
      res.status(statusCode).json({ errors });
      return;
    }
  },

  approveLink: async (req: Request, res: Response) => {
    try {
      const parsedLink = LinkIdSchema.safeParse(req.params);

      if (!parsedLink.success) {
        throw parsedLink.error;
      }

      const approvedLink = await LinkService.approveLinkAndCreateJobPosting(
        parsedLink.data.linkId,
        parsedLink.data
      );
      res.status(200).json({
        data: approvedLink,
      });
      return;
    } catch (error: unknown) {
      const { statusCode, errors } = handleError(error);
      res.status(statusCode).json({ errors });
      return;
    }
  },

  rejectLink: async (req: Request, res: Response) => {
    try {
      const parsedLink = LinkIdSchema.safeParse(req.params);

      if (!parsedLink.success) {
        throw parsedLink.error;
      }

      const rejectedLink = await LinkService.rejectLink(parsedLink.data.linkId);
      res.status(200).json({
        data: rejectedLink,
      });
      return;
    } catch (error: unknown) {
      const { statusCode, errors } = handleError(error);
      res.status(statusCode).json({ errors });
      return;
    }
  },
};
