import { Request, Response } from 'express';
import { z } from 'zod';

import { MONGO_OBJECT_ID_REGEX } from '@/constants/validations';
import { LinkService } from '@/services/link.service';
import { filterUndefinedAttributes } from '@/utils/helpers';
import { JobPostingRegion, LinkStatus } from '@vtmp/common/constants';

const LinkSchema = z.object({
  url: z
    .string({ required_error: 'URL is required' })
    .url({ message: 'Invalid url' }),
});

const JobPostingDataSchema = z
  .object({
    jobTitle: z
      .string({ required_error: 'Job title is required' })
      .min(1, { message: 'Job title cannot be empty' }),

    companyName: z
      .string({ required_error: 'Company name is required' })
      .min(1, { message: 'Company name cannot be empty' }),
    location: z.nativeEnum(JobPostingRegion, {
      message: 'Invalid location',
    }),
    jobDescription: z.string().optional(),
    adminNote: z.string().optional(),
    datePosted: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/, {
        message: 'Date must be in MM/dd/yyyy format',
      })
      .transform((str) => new Date(str))
      .refine(
        (date) => {
          const now = new Date();
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return date >= threeMonthsAgo && date <= now;
        },
        {
          message: 'Date must be within the last 3 months',
        }
      )
      .optional(),
  })
  .transform(filterUndefinedAttributes);

const LinkIdSchema = z.object({
  linkId: z.string().regex(MONGO_OBJECT_ID_REGEX, 'Invalid job ID format'),
});

const LinkFilterSchema = z
  .object({
    status: z
      .nativeEnum(LinkStatus, {
        message: 'Invalid link status',
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

  rejectLink: async (req: Request, res: Response) => {
    const parsedLink = LinkIdSchema.parse(req.params);

    const rejectedLink = await LinkService.rejectLink(parsedLink.linkId);
    res.status(200).json({
      message: 'Link has been rejected!',
      data: rejectedLink,
    });
  },
};
