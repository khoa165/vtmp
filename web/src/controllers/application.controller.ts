import { Request, Response } from 'express';
import ApplicationService from '@/services/application.service';
import { z } from 'zod';
import { handleError } from '@/utils/errors';

const ApplicationRequestSchema = z.object({
  jobPostingId: z.string(),
});

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

const ApplicationController = {
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
      if (!req.user) {
        throw new UnauthorizedError('Unauthorized user', { resource: 'User' });
      }
      const userId = req.user.id;

      const applications = await ApplicationService.getAllApplications(userId);

      return res.status(200).json({
        message: 'Get Applications Successfully',
        data: applications,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'an error occured';
      return res.status(500).json({ message: errorMessage });
    }
  },
  getOneApplication: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Unauthorized user');
      }
      const userId = req.user.id;

      if (!req.params.applicationId) {
        throw new Error('Application ID parameter is required.');
      }
      const applicationId = req.params.applicationId;

      const application = await ApplicationService.getOneApplication({
        applicationId,
        userId,
      });

      return res.status(200).json({
        message: 'Get Application Successfully',
        data: application,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

export default ApplicationController;
