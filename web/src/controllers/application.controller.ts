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
        throw new Error('Invalid application request schema');
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

      res.status(201).json({
        message: 'Application created successfully',
        data: application,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occured';
      res.status(401).json({ message: errorMessage });
    }
  },
};

export default ApplicationController;
