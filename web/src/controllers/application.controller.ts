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
    } catch (error) {
      const handledError = handleError(error);
      res.status(handledError.statusCode).json(handledError.errors);
      return;
    }
  },
};

export default ApplicationController;
