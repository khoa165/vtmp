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
      const userId = (req as AuthenticatedRequest).user.id;

      const applications = await ApplicationService.getAllApplications(userId);

      res.status(200).json({
        message: 'Get Applications Successfully',
        data: applications,
      });
      return;
    } catch (error) {
      const { statusCode, errors } = handleError(error);
      res.status(statusCode).json({ errors });
      return;
    }
  },
  getOneApplication: async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthenticatedRequest).user.id;

      if (!req.params.applicationId) {
        res.status(400).json({
          message: 'Missing Application ID Parameter',
        });
        return;
      }
      const applicationId = req.params.applicationId;

      const application = await ApplicationService.getOneApplication({
        applicationId,
        userId,
      });

      res.status(200).json({
        message: 'Application created successfully',
        data: application,
      });
      return;
    } catch (error) {
      const { statusCode, errors } = handleError(error);
      res.status(statusCode).json({ errors });
      return;
    }
  },
};

export default ApplicationController;
