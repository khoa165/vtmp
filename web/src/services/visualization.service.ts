import { ApplicationRepository } from '@/repositories/application.repository';

export const VisualizationService = {
  getVisualizationStats: async () => {
    return ApplicationRepository.getApplicationsCountByUser();
  },
};
