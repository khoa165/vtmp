import { Request, Response } from 'express';
import ApplicationService from '@/services/application.service';
import { z } from 'zod';

const ApplicationRequestSchema = z.object({
  jobPostingId: z.string(),
});

const ApplicationController = {
  createApplication: async (req: Request, res: Response) => {
    try {
      // Validate req object with Zod
      const parsed = ApplicationRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new Error('Invalid application request body');
      }

      // Extract jobPostingId from the validated data
      const { jobPostingId } = parsed.data;

      if (!req.user) {
        throw new Error('Unauthorized user');
      }

      // Extract req.user to get userId (authenticated)
      const userId = req.user.id;

      // Call ApplicationService.createApplication({userId: userId, …req.body})
      const application = await ApplicationService.createApplication({
        jobPostingId,
        userId,
      });

      // Prepare res object to send back
      res.status(201).json({
        message: 'Application created successfully',
        data: application,
      });
    } catch (error) {
      res.status(401).json(error);
    }
  },
  getAllApplications: async (req: Request, res: Response) => {
    try {
      // Extract req.user to get userId (authenticated)
      if (!req.user) {
        throw new Error('Unauthorized user');
      }
      const userId = req.user.id;

      // Call ApplicationService.getAllApplications({userId: userId})
      const applications = await ApplicationService.getAllApplications({
        userId,
      });

      // Prepare res object to send back
      res.status(200).json({
        message: 'Get Applications Successfully',
        data: applications,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getOneApplication: async (req: Request, res: Response) => {
    try {
      // Extract req.user to get userId (authenticated)
      if (!req.user) {
        throw new Error('Unauthorized user');
      }
      const userId = req.user.id;

      // Check if parameter is passed to request and extract applicationId
      if (!req.params.applicationId) {
        throw new Error('Application ID parameter is required.');
      }
      const applicationId = req.params.applicationId;

      // Call ApplicationService.getOneApplication({applicationId: userId})
      const application = await ApplicationService.getOneApplication({
        applicationId,
        userId,
      });

      res.status(200).json({
        message: 'Get Application Successfully',
        data: application,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default ApplicationController;
