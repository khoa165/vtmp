import { Response } from 'express';

import { VisualizationService } from '@/services/visualization.service';

export const VisualizationController = {
  getVisualizationStats: async (res: Response) => {
    const visualizationStats =
      await VisualizationService.getVisualizationStats();

    res.status(200).json({
      message: 'Applications count by user retrieved successfully',
      data: visualizationStats,
    });
  },
};
