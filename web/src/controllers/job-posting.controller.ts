import { Request, Response } from 'express';
import { z } from 'zod';
import { JobPostingService } from '@/services/job-posting.service';
import { JobPostingLocation } from '@/types/enums';

const JobPostingUpdateSchema = z.object({
  externalPostingId: z.string().optional(),
  url: z.string().url().optional(),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  location: z
    .enum([JobPostingLocation.US, JobPostingLocation.CANADA])
    .optional(),
  datePosted: z.coerce.date().optional(),
  jobDescription: z.string().optional(),
  adminNote: z.string().optional(),
});
const JobIdSchema = z.object({
  jobId: z.string(),
});

export const JobPostingController = {
  updateJobPosting: async (req: Request, res: Response) => {
    const validatedJobIdBody = JobIdSchema.safeParse(req.params);
    const validatedJobPostingUpdateBody = JobPostingUpdateSchema.safeParse(
      req.body
    );

    if (!validatedJobIdBody.success) {
      throw validatedJobIdBody.error;
    }
    if (!validatedJobPostingUpdateBody.success) {
      throw validatedJobPostingUpdateBody.error;
    }

    const updatedJobPosting = await JobPostingService.updateJobPostingById(
      validatedJobIdBody.data.jobId,
      validatedJobPostingUpdateBody.data
    );
    res.status(200).json({
      data: updatedJobPosting,
    });
  },

  deleteJobPosting: async (req: Request, res: Response) => {
    const validatedJobIdBody = JobIdSchema.safeParse(req.params);

    if (!validatedJobIdBody.success) {
      throw validatedJobIdBody.error;
    }

    const deletedJobPosting = await JobPostingService.deleteJobPostingById(
      validatedJobIdBody.data.jobId
    );
    res.status(200).json({
      data: deletedJobPosting,
    });
  },
};
