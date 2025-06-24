import { Request, Response } from 'express';
import { VisualizationService } from '@/services/visualization.service';

export const VisualizationController = {
  getVisualizationStats: async (req: Request, res: Response) => {
    const visualizationStats =
      await VisualizationService.getVisualizationStats();

    res.status(200).json({
      message: 'Applications count by user retrieved successfully',
      data: visualizationStats,
    });
  },
};
