import { Request, Response } from 'express';
import ApplicationService from '@/services/application.service';
import { z } from 'zod';

const ApplicationRequestSchema = z.object({
  jobPostingId: z.string(),
});

const ApplicationController = {
  createApplication: async (req: Request, res: Response) => {
    try {
      const parsed = ApplicationRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'invalid request body' });
      }

      const { jobPostingId } = parsed.data;
      if (!req.user) {
        throw new Error('Unauthorized');
      }

      const userId = req.user.id;

      const application = await ApplicationService.createApplication({
        jobPostingId,
        userId,
      });

      return res.status(201).json({
        message: 'Application created successfully',
        data: application,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occured';
      return res.status(401).json({ message: errorMessage });
    }
  },
  getAllApplications: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Unauthorized user');
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
