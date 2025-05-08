import { Request, Response } from 'express';
import { LinkService } from '@/services/link.service';
import { z } from 'zod';

const LinkSchema = z.object({
  url: z.string({ required_error: 'URL is required' }).url(),
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
    const parsedLink = LinkSchema.parse(req.body);

    const submitLink = await LinkService.submitLink(parsedLink.url);
    res.status(201).json({
      message: 'Link has been submitted successfully.',
      data: { link: submitLink },
    });
  },

  getPendingLinks: async (_req: Request, res: Response) => {
    const links = await LinkService.getPendingLinks();
    res.status(200).json({
      data: { links },
    });
  },

  approveLink: async (req: Request, res: Response) => {
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
  },

  rejectLink: async (req: Request, res: Response) => {
    const parsedLink = LinkIdSchema.parse(req.params);

    const rejectedLink = await LinkService.rejectLink(parsedLink.linkId);
    res.status(200).json({
      message: 'Link has been rejected!',
      data: { link: rejectedLink },
    });
  },
};
