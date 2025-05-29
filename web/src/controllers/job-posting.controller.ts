import { Request, Response } from 'express';
import { z } from 'zod';
import { JobPostingService } from '@/services/job-posting.service';
import { JobFunction, JobPostingRegion, JobType } from '@vtmp/common/constants';
import { getUserFromRequest } from '@/middlewares/utils';

const JobPostingUpdateSchema = z.object({
  externalPostingId: z.string().optional(),
  url: z.string().url().optional(),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  location: z.nativeEnum(JobPostingRegion).optional(),
  datePosted: z.coerce.date().optional(),
  jobDescription: z.string().optional(),
  adminNote: z.string().optional(),
});
const JobIdSchema = z.object({
  jobId: z.string(),
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
    const filterData = FilterSchema.parse(req.body);

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
