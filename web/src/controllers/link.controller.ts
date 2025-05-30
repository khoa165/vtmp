import { Request, Response } from 'express';
import { LinkService } from '@/services/link.service';
import { z } from 'zod';
import { JobPostingRegion, LinkStatus } from '@vtmp/common/constants';
import { parse } from 'date-fns';
import { MONGO_OBJECT_ID_REGEX } from '@/controllers/constants/validations';

const LinkSchema = z.object({
  url: z.string({ required_error: 'URL is required' }).url(),
});
const JobPostingDataSchema = z
  .object({
    url: z.string().url({ message: 'Invalid URL format' }),
    jobTitle: z.string({
      required_error: 'Job title is required',
      invalid_type_error: 'Invalid job title format',
    }),
    companyName: z.string({
      required_error: 'Company name is required',
      invalid_type_error: 'Invalid company name format',
    }),
    location: z
      .nativeEnum(JobPostingRegion, {
        message: 'Invalid job location',
      })
      .optional(),
    datePosted: z
      .string()
      .transform((val) => parse(val, 'MM/dd/yyyy', new Date()))
      .refine((val) => !isNaN(val.getTime()), {
        message: 'Invalid date posted format',
      })
      .optional(),
    jobDescription: z
      .string({ invalid_type_error: 'Invalid job description format' })
      .optional(),
    adminNote: z
      .string({ invalid_type_error: 'Invalid admin note format format' })
      .optional(),
    submittedBy: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid link ID format')
      .optional(),
  })
  .strict({ message: 'Some fields are not valid' })
  .transform((data: object) =>
    Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    )
  );

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
  .transform((data: object) =>
    Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    )
  );

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
