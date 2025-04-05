import { Request, Response } from 'express';
import { LinkService } from '@/services/link.service';
import { z } from 'zod';
import { handleError } from '../utils/errors';
import { LinkStatus } from '@/models/link.model';
import { url } from 'inspector';

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
      res.status(201).json({
        data: { link: submitLink },
      });
      return;
    } catch (error: unknown) {
      const { statusCode, errors } = handleError(error);
      res.status(statusCode).json({ errors });
      return;
    }
  },

  getPendingLinks: async (_req: Request, res: Response) => {
    try {
      const links = await LinkService.getPendingLinks();
      res.status(200).json({
        data: { links },
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
      const parsedLink = LinkIdSchema.parse(req.params);

      const approvedLink = await LinkService.approveLinkAndCreateJobPosting(
        parsedLink.linkId,
        parsedLink
      );
      res.status(200).json({
        message: 'Link has been approved!',
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
        message: 'Link has been rejected!',
      });
      return;
    } catch (error: unknown) {
      const { statusCode, errors } = handleError(error);
      res.status(statusCode).json({ errors });
      return;
    }
  },
};
