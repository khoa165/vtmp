import { Request, Response } from 'express';
import { z } from 'zod';
import { JobPostingService } from '@/services/job-posting.service';
import { JobPostingLocation } from '@vtmp/common/constants';
import { getUserFromRequest } from '@/middlewares/utils';
import { parse } from 'date-fns';

const JobPostingUpdateSchema = z
  .object({
    externalPostingId: z
      .string({ invalid_type_error: 'Invalid external posting ID format' })
      .optional(),
    url: z
      .string({ invalid_type_error: 'URL must be a string' })
      .url('Invalid URL format')
      .optional(),
    jobTitle: z
      .string({ invalid_type_error: 'Invalid job title format' })
      .optional(),
    companyName: z
      .string({ invalid_type_error: 'Invalid company name format' })
      .optional(),
    location: z
      .nativeEnum(JobPostingLocation, {
        invalid_type_error: 'Invalid Location format',
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
      .string({ invalid_type_error: 'Invalid admin note format' })
      .optional(),
  })
  .strict({
    message: 'field is not allowed to update',
  })
  .transform((data: object) =>
    Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    )
  );

const JobIdSchema = z.object({
  jobId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid job ID format'),
});

export const JobPostingController = {
  updateJobPosting: async (req: Request, res: Response) => {
    const { jobId } = JobIdSchema.parse(req.params);
    const jobPostingData = JobPostingUpdateSchema.parse(req.body);

    const updatedJobPosting = await JobPostingService.updateJobPostingById(
      jobId,
      jobPostingData
    );
    res.status(200).json({
      data: updatedJobPosting,
    });
  },

  deleteJobPosting: async (req: Request, res: Response) => {
    const { jobId } = JobIdSchema.parse(req.params);

    const deletedJobPosting =
      await JobPostingService.deleteJobPostingById(jobId);
    res.status(200).json({
      data: deletedJobPosting,
    });
  },

  getJobPostingsUserHasNotAppliedTo: async (req: Request, res: Response) => {
    const userId = getUserFromRequest(req).user.id;

    const jobPostings =
      await JobPostingService.getJobPostingsUserHasNotAppliedTo(userId);

    res.status(200).json({
      message: 'Job postings retrieved successfully',
      data: jobPostings,
    });
  },
};
