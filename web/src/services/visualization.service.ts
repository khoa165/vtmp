import { VISUALIZATION_STAT } from '@vtmp/server-common/constants';

import { ApplicationRepository } from '@/repositories/application.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';

export const VisualizationService = {
  getVisualizationStats: async () => {
    const applicationsCount =
      await ApplicationRepository.getApplicationsCountByUser();
    const jobPostingsTRend =
      await JobPostingRepository.getJobPostingsTrendByWeek();
    return {
      [VISUALIZATION_STAT.APPLICATIONS_COUNT]: applicationsCount,
      [VISUALIZATION_STAT.JOB_POSTINGS_TREND]: jobPostingsTRend,
    };
  },
};
