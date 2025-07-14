import { Request, Response } from 'express';

import { CronService } from '@/services/link/cron.service';

export const CronController = {
  trigger: async (_req: Request, res: Response) => {
    const result = await CronService.trigger();
    res.status(200).json({
      message: 'Cron job has finished successfully.',
      data: result,
    });
  },
};
