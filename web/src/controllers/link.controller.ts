import { Request, Response } from 'express';
import { LinkService } from '@/services/link.service';
import { z } from 'zod';
import { handleError } from '../utils/errors';

const LinkSchema = z.object({
  url: z.string({ required_error: 'URL is required' }).url(),
  userNote: z.string().optional(),
});

const JobPostingAdditionalSchema = z.object({
  jobTitle: z.string({ required_error: 'Job Title is required' }),
  companyName: z.string({ required_error: 'Company Name is required' }),
  jobDescription: z.string().optional(),
  adminNote: z.string().optional(),
});

const LinkIdSchema = z.object({
  linkId: z.string(),
});

export const LinkController = {
  submitLink: async (req: Request, res: Response) => {
    try {
      const parsedLink = LinkSchema.parse(req.body);

      const submitLink = await LinkService.submitLink(parsedLink.url);
      res.status(201).json({
        message: 'Link has been submitted successfully.',
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
      const parsedAdminAddOn = JobPostingAdditionalSchema.parse(req.body);

      const approvedLink = await LinkService.approveLinkAndCreateJobPosting(
        parsedLink.linkId,
        parsedAdminAddOn
      );
      res.status(200).json({
        message: 'Link has been approved!',
        data: { link: approvedLink },
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
      const parsedLink = LinkIdSchema.parse(req.params);

      const rejectedLink = await LinkService.rejectLink(parsedLink.linkId);
      res.status(200).json({
        message: 'Link has been rejected!',
        data: { link: rejectedLink },
      });
      return;
    } catch (error: unknown) {
      const { statusCode, errors } = handleError(error);
      res.status(statusCode).json({ errors });
      return;
    }
  },
};
