import { Request, Response } from 'express';
import { z } from 'zod';
import JobPostingService from '@/services/jobPosting.service';
import {
  ResourceNotFoundError,
  UnauthorizedError,
  ForbiddenError,
  handleError,
} from '../utils/errors';

const NewUpdateSchema = z.object({
  externalPostingId: z.string().optional(),
  url: z.string().url().optional(),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  location: z.enum(['US', 'CANADA']).optional(),
  datePosted: z.coerce.date().optional(),
  jobDescription: z.string().optional(),
  adminNote: z.string().optional(),
  deletedAt: z.coerce.date().optional(),
});
const JobIdSchema = z.object({
  jobId: z.string(),
});

const JobPostingController = {
  updateJobPosting: async (req: Request, res: Response) => {
    try {
      const { jobId } = JobIdSchema.parse(req.params);
      const newUpdate = NewUpdateSchema.parse(req.body);

      const updatedJobPosting = await JobPostingService.updateJobPostingById(
        jobId,
        newUpdate
      );

      res.status(200).json({
        data: updatedJobPosting,
      });
      return;
    } catch (error) {
      if (
        error instanceof ResourceNotFoundError ||
        error instanceof UnauthorizedError ||
        error instanceof ForbiddenError
      ) {
        res
          .status(error.statusCode)
          .json({ errors: [{ message: error.message }] });
        return;
      }
      const unknownError = handleError(error);
      res.status(unknownError.statusCode).json({ errors: unknownError.errors });
      return;
    }
  },
  deleteJobPosting: async (req: Request, res: Response) => {
    try {
      const { jobId } = JobIdSchema.parse(req.params);
      const deletedJobPosting = await JobPostingService.deleteJobPostingById(
        jobId
      );

      res.status(200).json({
        data: deletedJobPosting,
      });
      return;
    } catch (error) {
      if (
        error instanceof ResourceNotFoundError ||
        error instanceof UnauthorizedError ||
        error instanceof ForbiddenError
      ) {
        res
          .status(error.statusCode)
          .json({ errors: [{ message: error.message }] });
        return;
      }
      const unknownError = handleError(error);
      res.status(unknownError.statusCode).json({ errors: unknownError.errors });
      return;
    }
  },
};

export default JobPostingController;
