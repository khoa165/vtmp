import { parse } from 'date-fns';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';

import { JobFunction, JobPostingRegion, JobType } from '@vtmp/common/constants';

import { getUserFromRequest } from '@/middlewares/utils';
import { JobPostingService } from '@/services/job-posting.service';

const JobPostingUpdateSchema = z
  .object({
    externalPostingId: z.string().optional(),
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
      .nativeEnum(JobPostingRegion, {
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

const JobPostingIdParamSchema = z.object({
  jobPostingId: z
    .string({ required_error: 'Job posting ID is required' })
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid job posting ID format',
    }),
});

const FilterSchema = z
  .object({
    jobTitle: z.string().optional(),
    companyName: z.string().optional(),
    location: z.nativeEnum(JobPostingRegion).optional(),
    jobFunction: z.nativeEnum(JobFunction).optional(),
    jobType: z.nativeEnum(JobType).optional(),
    postingDateRangeStart: z.coerce.date().optional(),
    postingDateRangeEnd: z.coerce.date().optional(),
  })
  .strict()
  .transform((data) =>
    Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    )
  );

export const JobPostingController = {
  getJobPostingById: async (req: Request, res: Response) => {
    const { jobPostingId } = JobPostingIdParamSchema.parse(req.params);
    const jobPosting = await JobPostingService.getJobPostingById(jobPostingId);

    res.status(200).json({
      data: jobPosting,
    });
  },
  updateJobPosting: async (req: Request, res: Response) => {
    const { jobPostingId } = JobPostingIdParamSchema.parse(req.params);
    const jobPostingData = JobPostingUpdateSchema.parse(req.body);

    const updatedJobPosting = await JobPostingService.updateJobPostingById(
      jobPostingId,
      jobPostingData
    );
    res.status(200).json({
      data: updatedJobPosting,
    });
  },

  deleteJobPosting: async (req: Request, res: Response) => {
    const { jobPostingId } = JobPostingIdParamSchema.parse(req.params);

    const deletedJobPosting =
      await JobPostingService.deleteJobPostingById(jobPostingId);
    res.status(200).json({
      data: deletedJobPosting,
    });
  },

  getJobPostingsUserHasNotAppliedTo: async (req: Request, res: Response) => {
    const userId = getUserFromRequest(req).id;
    const filterData = FilterSchema.parse(req.query);

    const jobPostings =
      await JobPostingService.getJobPostingsUserHasNotAppliedTo({
        userId: userId,
        filters: filterData,
      });

    res.status(200).json({
      message: 'Job postings retrieved successfully',
      data: jobPostings,
    });
  },
};
