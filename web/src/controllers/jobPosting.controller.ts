import { Request, Response } from 'express';
import { z } from 'zod';
import JobPostingService from '@/services/jobPosting.service';
import {
  ResourceNotFoundError,
  UnauthorizedError,
  ForbiddenError,
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
  updateJobPosting: async (req: Request, res: Response): Promise<any> => {
    try {
      const resultId = JobIdSchema.safeParse(req.params);
      const resultNewUpdate = NewUpdateSchema.safeParse(req.body);

      if (!resultId.success || !resultNewUpdate.success) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Invalid request' }] });
      }

      const jobId = resultId.data?.jobId as string;
      const newUpdate = resultNewUpdate.data as object;

      const updatedJobPosting = await JobPostingService.updateJobPostingById(
        jobId,
        newUpdate
      );

      return res.status(200).json({
        data: updatedJobPosting,
      });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return res.status(error.statusCode);
      } else if (error instanceof UnauthorizedError) {
        return res.status(error.statusCode);
      } else if (error instanceof ForbiddenError) {
        return res.status(error.statusCode);
      } else {
        res.status(500);
      }

      return res.json({ errors: [{ message: 'An error occurred' }] });
    }
  },
  deleteJobPosting: async (req: Request, res: Response): Promise<any> => {
    try {
      const resultId = JobIdSchema.safeParse(req.params);

      if (!resultId.success) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Invalid request' }] });
      }

      const jobId = resultId.data?.jobId as string;
      const deletedJobPosting = await JobPostingService.deleteJobPostingById(
        jobId
      );

      return res.status(200).json({
        data: deletedJobPosting,
      });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return res.status(error.statusCode);
      } else if (error instanceof UnauthorizedError) {
        return res.status(error.statusCode);
      } else if (error instanceof ForbiddenError) {
        return res.status(error.statusCode);
      } else if (error instanceof Error) {
        res.status(500);
      }

      return res.json({ errors: [{ message: 'An error occurred' }] });
    }
  },
};

export default JobPostingController;
