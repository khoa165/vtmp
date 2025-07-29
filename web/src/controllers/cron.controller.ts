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

  requestTriggerLinks: async (req: Request, res: Response) => {
    const parsedLinkId = LinkIdSchema.parse(req.params);
    const result = await CronService.requestTriggerLinks(parsedLinkId.linkId);

    res.status(200).json({
      message: 'Retry Link Processing has finished successfully',
      data: result,
    });
  },
};
