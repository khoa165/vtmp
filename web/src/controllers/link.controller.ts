import { Request, Response } from 'express';
import { LinkService } from '@/services/link.service';
import { z } from 'zod';
import { JobPostingLocation, LinkStatus } from '@vtmp/common/constants';

const LinkSchema = z.object({
  url: z.string({ required_error: 'URL is required' }).url(),
});

const filterUndefinedAttributes = (data: object) =>
  Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );

const JobPostingAdditionalSchema = z
  .object({
    jobTitle: z.string({ required_error: 'Job Title is required' }),
    companyName: z.string({ required_error: 'Company Name is required' }),
    location: z.nativeEnum(JobPostingLocation, {
      message: 'Invalid location',
    }),
    jobDescription: z.string().optional(),
    adminNote: z.string().optional(),
    datePosted: z.date().optional(),
  })
  .transform(filterUndefinedAttributes);

const LinkIdSchema = z.object({
  linkId: z.string(),
});

const LinkFilterSchema = z
  .object({
    status: z
      .nativeEnum(LinkStatus, {
        message: 'Invalid application status',
      })
      .optional(),
  })
  .strict({
    message: 'Only allow filtering by given fields',
  })
  .transform(filterUndefinedAttributes);

export const LinkController = {
  submitLink: async (req: Request, res: Response) => {
    const parsedLink = LinkSchema.parse(req.body);

    const submitLink = await LinkService.submitLink(parsedLink.url);
    res.status(201).json({
      message: 'Link has been submitted successfully.',
      data: { link: submitLink },
    });
  },

  getLinks: async (req: Request, res: Response) => {
    const filters = LinkFilterSchema.parse(req.query);
    const links = await LinkService.getLinks(filters);
    res.status(200).json({
      messsage: 'Links have been retrieved successfully.',
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
