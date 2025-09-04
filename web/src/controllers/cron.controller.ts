import { Request, Response } from 'express';

import { CronService } from '@/services/link/cron.service';
import { LinkIdSchema } from '@/types/link.types';

export const CronController = {
  trigger: async (_req: Request, res: Response) => {
    const result = await CronService.trigger();
    res.status(200).json({
      message: 'Cron job has finished successfully.',
      data: result,
    });
  },

  processIndividualLink: async (req: Request, res: Response) => {
    const parsedLink = LinkIdSchema.parse(req.params);
    const result = await CronService.processIndividualLink(parsedLink.linkId);
    res.status(200).json({
      message: 'Individual link processing has finished successfully.',
      data: result,
    });
  },
};
