import { Request, Response } from 'express';
import { z } from 'zod';
import { JobPostingService } from '@/services/job-posting.service';
import { handleError } from '@/utils/errors';
import { Location } from '@/models/job-posting.model';

const JobPostingUpdateSchema = z.object({
  externalPostingId: z.string().optional(),
  url: z.string().url().optional(),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  location: z.enum([Location.US, Location.CANADA]).optional(),
  datePosted: z.coerce.date().optional(),
  jobDescription: z.string().optional(),
  adminNote: z.string().optional(),
});
const JobIdSchema = z.object({
  jobId: z.string(),
});

export const JobPostingController = {
  updateJobPosting: async (req: Request, res: Response) => {
    try {
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
      return;
    } catch (error: unknown) {
      const { statusCode, errors } = handleError(error);
      res.status(statusCode).json({ errors });
      return;
    }
  },

  deleteJobPosting: async (req: Request, res: Response) => {
    try {
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
      return;
    } catch (error: unknown) {
      const { statusCode, errors } = handleError(error);
      res.status(statusCode).json({ errors });
      return;
    }
  },
};
