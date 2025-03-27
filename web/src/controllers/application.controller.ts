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
};

export default ApplicationController;
