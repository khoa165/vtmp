import { Request, Response } from 'express';
import { ApplicationService } from '@/services/application.service';
import { z } from 'zod';
import { handleError } from '@/utils/errors';
import mongoose from 'mongoose';

const ApplicationRequestSchema = z.object({
  jobPostingId: z
    .string({ required_error: 'Job posting ID is required' })
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid job posting ID format',
    }),
});

const ApplicationIdParamsSchema = z.object({
  applicationId: z
    .string({ required_error: 'Application ID is required' })
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid application ID format',
    }),
});

// TODO: dson - need to figure out how to remove "as AuthenticatedRequest"
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

export const ApplicationController = {
  createApplication: async (req: Request, res: Response) => {
    try {
      const { jobPostingId } = ApplicationRequestSchema.parse(req.body);

      const userId = (req as AuthenticatedRequest).user.id;

      const newApplication = await ApplicationService.createApplication({
        jobPostingId,
        userId,
      });

      res.status(201).json({
        message: 'Application created successfully',
        data: newApplication,
      });
      return;
    } catch (error: unknown) {
      const { statusCode, errors } = handleError(error);
      res.status(statusCode).json({ errors });
      return;
    }
  },

  getAllApplications: async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthenticatedRequest).user.id;

      const applications = await ApplicationService.getAllApplications(userId);

      res.status(200).json({
        message: 'Applications retrieved successfully',
        data: applications,
      });
      return;
    } catch (error: unknown) {
      const { statusCode, errors } = handleError(error);
      res.status(statusCode).json({ errors });
      return;
    }
  },

  getOneApplication: async (req: Request, res: Response) => {
    try {
      const { applicationId } = ApplicationIdParamsSchema.parse(req.params);
      const userId = (req as AuthenticatedRequest).user.id;

      const application = await ApplicationService.getOneApplication({
        applicationId,
        userId,
      });

      res.status(200).json({
        message: 'Application retrieved successfully',
        data: application,
      });
      return;
    } catch (error: unknown) {
      const { statusCode, errors } = handleError(error);
      res.status(statusCode).json({ errors });
      return;
    }
  },
};
